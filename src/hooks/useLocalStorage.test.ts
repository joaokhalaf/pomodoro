import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    expect(result.current[0]).toBe('initialValue');
  });

  it('should return stored value from localStorage', () => {
    localStorage.setItem('existingKey', JSON.stringify('storedValue'));
    const { result } = renderHook(() => useLocalStorage('existingKey', 'initialValue'));
    expect(result.current[0]).toBe('storedValue');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('updateKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('updateKey')!)).toBe('updated');
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counterKey', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('should handle complex objects', () => {
    const initialObject = { name: 'test', items: [1, 2, 3] };
    const { result } = renderHook(() => useLocalStorage('objectKey', initialObject));

    expect(result.current[0]).toEqual(initialObject);

    act(() => {
      result.current[1]({ name: 'updated', items: [4, 5, 6] });
    });

    expect(result.current[0]).toEqual({ name: 'updated', items: [4, 5, 6] });
  });

  it('should handle arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('arrayKey', []));

    act(() => {
      result.current[1](['item1', 'item2']);
    });

    expect(result.current[0]).toEqual(['item1', 'item2']);
  });
});
