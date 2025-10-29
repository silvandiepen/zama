import React, { useCallback, useMemo, useRef, useState } from "react";
import type { ToastItem } from "./toast.model";
import { Ctx } from "./toast.context";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const removeToast = useCallback((id: string) => {
    // mark closing to trigger CSS animation, then fully remove
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
    );
    const timersMap = timers.current;
    const t = timersMap.get(id);

    if (!t) return;

    window.clearTimeout(t);
    timersMap.delete(id);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const toast: ToastItem = { id, duration: 20500, variant: "info", ...t };
      setToasts((prev) => [toast, ...prev]);
      const timeout = window.setTimeout(() => removeToast(id), toast.duration);
      timers.current.set(id, timeout);
      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};