import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should start with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('should add a new todo', () => {
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test task');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0]).toMatchObject({
      text: 'Test task',
      completed: false,
    });
    expect(result.current.todos[0].id).toBe(Date.now());
  });

  it('should add multiple todos', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
      result.current.addTodo('Task 1');
    });

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:01.000Z'));
      result.current.addTodo('Task 2');
    });

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:02.000Z'));
      result.current.addTodo('Task 3');
    });

    expect(result.current.todos).toHaveLength(3);
    expect(result.current.todos.map((t) => t.text)).toEqual(['Task 1', 'Task 2', 'Task 3']);
  });

  it('should toggle todo completion status', () => {
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Toggle me');
    });

    const todoId = result.current.todos[0].id;
    expect(result.current.todos[0].completed).toBe(false);

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
      result.current.addTodo('Task 1');
    });

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:01.000Z'));
      result.current.addTodo('Task 2');
    });

    const todoIdToDelete = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoIdToDelete);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('Task 2');
  });

  it('should persist todos to localStorage', () => {
    vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Persistent task');
    });

    const stored = JSON.parse(localStorage.getItem('todos')!);
    expect(stored).toHaveLength(1);
    expect(stored[0].text).toBe('Persistent task');
  });

  it('should load existing todos from localStorage', () => {
    const existingTodos = [
      { id: 1, text: 'Existing task 1', completed: false },
      { id: 2, text: 'Existing task 2', completed: true },
    ];
    localStorage.setItem('todos', JSON.stringify(existingTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual(existingTodos);
  });

  it('should only toggle the specified todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));
      result.current.addTodo('Task 1');
    });

    act(() => {
      vi.setSystemTime(new Date('2024-01-01T12:00:01.000Z'));
      result.current.addTodo('Task 2');
    });

    const secondTodoId = result.current.todos[1].id;

    act(() => {
      result.current.toggleTodo(secondTodoId);
    });

    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[1].completed).toBe(true);
  });
});
