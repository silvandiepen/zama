import { createContext } from "react";
import type { FlagsCtx } from "./featureFlags.model";

export const Ctx = createContext<FlagsCtx | undefined>(undefined);
