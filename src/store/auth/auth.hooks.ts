import React from 'react';
import { Ctx } from './auth.context';

/**
 * Hook to access the authentication context.
 * @throws {Error} If used outside of AuthProvider.
 * @returns {AuthCtx} The authentication context value.
 */
export function useAuth() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}