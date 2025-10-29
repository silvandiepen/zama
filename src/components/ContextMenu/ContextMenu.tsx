import React, { useEffect, useRef, useState } from "react";
import "./context-menu.scss";

export type ContextMenuItem = {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  items: ContextMenuItem[];
  renderTrigger: (opts: {
    open: boolean;
    toggle: () => void;
    triggerProps: React.HTMLAttributes<HTMLButtonElement>;
  }) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
};

export const ContextMenu: React.FC<Props> = ({ items, renderTrigger, align = "right", className }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = () => setOpen(v => !v);

  return (
    <div className={`ctxmenu ${className || ""}`.trim()} ref={rootRef}>
      {renderTrigger({ open, toggle, triggerProps: { onClick: toggle, "aria-haspopup": "menu", "aria-expanded": open } })}
      {open && (
        <div className={`ctxmenu__menu ctxmenu__menu--${align}`} role="menu">
          {items.map((it, idx) => (
            <button
              key={idx}
              className="ctxmenu__item"
              role="menuitem"
              onClick={() => {
                if (it.disabled) return;
                setOpen(false);
                it.onSelect();
              }}
              disabled={it.disabled}
            >
              {it.icon && <span className="ctxmenu__icon" aria-hidden>{it.icon}</span>}
              <span className="ctxmenu__label">{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

