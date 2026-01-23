import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TimerDisplay } from './TimerDisplay';

describe('TimerDisplay', () => {
  it('should display formatted time', () => {
    render(<TimerDisplay formattedTime="25:00" progress={100} isBreak={false} />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should display different time values', () => {
    render(<TimerDisplay formattedTime="05:30" progress={50} isBreak={false} />);
    expect(screen.getByText('05:30')).toBeInTheDocument();
  });

  it('should show green progress bar during work mode', () => {
    const { container } = render(
      <TimerDisplay formattedTime="25:00" progress={50} isBreak={false} />
    );
    const progressBar = container.querySelector('.bg-green-400');
    expect(progressBar).toBeInTheDocument();
  });

  it('should show orange progress bar during break mode', () => {
    const { container } = render(
      <TimerDisplay formattedTime="05:00" progress={50} isBreak={true} />
    );
    const progressBar = container.querySelector('.bg-orange-400');
    expect(progressBar).toBeInTheDocument();
  });

  it('should set progress bar width correctly', () => {
    const { container } = render(
      <TimerDisplay formattedTime="25:00" progress={75} isBreak={false} />
    );
    const progressBar = container.querySelector('.bg-green-400');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('should handle 0% progress', () => {
    const { container } = render(
      <TimerDisplay formattedTime="00:00" progress={0} isBreak={false} />
    );
    const progressBar = container.querySelector('.bg-green-400');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('should handle 100% progress', () => {
    const { container } = render(
      <TimerDisplay formattedTime="25:00" progress={100} isBreak={false} />
    );
    const progressBar = container.querySelector('.bg-green-400');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });
});
