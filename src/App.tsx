import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import type { PomodoroConfig } from "./types";
import { useTodos } from "./hooks/useTodos";
import { useBackground } from "./hooks/useBackground";
import { useStats } from "./hooks/useStats";
import { useTheme } from "./hooks/useTheme";

import { PomodoroTimer } from "./components/PomodoroTimer";
import { SettingsModal } from "./components/SettingsModal";
import { CoffeeTracker } from "./components/CoffeTracker";
import { MusicPlayer } from "./components/MusicPlayer";
import { TodoList } from "./components/TodoList";
import { BackgroundSelector } from "./components/Background";
import { StatsPanel } from "./components/StatsPanel";
import { ThemeToggle } from "./components/ThemeToggle";

const initialConfig: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreak: false,
  autoStartWork: false,
  soundNotifications: false
};

function App() {
  const [config, setConfig] = useLocalStorage<PomodoroConfig>('pomodoroConfig', initialConfig);
  const { todos, addTodo, toggleTodo, deleteTodo, reorderTodos } = useTodos();
  const { currentBg, setCurrentBg, backgroundImages } = useBackground();
  const { stats, recordSession, resetStats } = useStats();
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <main
      className="min-h-screen bg-cover bg-center transition-all duration-700 text-white"
      style={{ backgroundImage: `url(${currentBg.url})` }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

      <div className="relative z-10 container mx-auto p-4 md:p-6 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">

          <div className="md:col-span-3 lg:col-span-2 md:row-span-2">
            <PomodoroTimer
              config={config}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onSessionComplete={recordSession}
            />
          </div>

          <div className="lg:col-span-2 md:col-span-3">
            <StatsPanel stats={stats} onReset={resetStats} />
          </div>

          <div className="lg:col-span-2 md:col-span-3">
            <TodoList
              todos={todos}
              onAddTodo={addTodo}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onReorderTodos={reorderTodos}
            />
          </div>

          <div className="grid grid-cols-2 lg:col-span-2 md:col-span-3 gap-6">
            <CoffeeTracker />
            <MusicPlayer />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex gap-3">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <BackgroundSelector
          images={backgroundImages}
          selected={currentBg}
          onSelect={setCurrentBg}
        />
      </div>


      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={(newConfig) => {
          setConfig(newConfig);
          setIsSettingsOpen(false);
        }}
      />
    </main>
  );
}

export default App;
