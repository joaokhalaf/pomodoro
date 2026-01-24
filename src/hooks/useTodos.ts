import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import type { Todo } from "../types";

export const useTodos = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

  const addTodo = useCallback(
    (text: string) => {
      const newTodo: Todo = { id: Date.now(), text, completed: false };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: number) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: number) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  const reorderTodos = useCallback(
    (fromIndex: number, toIndex: number) => {
      setTodos((prevTodos) => {
        const result = [...prevTodos];
        const [removed] = result.splice(fromIndex, 1);
        result.splice(toIndex, 0, removed);
        return result;
      });
    },
    [setTodos]
  );

  return { todos, addTodo, toggleTodo, deleteTodo, reorderTodos };
};
