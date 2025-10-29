import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../index';
import type { AuthCtx } from '../auth.model';
import { STORAGE_KEY } from '../auth.model';

// Test component to use the hook
const TestComponent = () => {
  const { user, signin, signinGuest, signout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'null'}</div>
      <div data-testid="is-guest">{user?.isGuest ? 'true' : 'false'}</div>
      <button onClick={() => signin('testuser')}>Sign In</button>
      <button onClick={signinGuest}>Sign In Guest</button>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('AuthProvider', () => {
    it('should render children without errors', () => {
      renderWithProvider();
      expect(screen.getByTestId('user')).toBeInTheDocument();
    });

    it('should load user from localStorage on mount', () => {
      const mockUser = { name: 'testuser', exp: Date.now() + 1000000 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

      renderWithProvider();
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
    });

    it('should ignore expired user from localStorage', () => {
      const expiredUser = { name: 'expireduser', exp: Date.now() - 1000000 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredUser));

      renderWithProvider();
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  describe('useAuth', () => {
    it('should return initial null user state', () => {
      renderWithProvider();
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    it('should handle user signin', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const signinButton = screen.getByText('Sign In');
      await user.click(signinButton);

      expect(screen.getByTestId('user')).toHaveTextContent('testuser');
      expect(screen.getByTestId('is-guest')).toHaveTextContent('false');
    });

    it('should handle guest signin', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const guestButton = screen.getByText('Sign In Guest');
      await user.click(guestButton);

      expect(screen.getByTestId('user')).toHaveTextContent('Guest');
      expect(screen.getByTestId('is-guest')).toHaveTextContent('true');
    });

    it('should handle signout', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // First sign in
      const signinButton = screen.getByText('Sign In');
      await user.click(signinButton);

      expect(screen.getByTestId('user')).toHaveTextContent('testuser');

      // Then sign out
      const signoutButton = screen.getByText('Sign Out');
      await user.click(signoutButton);

      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    it('should persist user state to localStorage', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const signinButton = screen.getByText('Sign In');
      await user.click(signinButton);

      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(storedUser.name).toBe('testuser');
      expect(storedUser.exp).toBeGreaterThan(Date.now());
    });

    it('should add expiry to signed in users', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const signinButton = screen.getByText('Sign In');
      await user.click(signinButton);

      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const expectedExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      expect(storedUser.exp).toBeGreaterThan(expectedExpiry - 5000); // Allow 5s tolerance
      expect(storedUser.exp).toBeLessThan(expectedExpiry + 5000);
    });
  });

  describe('Context Validation', () => {
    it('should throw error when useAuth is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Auto-expiry', () => {
    it('should handle timer-based expiry check', async () => {
      vi.useFakeTimers();
      
      const mockUser = { 
        name: 'testuser', 
        exp: Date.now() + 1000 // Will expire in 1 second
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));

      renderWithProvider();
      expect(screen.getByTestId('user')).toHaveTextContent('testuser');

      // Fast-forward time past expiry
      act(() => {
        vi.advanceTimersByTime(31000); // Past expiry check interval
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('null');
      });

      vi.useRealTimers();
    });
  });
});