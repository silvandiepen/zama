
export type ToastVariant = "info" | "success" | "warning" | "error";
export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  color?: string;
  duration?: number;
  closing?: boolean;
};

export type ToastCtx = {
  toasts: ToastItem[];
  addToast: (t: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
};
