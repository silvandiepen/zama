import React from "react";
import { useToast } from "@/store/toast";
import { useBemm } from "@/utils/bemm";
import { Button } from "@/components/Button";
import { Size } from "@/types";
import { Icon } from "@/components/Icon/Icon";
import "./toast.scss";
import { Icons } from "open-icon";

/**
 * Toast notification container component that displays a stack of toast messages.
 * Renders all active toasts with appropriate icons, colors, and close buttons.
 * @returns {JSX.Element} The rendered toaster component with toast notifications.
 */
export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const bemm = useBemm("toast");

  return (
    <div className={bemm("stack")}>
      {toasts.map((toast) => {
        const colorVar = toast.variant === 'success' ? 'success' : toast.variant === 'warning' ? 'warning' : toast.variant === 'error' ? 'error' : 'info';
        const baseColor = toast.color ? `var(--color-${toast.color})` : `var(--color-${colorVar})`;
        return (
        <div
          key={toast.id}
          className={`${bemm("item", { [toast.variant || "info"]: true })} ${toast.closing ? "leaving" : ""}`.trim()}
          style={{
            '--toast-color': baseColor
          } as React.CSSProperties}
        >
          <div className={bemm("header")}>
            <Icon
              name={
                toast.variant === 'success'
                  ? 'check-circle'
                  : toast.variant === 'warning'
                  ? 'alert'
                  : toast.variant === 'error'
                  ? 'x'
                  : 'info'
              }
              className={bemm('icon')}
            />
            <strong className={bemm("title")}>{toast.title}</strong>
            <Button
              className={bemm('close')}
              size={Size.SMALL}
              variant="ghost"
              onClick={() => removeToast(toast.id)}
              iconOnly
              icon={Icons.MULTIPLY_M}
            />
          </div>
          {toast.message && <div className={bemm("message")}>{toast.message}</div>}
        </div>
      )})}
    </div>
  );
};
