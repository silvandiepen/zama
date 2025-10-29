import { createContext } from "react";
import type { ToastCtx } from "./toast.model";

export const Ctx = createContext<ToastCtx | undefined>(undefined);
