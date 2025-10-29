import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LocaleProvider, useLocale } from '../index';
import { STORAGE_KEY } from '../locale.model';

// Test component to use the hook
const TestComponent = () => {
  const { lang, setLang } = useLocale();
  return (
    <div>
      <div data-testid="lang">{lang}</div>
      <button onClick={() => setLang('fr')}>French</button>
      <button onClick={() => setLang('nl')}>Dutch</button>
      <button onClick={() => setLang('en')}>English</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <LocaleProvider>
      <TestComponent />
    </LocaleProvider>
  );
};

// Mock i18n
const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn()
};

vi.mock('@/i18n/i18n', () => ({
  default: mockI18n
}));

describe('Locale Store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockI18n.language = 'en';
    mockI18n.changeLanguage.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('LocaleProvider', () => {
    it('should render children without errors', () => {
      renderWithProvider();
      expect(screen.getByTestId('lang')).toBeInTheDocument();
    });

    it('should load language from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'fr');
      renderWithProvider();
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    });

    it('should use i18n.language as fallback', () => {
      mockI18n.language = 'nl';
      renderWithProvider();
      expect(screen.getByTestId('lang')).toHaveTextContent('nl');
    });

    it('should default to English if no stored language and i18n.language is empty', () => {
      mockI18n.language = undefined;
      renderWithProvider();
      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });
  });

  describe('useLocale', () => {
    it('should return initial language state', () => {
      renderWithProvider();
      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });

    it('should handle language change', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const frenchButton = screen.getByText('French');
      await user.click(frenchButton);

      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
      expect(mockI18n.changeLanguage).toHaveBeenCalledWith('fr');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
    });

    it('should handle multiple language changes', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Change to French
      const frenchButton = screen.getByText('French');
      await user.click(frenchButton);
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');

      // Change to Dutch
      const dutchButton = screen.getByText('Dutch');
      await user.click(dutchButton);
      expect(screen.getByTestId('lang')).toHaveTextContent('nl');

      // Change back to English
      const englishButton = screen.getByText('English');
      await user.click(englishButton);
      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });

    it('should persist language to localStorage', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const frenchButton = screen.getByText('French');
      await user.click(frenchButton);

      expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
    });
  });

  describe('Context Validation', () => {
    it('should throw error when useLocale is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLocale must be used within LocaleProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Integration with i18n', () => {
    it('should call i18n.changeLanguage when language changes', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const frenchButton = screen.getByText('French');
      await user.click(frenchButton);

      expect(mockI18n.changeLanguage).toHaveBeenCalledTimes(1);
      expect(mockI18n.changeLanguage).toHaveBeenCalledWith('fr');
    });

    it('should handle i18n errors gracefully', async () => {
      const user = userEvent.setup();
      mockI18n.changeLanguage.mockRejectedValue(new Error('Translation failed'));
      
      renderWithProvider();

      const frenchButton = screen.getByText('French');
      
      // Should not throw error
      await expect(user.click(frenchButton)).resolves.not.toThrow();
      expect(screen.getByTestId('lang')).toHaveTextContent('fr');
    });
  });
});