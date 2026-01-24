import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onToggle?: () => void;
  onReset?: () => void;
}

export const useKeyboardShortcuts = ({ onToggle, onReset }: KeyboardShortcuts) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onToggle?.();
          break;
        case 'KeyR':
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            onReset?.();
          }
          break;
      }
    },
    [onToggle, onReset]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
