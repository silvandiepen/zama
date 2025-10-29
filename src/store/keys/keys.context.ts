import { createContext } from 'react';
import type { KeysCtx } from './keys.model';

export const Ctx = createContext<KeysCtx | undefined>(undefined);
