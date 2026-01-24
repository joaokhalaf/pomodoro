import { FaFire, FaClock, FaCalendarDay, FaTrophy } from 'react-icons/fa6';
import type { PomodoroStats } from '../types';

interface StatsPanelProps {
  stats: PomodoroStats;
  onReset?: () => void;
}

export function StatsPanel({ stats, onReset }: StatsPanelProps) {
  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="backdrop-blur-xl bg-black/20 border-white/10 p-4 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300 tracking-wider">STATS</h3>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <FaCalendarDay className="text-orange-400 text-sm" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{stats.todaySessions}</p>
            <p className="text-xs text-gray-400">Today</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <FaClock className="text-cyan-400 text-sm" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{formatMinutes(stats.todayFocusMinutes)}</p>
            <p className="text-xs text-gray-400">Focus today</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <FaTrophy className="text-purple-400 text-sm" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{stats.totalSessions}</p>
            <p className="text-xs text-gray-400">Total sessions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <FaFire className="text-green-400 text-sm" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{formatMinutes(stats.totalFocusMinutes)}</p>
            <p className="text-xs text-gray-400">Total focus</p>
          </div>
        </div>
      </div>
    </div>
  );
}
