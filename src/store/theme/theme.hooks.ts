import { useContext } from 'react';
import { Ctx } from './theme.context';

/**
 * Hook to access the theme context.
 * @throws {Error} If used outside of ThemeProvider.
 * @returns {Object} The theme context value.
 */
export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}