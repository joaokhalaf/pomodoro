import type { PomodoroConfig } from "../types";
import { usePomodoro } from "../hooks/usePomodoro";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ModeDisplay } from "./timer/ModeDisplay";
import { SessionTracker } from "./timer/SessionTracker";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerControls } from "./timer/TimerControls";

interface PomodoroTimerProps {
  config: PomodoroConfig;
  onOpenSettings: () => void;
  onSessionComplete?: (workMinutes: number) => void;
}

export function PomodoroTimer({ config, onOpenSettings, onSessionComplete }: PomodoroTimerProps) {
  const {
    timeLeft,
    isActive,
    isBreak,
    isLongBreak,
    sessions,
    toggleTimer,
    resetTimer,
    formatTime,
    totalDuration,
  } = usePomodoro(config, { onSessionComplete });

  useKeyboardShortcuts({
    onToggle: toggleTimer,
    onReset: resetTimer,
  });

  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="backdrop-blur-xl bg-black/20 border-white/10 p-6 rounded-xl shadow-xl">
      <div className="text-center space-y-4">
        <ModeDisplay
            isBreak={isBreak}
            isLongBreak={isLongBreak}
            onOpenSettings={onOpenSettings}
        />
        <SessionTracker
            sessions={sessions}
            config={config}
        />
        <TimerDisplay
            formattedTime={formatTime(timeLeft)}
            progress={progress}
            isBreak={isBreak}
        />
        <TimerControls
            isActive={isActive}
            onToggle={toggleTimer}
            onReset={resetTimer}
        />
        <div className="text-xs text-gray-500 mt-4">
          <span className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono">Space</span>
          <span className="mx-1">to pause/resume</span>
          <span className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400 font-mono ml-2">R</span>
          <span className="mx-1">to reset</span>
        </div>
      </div>
    </div>
  );
}
