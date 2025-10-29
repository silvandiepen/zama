import React, { useEffect, useMemo, useState } from 'react';
import { Ctx } from './auth.context';
import { STORAGE_KEY, type User } from './auth.model';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as User;
      if (parsed && (parsed as any).exp && Date.now() > (parsed as any).exp!) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const withExpiry = (u: Exclude<User, null>) => ({ ...u, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const signin = (name: string) => setUser(withExpiry({ name }));
  const signinGuest = () => setUser(withExpiry({ name: 'Guest', isGuest: true }));
  const signout = () => setUser(null);

  // Periodically check expiry
  useEffect(() => {
    const id = window.setInterval(() => {
      setUser(prev => {
        if (prev && prev.exp && Date.now() > prev.exp) return null;
        return prev;
      });
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo(() => ({ user, signin, signinGuest, signout }), [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};