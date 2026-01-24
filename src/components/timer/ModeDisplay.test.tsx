import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModeDisplay } from './ModeDisplay';

describe('ModeDisplay', () => {
  const mockOnOpenSettings = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mode text', () => {
    it('should display FOCUS when not on break', () => {
      render(
        <ModeDisplay isBreak={false} isLongBreak={false} onOpenSettings={mockOnOpenSettings} />
      );
      expect(screen.getByText('FOCUS')).toBeInTheDocument();
    });

    it('should display SHORT BREAK during short break', () => {
      render(
        <ModeDisplay isBreak={true} isLongBreak={false} onOpenSettings={mockOnOpenSettings} />
      );
      expect(screen.getByText('SHORT BREAK')).toBeInTheDocument();
    });

    it('should display LONG BREAK during long break', () => {
      render(
        <ModeDisplay isBreak={true} isLongBreak={true} onOpenSettings={mockOnOpenSettings} />
      );
      expect(screen.getByText('LONG BREAK')).toBeInTheDocument();
    });
  });

  describe('settings button', () => {
    it('should render settings button', () => {
      render(
        <ModeDisplay isBreak={false} isLongBreak={false} onOpenSettings={mockOnOpenSettings} />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('should call onOpenSettings when settings button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ModeDisplay isBreak={false} isLongBreak={false} onOpenSettings={mockOnOpenSettings} />
      );

      await user.click(screen.getByRole('button'));
      expect(mockOnOpenSettings).toHaveBeenCalledTimes(1);
    });
  });
});
