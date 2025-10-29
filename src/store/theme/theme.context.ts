import { createContext } from 'react';
import type { ThemeCtx } from './theme.model';

export const Ctx = createContext<ThemeCtx | undefined>(undefined);
