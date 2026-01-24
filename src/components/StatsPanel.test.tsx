import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatsPanel } from './StatsPanel';
import type { PomodoroStats } from '../types';

describe('StatsPanel', () => {
  const defaultStats: PomodoroStats = {
    totalSessions: 10,
    totalFocusMinutes: 250,
    todaySessions: 3,
    todayFocusMinutes: 75,
    lastSessionDate: '2024-01-15',
  };

  it('should render stats title', () => {
    render(<StatsPanel stats={defaultStats} />);
    expect(screen.getByText('STATS')).toBeInTheDocument();
  });

  it('should display today sessions', () => {
    render(<StatsPanel stats={defaultStats} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should display total sessions', () => {
    render(<StatsPanel stats={defaultStats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Total sessions')).toBeInTheDocument();
  });

  it('should format minutes as hours and minutes', () => {
    render(<StatsPanel stats={defaultStats} />);
    // 75 minutes = 1h 15m
    expect(screen.getByText('1h 15m')).toBeInTheDocument();
    // 250 minutes = 4h 10m
    expect(screen.getByText('4h 10m')).toBeInTheDocument();
  });

  it('should format minutes less than 60 as just minutes', () => {
    const stats: PomodoroStats = {
      ...defaultStats,
      todayFocusMinutes: 45,
    };
    render(<StatsPanel stats={stats} />);
    expect(screen.getByText('45m')).toBeInTheDocument();
  });

  it('should format exact hours without minutes', () => {
    const stats: PomodoroStats = {
      ...defaultStats,
      totalFocusMinutes: 120,
    };
    render(<StatsPanel stats={stats} />);
    expect(screen.getByText('2h')).toBeInTheDocument();
  });

  it('should render reset button when onReset is provided', () => {
    const mockOnReset = vi.fn();
    render(<StatsPanel stats={defaultStats} onReset={mockOnReset} />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should not render reset button when onReset is not provided', () => {
    render(<StatsPanel stats={defaultStats} />);
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should call onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnReset = vi.fn();
    render(<StatsPanel stats={defaultStats} onReset={mockOnReset} />);

    await user.click(screen.getByText('Reset'));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should display zero stats correctly', () => {
    const zeroStats: PomodoroStats = {
      totalSessions: 0,
      totalFocusMinutes: 0,
      todaySessions: 0,
      todayFocusMinutes: 0,
      lastSessionDate: '2024-01-15',
    };
    render(<StatsPanel stats={zeroStats} />);

    // Should show multiple 0s
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);

    // Should show 0m for minutes
    const zeroMinutes = screen.getAllByText('0m');
    expect(zeroMinutes.length).toBe(2);
  });
});
