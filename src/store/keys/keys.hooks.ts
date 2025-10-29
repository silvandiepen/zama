import { useContext } from 'react';
import { Ctx } from './keys.context';

/**
 * Hook to access the API keys context.
 * @throws {Error} If used outside of KeysProvider.
 * @returns {Object} The API keys context value.
 */
export function useKeys() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useKeys must be used within KeysProvider');
  return ctx;
}