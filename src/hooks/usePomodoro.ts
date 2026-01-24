import { useState, useEffect, useRef, useMemo } from 'react';
import type { PomodoroConfig } from '../types';

const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Audio not supported, fail silently
  }
};

interface UsePomodoroOptions {
  onSessionComplete?: (workMinutes: number) => void;
}

export const usePomodoro = (config: PomodoroConfig, options?: UsePomodoroOptions) => {
  const [timeLeft, setTimeLeft] = useState(config.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = useMemo(() => {
    if (isBreak) {
      return isLongBreak ? config.longBreakDuration * 60 : config.shortBreakDuration * 60;
    }
    return config.workDuration * 60;
  }, [isBreak, isLongBreak, config.longBreakDuration, config.shortBreakDuration, config.workDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (config.soundNotifications) {
        playNotificationSound();
      }

      if (!isBreak) {
        // Work session completed
        options?.onSessionComplete?.(config.workDuration);

        setSessions((prev) => {
          const newSessions = prev + 1;
          const shouldLongBreak = newSessions % config.sessionsUntilLongBreak === 0;

          setIsLongBreak(shouldLongBreak);
          setIsBreak(true);
          setTimeLeft(shouldLongBreak ? config.longBreakDuration * 60 : config.shortBreakDuration * 60);

          if (!config.autoStartBreak) setIsActive(false);

          return newSessions;
        });
      } else {
        setIsBreak(false);
        setIsLongBreak(false);
        setTimeLeft(config.workDuration * 60);

        if (!config.autoStartWork) setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak, isLongBreak, config, options]);

  // Reset timer when config changes
  useEffect(() => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setSessions(0);
    setTimeLeft(config.workDuration * 60);
  }, [config]);


  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setSessions(0);
    setTimeLeft(config.workDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isActive,
    isBreak,
    isLongBreak,
    sessions,
    toggleTimer,
    resetTimer,
    formatTime,
    totalDuration,
  };
};
