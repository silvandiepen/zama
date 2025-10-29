import { useContext } from "react";
import { Ctx } from "./toast.context";

/**
 * Hook to access the toast context.
 * @throws {Error} If used outside of ToastProvider.
 * @returns {Object} The toast context value.
 */
export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}