export type User = { name: string; isGuest?: boolean; exp?: number } | null;

export type AuthCtx = {
  user: User;
  signin: (name: string) => void;
  signinGuest: () => void;
  signout: () => void;
};

export const STORAGE_KEY = 'zama-app:auth-user';