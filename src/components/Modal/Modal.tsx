import React, { useEffect, useRef } from "react";
import { useBemm } from "@/utils/bemm";
import "./modal.scss";
import { Button } from "../Button";
import { Icons } from "open-icon";
import { Size } from "@/types";
import { useFeatureFlags } from "@/store/featureFlags";
import type { ModalProps } from "./modal.model";

/**
 * Modal dialog component with keyboard shortcuts and backdrop click handling.
 * @param {Object} props - Modal component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {string} [props.title] - Optional modal title
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Optional modal footer content
 * @returns {JSX.Element | null} The rendered modal or null if not open
 */
export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children, footer }) => {
  const bemm = useBemm("modal");
  const { flags } = useFeatureFlags();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && flags.enableKeyboardShortcuts) {
        onClose();
      }
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === event.currentTarget && flags.enableClickOutsideToClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    const overlay = modalRef.current;
    if (overlay && flags.enableClickOutsideToClose) {
      overlay.addEventListener('click', handleBackdropClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (overlay && flags.enableClickOutsideToClose) {
        overlay.removeEventListener('click', handleBackdropClick);
      }
    };
  }, [open, onClose, flags.enableKeyboardShortcuts, flags.enableClickOutsideToClose]);

  if (!open) return null;
  
  return (
    <div 
      ref={modalRef}
      className={bemm("overlay")} 
      role="dialog" 
      aria-modal="true"
      style={{ cursor: flags.enableClickOutsideToClose ? 'pointer' : 'default' }}
    >
      <div 
        className={bemm("window")}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default' }}
      >
        <div className={bemm("header")}>
          {title && <h3 className={bemm("title")}>{title}</h3>}
          <Button className={bemm("close")} onClick={onClose} aria-label="Close" icon={Icons.MULTIPLY_M} iconOnly={true} size={Size.SMALL} variant='ghost' />
        </div>
        <div className={bemm("body")}>{children}</div>
        {footer && <div className={bemm("footer")}>{footer}</div>}
      </div>
    </div>
  );
};
