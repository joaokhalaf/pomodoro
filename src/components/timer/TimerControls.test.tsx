import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimerControls } from './TimerControls';

describe('TimerControls', () => {
  const mockOnToggle = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should show START button when timer is inactive', () => {
      render(
        <TimerControls isActive={false} onToggle={mockOnToggle} onReset={mockOnReset} />
      );
      expect(screen.getByText('START')).toBeInTheDocument();
    });

    it('should show PAUSE button when timer is active', () => {
      render(
        <TimerControls isActive={true} onToggle={mockOnToggle} onReset={mockOnReset} />
      );
      expect(screen.getByText('PAUSE')).toBeInTheDocument();
    });

    it('should always show RESET button', () => {
      render(
        <TimerControls isActive={false} onToggle={mockOnToggle} onReset={mockOnReset} />
      );
      expect(screen.getByText('RESET')).toBeInTheDocument();
    });

    it('should have green background when inactive', () => {
      render(
        <TimerControls isActive={false} onToggle={mockOnToggle} onReset={mockOnReset} />
      );
      const startButton = screen.getByText('START').closest('button');
      expect(startButton).toHaveClass('bg-green-500/80');
    });

    it('should have red background when active', () => {
      render(
        <TimerControls isActive={true} onToggle={mockOnToggle} onReset={mockOnReset} />
      );
      const pauseButton = screen.getByText('PAUSE').closest('button');
      expect(pauseButton).toHaveClass('bg-red-500/80');
    });
  });

  describe('interactions', () => {
    it('should call onToggle when START button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls isActive={false} onToggle={mockOnToggle} onReset={mockOnReset} />
      );

      await user.click(screen.getByText('START'));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onToggle when PAUSE button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls isActive={true} onToggle={mockOnToggle} onReset={mockOnReset} />
      );

      await user.click(screen.getByText('PAUSE'));
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should call onReset when RESET button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TimerControls isActive={false} onToggle={mockOnToggle} onReset={mockOnReset} />
      );

      await user.click(screen.getByText('RESET'));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });
});
