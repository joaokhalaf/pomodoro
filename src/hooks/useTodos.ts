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

  return { todos, addTodo, toggleTodo, deleteTodo };
};
