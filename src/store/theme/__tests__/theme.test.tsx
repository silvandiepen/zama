import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from '../index';
import { STORAGE_KEY } from '../theme.model';

// Test component to use the hook
const TestComponent = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );
};

describe('Theme Store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('color-mode');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('color-mode');
  });

  describe('ThemeProvider', () => {
    it('should render children without errors', () => {
      renderWithProvider();
      expect(screen.getByTestId('theme')).toBeInTheDocument();
    });

    it('should load theme from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      renderWithProvider();
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should default to light theme if no stored theme', () => {
      renderWithProvider();
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should ignore invalid stored theme and default to light', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid');
      renderWithProvider();
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  describe('useTheme', () => {
    it('should return initial theme state', () => {
      renderWithProvider();
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should handle theme change to light', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // First change to dark
      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      // Then change to light
      const lightButton = screen.getByText('Light');
      await user.click(lightButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should handle theme change to dark', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    it('should handle theme toggle', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      expect(screen.getByTestId('theme')).toHaveTextContent('light');

      const toggleButton = screen.getByText('Toggle');
      await user.click(toggleButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');

      await user.click(toggleButton);
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    it('should persist theme to localStorage', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);

      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    });
  });

  describe('DOM Theme Application', () => {
    it('should apply dark theme attributes to document when theme is dark', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.getAttribute('color-mode')).toBe('dark');
    });

    it('should apply light theme attributes to document when theme is light', async () => {
      const user = userEvent.setup();
      localStorage.setItem(STORAGE_KEY, 'dark'); // Start with dark
      renderWithProvider();

      const lightButton = screen.getByText('Light');
      await user.click(lightButton);

      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
      expect(document.documentElement.getAttribute('color-mode')).toBe('light');
    });

    it('should set color-mode attribute for both themes', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Light theme
      expect(document.documentElement.getAttribute('color-mode')).toBe('light');

      // Dark theme
      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);
      expect(document.documentElement.getAttribute('color-mode')).toBe('dark');

      // Back to light
      const lightButton = screen.getByText('Light');
      await user.click(lightButton);
      expect(document.documentElement.getAttribute('color-mode')).toBe('light');
    });
  });

  describe('Context Validation', () => {
    it('should throw error when useTheme is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Initial Load Behavior', () => {
    it('should apply theme attributes on initial load', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      renderWithProvider();

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.getAttribute('color-mode')).toBe('dark');
    });

    it('should apply light theme attributes on initial load when no stored theme', () => {
      renderWithProvider();

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
      expect(document.documentElement.getAttribute('color-mode')).toBe('light');
    });
  });
});