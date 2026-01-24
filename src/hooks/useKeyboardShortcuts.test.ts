import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  const mockOnToggle = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call onToggle when Space is pressed', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const event = new KeyboardEvent('keydown', { code: 'Space' });
    document.dispatchEvent(event);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should call onReset when R is pressed', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const event = new KeyboardEvent('keydown', { code: 'KeyR' });
    document.dispatchEvent(event);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).not.toHaveBeenCalled();
  });

  it('should not call onReset when Ctrl+R is pressed', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const event = new KeyboardEvent('keydown', { code: 'KeyR', ctrlKey: true });
    document.dispatchEvent(event);

    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should not call onReset when Cmd+R is pressed', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const event = new KeyboardEvent('keydown', { code: 'KeyR', metaKey: true });
    document.dispatchEvent(event);

    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should not respond to other keys', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const event = new KeyboardEvent('keydown', { code: 'KeyA' });
    document.dispatchEvent(event);

    expect(mockOnToggle).not.toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should ignore shortcuts when focus is on input', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
    Object.defineProperty(event, 'target', { value: input });
    input.dispatchEvent(event);

    expect(mockOnToggle).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should ignore shortcuts when focus is on textarea', () => {
    renderHook(() => useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset }));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    const event = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
    Object.defineProperty(event, 'target', { value: textarea });
    textarea.dispatchEvent(event);

    expect(mockOnToggle).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ onToggle: mockOnToggle, onReset: mockOnReset })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
