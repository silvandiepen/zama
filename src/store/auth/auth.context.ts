import { createContext } from 'react';
import type { AuthCtx } from './auth.model';

export const Ctx = createContext<AuthCtx | undefined>(undefined);
