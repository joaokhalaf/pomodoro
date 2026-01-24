import { useState } from 'react';
import type { Todo } from '../types';
import { FaPlus, FaTrash, FaGripVertical } from "react-icons/fa6";

interface TodoListProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onReorderTodos?: (fromIndex: number, toIndex: number) => void;
}

export function TodoList({ todos, onAddTodo, onToggleTodo, onDeleteTodo, onReorderTodos }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = draggedIndex;
    if (fromIndex !== null && fromIndex !== toIndex && onReorderTodos) {
      onReorderTodos(fromIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  return (
    <div className="backdrop-blur-xl bg-black/20 border-white/10 p-6 rounded-xl shadow-xl h-full flex flex-col">
      <h2 className="text-lg font-mono font-bold mb-4">TODO LIST</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-white/10 p-2 rounded-lg border-2 border-transparent focus:border-cyan-400/50 focus:outline-none placeholder-gray-400"
        />
        <button type="submit" className="p-3 bg-cyan-500/80 rounded-lg hover:bg-cyan-600/80 transition-colors">
          <FaPlus size={14} />
        </button>
      </form>
      <ul className="space-y-2 overflow-y-auto flex-grow pr-2">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            draggable={!!onReorderTodos}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center bg-white/5 p-3 rounded-lg group transition-all ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${
              dragOverIndex === index && draggedIndex !== index
                ? 'border-t-2 border-cyan-400'
                : 'border-t-2 border-transparent'
            } ${onReorderTodos ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
            {onReorderTodos && (
              <span className="text-gray-500 mr-2 cursor-grab">
                <FaGripVertical size={12} />
              </span>
            )}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggleTodo(todo.id)}
              className="w-5 h-5 rounded bg-white/20 border-none mr-4 accent-green-400 cursor-pointer"
            />
            <span className={`flex-grow transition-colors ${todo.completed ? 'line-through text-gray-400' : ''}`}>
              {todo.text}
            </span>
            <button onClick={() => onDeleteTodo(todo.id)} className="text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <FaTrash size={14} />
            </button>
          </li>
        ))}
         {todos.length === 0 && (
            <p className="text-center text-gray-400 py-4">No tasks yet. Add one!</p>
        )}
      </ul>
    </div>
  );
}
