import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePomodoro } from './usePomodoro';
import type { PomodoroConfig } from '../types';

const defaultConfig: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreak: false,
  autoStartWork: false,
  soundNotifications: false,
};

describe('usePomodoro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      expect(result.current.timeLeft).toBe(25 * 60);
      expect(result.current.isActive).toBe(false);
      expect(result.current.isBreak).toBe(false);
      expect(result.current.isLongBreak).toBe(false);
      expect(result.current.sessions).toBe(0);
    });

    it('should calculate totalDuration correctly for work mode', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));
      expect(result.current.totalDuration).toBe(25 * 60);
    });
  });

  describe('timer controls', () => {
    it('should toggle timer on/off', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      expect(result.current.isActive).toBe(false);

      act(() => {
        result.current.toggleTimer();
      });

      expect(result.current.isActive).toBe(true);

      act(() => {
        result.current.toggleTimer();
      });

      expect(result.current.isActive).toBe(false);
    });

    it('should reset timer to initial state', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      act(() => {
        result.current.resetTimer();
      });

      expect(result.current.timeLeft).toBe(25 * 60);
      expect(result.current.isActive).toBe(false);
      expect(result.current.isBreak).toBe(false);
      expect(result.current.sessions).toBe(0);
    });
  });

  describe('countdown', () => {
    it('should count down when active', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.timeLeft).toBe(25 * 60 - 3);
    });

    it('should not count down when paused', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      const initialTime = result.current.timeLeft;

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.timeLeft).toBe(initialTime);
    });
  });

  describe('session transitions', () => {
    it('should transition to short break after work session', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1, // 1 minute for faster testing
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(true);
      expect(result.current.isLongBreak).toBe(false);
      expect(result.current.sessions).toBe(1);
      expect(result.current.timeLeft).toBe(5 * 60);
    });

    it('should transition to long break after configured sessions', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        shortBreakDuration: 1,
        sessionsUntilLongBreak: 2,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      // First work session
      act(() => {
        result.current.toggleTimer();
      });
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // First short break
      act(() => {
        result.current.toggleTimer();
      });
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // Second work session
      act(() => {
        result.current.toggleTimer();
      });
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(true);
      expect(result.current.isLongBreak).toBe(true);
      expect(result.current.sessions).toBe(2);
      expect(result.current.timeLeft).toBe(15 * 60);
    });

    it('should return to work mode after break', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        shortBreakDuration: 1,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      // Work session
      act(() => {
        result.current.toggleTimer();
      });
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // Break session
      act(() => {
        result.current.toggleTimer();
      });
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(false);
      expect(result.current.timeLeft).toBe(1 * 60);
    });
  });

  describe('auto-start behavior', () => {
    it('should auto-start break when autoStartBreak is true', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        autoStartBreak: true,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(true);
      expect(result.current.isActive).toBe(true);
    });

    it('should pause after break when autoStartWork is false', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        shortBreakDuration: 1,
        autoStartBreak: true,
        autoStartWork: false,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      // Complete work session
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // Complete break session
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(false);
      expect(result.current.isActive).toBe(false);
    });

    it('should auto-start work when autoStartWork is true', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        shortBreakDuration: 1,
        autoStartBreak: true,
        autoStartWork: true,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      // Complete work session
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      // Complete break session
      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.isBreak).toBe(false);
      expect(result.current.isActive).toBe(true);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const { result } = renderHook(() => usePomodoro(defaultConfig));

      expect(result.current.formatTime(0)).toBe('00:00');
      expect(result.current.formatTime(60)).toBe('01:00');
      expect(result.current.formatTime(90)).toBe('01:30');
      expect(result.current.formatTime(3661)).toBe('61:01');
      expect(result.current.formatTime(5)).toBe('00:05');
    });
  });

  describe('config changes', () => {
    it('should reset timer when config changes', () => {
      const { result, rerender } = renderHook(
        ({ config }) => usePomodoro(config),
        { initialProps: { config: defaultConfig } }
      );

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const newConfig = { ...defaultConfig, workDuration: 30 };
      rerender({ config: newConfig });

      expect(result.current.timeLeft).toBe(30 * 60);
      expect(result.current.isActive).toBe(false);
      expect(result.current.sessions).toBe(0);
    });
  });

  describe('totalDuration calculation', () => {
    it('should return correct duration for short break', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.totalDuration).toBe(5 * 60);
    });

    it('should return correct duration for long break', () => {
      const shortConfig: PomodoroConfig = {
        ...defaultConfig,
        workDuration: 1,
        shortBreakDuration: 1,
        sessionsUntilLongBreak: 1,
      };
      const { result } = renderHook(() => usePomodoro(shortConfig));

      act(() => {
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(60 * 1000);
      });

      expect(result.current.totalDuration).toBe(15 * 60);
    });
  });
});
