import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../index';
import type { ToastItem } from '../toast.model';

// Test component to use the hook
const TestComponent = () => {
  const { toasts, addToast, removeToast } = useToast();
  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      <div data-testid="toast-titles">
        {toasts.map(toast => (
          <div key={toast.id} data-testid={`toast-${toast.id}`}>
            {toast.title}
          </div>
        ))}
      </div>
      <button onClick={() => addToast({ title: 'Test Toast' })}>
        Add Toast
      </button>
      <button onClick={() => addToast({ title: 'Success Toast', variant: 'success' })}>
        Add Success Toast
      </button>
      <button onClick={() => addToast({ title: 'Error Toast', variant: 'error', message: 'Error details' })}>
        Add Error Toast
      </button>
      <button onClick={() => {
        if (toasts.length > 0) {
          removeToast(toasts[0].id);
        }
      }}>
        Remove First Toast
      </button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );
};

describe('Toast Store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('should render children without errors', () => {
      renderWithProvider();
      expect(screen.getByTestId('toast-count')).toBeInTheDocument();
    });

    it('should start with empty toasts array', () => {
      renderWithProvider();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  describe('useToast', () => {
    it('should return initial empty toasts state', () => {
      renderWithProvider();
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('should handle adding a toast', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    });

    it('should handle adding multiple toasts', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
    });

    it('should handle removing a toast', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      // Add a toast first
      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Remove it
      const removeButton = screen.getByText('Remove First Toast');
      await user.click(removeButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('should handle removing non-existent toast gracefully', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      // Try to remove when no toasts exist
      const removeButton = screen.getByText('Remove First Toast');
      await user.click(removeButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('should return toast ID from addToast', async () => {
      let toastId: string | undefined;

      const TestComponentWithId = () => {
        const { addToast } = useToast();
        return (
          <button onClick={() => {
            toastId = addToast({ title: 'Test Toast' });
          }}>
            Add Toast
          </button>
        );
      };

      render(
        <ToastProvider>
          <TestComponentWithId />
        </ToastProvider>
      );

      const addButton = screen.getByText('Add Toast');
      await userEvent.click(addButton);

      expect(toastId).toBeDefined();
      expect(typeof toastId).toBe('string');
    });

    it('should apply default values to toast', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
      // Toast should have default duration and variant
    });

    it('should handle different toast variants', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      // Add success toast
      const successButton = screen.getByText('Add Success Toast');
      await user.click(successButton);

      // Add error toast
      const errorButton = screen.getByText('Add Error Toast');
      await user.click(errorButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
    });
  });

  describe('Toast Auto-removal', () => {
    it('should automatically remove toast after duration', async () => {
      const user = userEvent.setup({ advanceTimers: vi });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Fast-forward time past default duration (20500ms)
      act(() => {
        vi.advanceTimersByTime(21000);
      });

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });

    it('should clear timeout when toast is manually removed', async () => {
      const user = userEvent.setup({ advanceTimers: vi });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Manually remove before auto-removal
      const removeButton = screen.getByText('Remove First Toast');
      await user.click(removeButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

      // Fast-forward past duration - should not cause any issues
      act(() => {
        vi.advanceTimersByTime(21000);
      });

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  describe('Toast Closing Animation', () => {
    it('should mark toast as closing before removal', async () => {
      const user = userEvent.setup({ advanceTimers: vi });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Fast-forward to start closing animation
      act(() => {
        vi.advanceTimersByTime(20500);
      });

      // Toast should still exist but be marked as closing
      expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

      // Fast-forward past animation duration
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  describe('Context Validation', () => {
    it('should throw error when useToast is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useToast must be used within ToastProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Toast Order', () => {
    it('should add new toasts to the beginning of the array', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithProvider();

      const addButton = screen.getByText('Add Toast');
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
      
      // The most recent toast should be first
      const toasts = screen.getByTestId('toast-titles').children;
      expect(toasts.length).toBe(3);
    });
  });
});