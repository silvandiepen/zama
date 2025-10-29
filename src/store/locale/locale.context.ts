import { createContext } from 'react';
import type { LocaleCtx } from './locale.model';

export const Ctx = createContext<LocaleCtx | undefined>(undefined);
