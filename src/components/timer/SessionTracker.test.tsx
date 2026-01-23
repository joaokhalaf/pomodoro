import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SessionTracker } from './SessionTracker';
import type { PomodoroConfig } from '../../types';

describe('SessionTracker', () => {
  const defaultConfig: PomodoroConfig = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreak: false,
    autoStartWork: false,
    soundNotifications: false,
  };

  describe('session count display', () => {
    it('should display 0 sessions initially', () => {
      render(<SessionTracker sessions={0} config={defaultConfig} />);
      expect(screen.getByText('Sessions: 0')).toBeInTheDocument();
    });

    it('should display current session count', () => {
      render(<SessionTracker sessions={3} config={defaultConfig} />);
      expect(screen.getByText('Sessions: 3')).toBeInTheDocument();
    });

    it('should display high session counts', () => {
      render(<SessionTracker sessions={15} config={defaultConfig} />);
      expect(screen.getByText('Sessions: 15')).toBeInTheDocument();
    });
  });

  describe('session indicators', () => {
    it('should render correct number of indicator dots', () => {
      const { container } = render(<SessionTracker sessions={0} config={defaultConfig} />);
      const dots = container.querySelectorAll('.rounded-full');
      expect(dots).toHaveLength(4);
    });

    it('should render different number of dots based on config', () => {
      const customConfig = { ...defaultConfig, sessionsUntilLongBreak: 6 };
      const { container } = render(<SessionTracker sessions={0} config={customConfig} />);
      const dots = container.querySelectorAll('.rounded-full');
      expect(dots).toHaveLength(6);
    });

    it('should highlight completed session dots', () => {
      const { container } = render(<SessionTracker sessions={2} config={defaultConfig} />);
      const activeDots = container.querySelectorAll('.bg-cyan-400');
      const inactiveDots = container.querySelectorAll('.bg-white\\/20');
      expect(activeDots).toHaveLength(2);
      expect(inactiveDots).toHaveLength(2);
    });

    it('should reset indicator after completing all sessions for long break', () => {
      const { container } = render(<SessionTracker sessions={4} config={defaultConfig} />);
      const activeDots = container.querySelectorAll('.bg-cyan-400');
      const inactiveDots = container.querySelectorAll('.bg-white\\/20');
      // 4 % 4 = 0, so all dots should be inactive
      expect(activeDots).toHaveLength(0);
      expect(inactiveDots).toHaveLength(4);
    });

    it('should cycle indicators correctly', () => {
      const { container } = render(<SessionTracker sessions={5} config={defaultConfig} />);
      const activeDots = container.querySelectorAll('.bg-cyan-400');
      // 5 % 4 = 1, so one dot should be active
      expect(activeDots).toHaveLength(1);
    });
  });
});
