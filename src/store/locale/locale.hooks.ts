import { useContext } from 'react';
import { Ctx } from './locale.context';

/**
 * Hook to access the locale context.
 * @throws {Error} If used outside of LocaleProvider.
 * @returns {Object} The locale context value.
 */
export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}