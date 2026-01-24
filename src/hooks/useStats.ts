import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import type { PomodoroStats } from '../types';

const getToday = () => new Date().toISOString().split('T')[0];

const initialStats: PomodoroStats = {
  totalSessions: 0,
  totalFocusMinutes: 0,
  todaySessions: 0,
  todayFocusMinutes: 0,
  lastSessionDate: getToday(),
};

export const useStats = () => {
  const [stats, setStats] = useLocalStorage<PomodoroStats>('pomodoroStats', initialStats);

  const recordSession = useCallback(
    (focusMinutes: number) => {
      setStats((prev) => {
        const today = getToday();
        const isNewDay = prev.lastSessionDate !== today;

        return {
          totalSessions: prev.totalSessions + 1,
          totalFocusMinutes: prev.totalFocusMinutes + focusMinutes,
          todaySessions: isNewDay ? 1 : prev.todaySessions + 1,
          todayFocusMinutes: isNewDay ? focusMinutes : prev.todayFocusMinutes + focusMinutes,
          lastSessionDate: today,
        };
      });
    },
    [setStats]
  );

  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, [setStats]);

  // Check if we need to reset daily stats (for when the component mounts on a new day)
  const today = getToday();
  if (stats.lastSessionDate !== today) {
    return {
      stats: {
        ...stats,
        todaySessions: 0,
        todayFocusMinutes: 0,
        lastSessionDate: today,
      },
      recordSession,
      resetStats,
    };
  }

  return { stats, recordSession, resetStats };
};
