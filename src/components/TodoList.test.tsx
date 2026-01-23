import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TodoList } from './TodoList';
import type { Todo } from '../types';

describe('TodoList', () => {
  const mockOnAddTodo = vi.fn();
  const mockOnToggleTodo = vi.fn();
  const mockOnDeleteTodo = vi.fn();

  const defaultProps = {
    todos: [],
    onAddTodo: mockOnAddTodo,
    onToggleTodo: mockOnToggleTodo,
    onDeleteTodo: mockOnDeleteTodo,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component with title', () => {
      render(<TodoList {...defaultProps} />);
      expect(screen.getByText('TODO LIST')).toBeInTheDocument();
    });

    it('should render empty state message when no todos', () => {
      render(<TodoList {...defaultProps} />);
      expect(screen.getByText('No tasks yet. Add one!')).toBeInTheDocument();
    });

    it('should render todos when provided', () => {
      const todos: Todo[] = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: true },
      ];
      render(<TodoList {...defaultProps} todos={todos} />);

      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('No tasks yet. Add one!')).not.toBeInTheDocument();
    });

    it('should show completed todos with line-through', () => {
      const todos: Todo[] = [{ id: 1, text: 'Completed Task', completed: true }];
      render(<TodoList {...defaultProps} todos={todos} />);

      const taskText = screen.getByText('Completed Task');
      expect(taskText).toHaveClass('line-through');
    });

    it('should show checkboxes with correct checked state', () => {
      const todos: Todo[] = [
        { id: 1, text: 'Uncompleted', completed: false },
        { id: 2, text: 'Completed', completed: true },
      ];
      render(<TodoList {...defaultProps} todos={todos} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });
  });

  describe('adding todos', () => {
    it('should render input field and add button', () => {
      render(<TodoList {...defaultProps} />);

      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
    });

    it('should call onAddTodo when form is submitted with valid input', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, 'New Task');
      await user.click(screen.getByRole('button'));

      expect(mockOnAddTodo).toHaveBeenCalledWith('New Task');
    });

    it('should clear input after adding todo', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, 'New Task');
      await user.click(screen.getByRole('button'));

      expect(input).toHaveValue('');
    });

    it('should not call onAddTodo when input is empty', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      await user.click(screen.getByRole('button'));

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    it('should not call onAddTodo when input is only whitespace', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, '   ');
      await user.click(screen.getByRole('button'));

      expect(mockOnAddTodo).not.toHaveBeenCalled();
    });

    it('should trim whitespace from input', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, '  New Task  ');
      await user.click(screen.getByRole('button'));

      expect(mockOnAddTodo).toHaveBeenCalledWith('New Task');
    });

    it('should submit on Enter key', async () => {
      const user = userEvent.setup();
      render(<TodoList {...defaultProps} />);

      const input = screen.getByPlaceholderText('Add a new task...');
      await user.type(input, 'New Task{enter}');

      expect(mockOnAddTodo).toHaveBeenCalledWith('New Task');
    });
  });

  describe('toggling todos', () => {
    it('should call onToggleTodo when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const todos: Todo[] = [{ id: 123, text: 'Task', completed: false }];
      render(<TodoList {...defaultProps} todos={todos} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(mockOnToggleTodo).toHaveBeenCalledWith(123);
    });
  });

  describe('deleting todos', () => {
    it('should render delete buttons for each todo', () => {
      const todos: Todo[] = [
        { id: 1, text: 'Task 1', completed: false },
        { id: 2, text: 'Task 2', completed: false },
      ];
      render(<TodoList {...defaultProps} todos={todos} />);

      const deleteButtons = screen.getAllByRole('button').filter(
        (button) => button.closest('li')
      );
      expect(deleteButtons).toHaveLength(2);
    });

    it('should call onDeleteTodo when delete button is clicked', () => {
      const todos: Todo[] = [{ id: 456, text: 'Task to delete', completed: false }];
      render(<TodoList {...defaultProps} todos={todos} />);

      const deleteButtons = screen.getAllByRole('button').filter(
        (button) => button.closest('li')
      );
      fireEvent.click(deleteButtons[0]);

      expect(mockOnDeleteTodo).toHaveBeenCalledWith(456);
    });
  });
});
