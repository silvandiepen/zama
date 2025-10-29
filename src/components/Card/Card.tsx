import React, { useRef, useState, useCallback } from "react";
import { useBemm } from "@/utils/bemm";
import { type CardProps } from "./model";
import "./Card.scss";

/**
 * Card component with interactive glow effects that follow mouse movement.
 * Supports various variants, colors, and padding options for flexible layouts.
 * @param {CardProps} props - Card component props
 * @param {React.ReactNode} props.children - Content to display inside the card
 * @param {string} [props.title] - Optional title to display in the card header
 * @param {string} [props.description] - Optional description to display below the title
 * @param {React.ReactNode} [props.footer] - Optional footer content
 * @param {string} [props.className] - Additional CSS class names
 * @param {string} [props.color] - Color theme for the card
 * @param {React.ReactNode} [props.actions] - Optional action buttons to display in header
 * @param {string} [props.variant='default'] - Visual variant of the card
 * @param {boolean} [props.featured=false] - Whether the card should have featured styling
 * @param {boolean} [props.hoverable=false] - Whether the card should have hover effects
 * @param {boolean} [props.noPadding=false] - Whether to remove all padding
 * @param {boolean} [props.noHeaderPadding=false] - Whether to remove header padding
 * @param {boolean} [props.noContentPadding=false] - Whether to remove content padding
 * @param {boolean} [props.noFooterPadding=false] - Whether to remove footer padding
 * @returns {JSX.Element} The rendered card component.
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  footer,
  className,
  color,
  actions,
  variant = 'default',
  featured = false,
  hoverable = false,
  noPadding = false,
  noHeaderPadding = false,
  noContentPadding = false,
  noFooterPadding = false,
}) => {
  const bemm = useBemm("card");
  const cardRef = useRef<HTMLDivElement>(null);
  const [pointerX, setPointerX] = useState(50);
  const [pointerY, setPointerY] = useState(50);
  const [pointerAngle, setPointerAngle] = useState(0);

  /**
   * Handles mouse movement over the card to calculate pointer position
   * and angle for the interactive glow effect.
   * @param {React.MouseEvent<HTMLDivElement>} event - Mouse move event
   * @returns {void}
   */
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate percentage positions
    const newX = Math.round((x / rect.width) * 100);
    const newY = Math.round((y / rect.height) * 100);

    setPointerX(newX);
    setPointerY(newY);

    // Calculate angle from center (50%, 50%) to pointer position
    const centerX = 50;
    const centerY = 50;
    const deltaX = newX - centerX;
    const deltaY = newY - centerY;

    // Calculate angle in radians then convert to degrees
    const angleRadians = Math.atan2(deltaY, deltaX);
    const angleDegrees = angleRadians * (180 / Math.PI);

    // Normalize angle: 0° at top, positive clockwise
    // atan2 gives: 0° at right, so we subtract 90°
    setPointerAngle(Math.round(angleDegrees));
  }, []);

  /**
   * Handles mouse leave event to reset or preserve the glow effect state.
   * Currently preserves the last angle position for smooth transitions.
   * @returns {void}
   */
  const handleMouseLeave = useCallback(() => {
    // Reset to center on mouse leave
    // setPointerX(50);
    // setPointerY(50);
    // Keep angle at last position
  }, []);

  const showHeader = title;
  const showFooter = footer;

  const cardClasses = [
    bemm(""),
    variant !== 'default' ? bemm("", [variant]) : '',
    color ? bemm("", [color]) : '',
    color ? 'has-color' : '',
    featured ? 'featured' : '',
    hoverable ? 'hoverable' : '',
    noPadding ? 'no-padding' : '',
    showHeader ? 'has-header' : '',
    showFooter ? 'has-footer' : '',
    className || ''
  ].filter(Boolean).join(" ");

  const styles: React.CSSProperties = {
    '--pointer-x': `${pointerX}%`,
    '--pointer-y': `${pointerY}%`,
    '--pointer-angle': `${pointerAngle}deg`,
    '--card-color': color ? `var(--color-${color})` : 'var(--card)',
    '--card-text': color ? `var(--color-${color}-text)` : 'var(--card-text)',
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      className={cardClasses}
      style={styles}
      data-variant={variant}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={bemm("glow")} />
      <div className={bemm("container")}>
        {(title || description) && (
          <div className={`${bemm("header")} ${noHeaderPadding ? bemm("header", ["no-padding"]) : ""}`}>
            { title && <h3 className={bemm("title")}>{title}</h3>}
            { description && <span className={bemm("description")}>{description}</span>}
            { actions && <div className={bemm("description")}>{actions}</div> }
          </div>
        )}
        <div className={`${bemm("content")} ${noContentPadding ? bemm("content", ["no-padding"]) : ""}`}>
          {children}
        </div>
        {footer && <div className={`${bemm("footer")} ${noFooterPadding ? bemm("footer", ["no-padding"]) : ""}`}>
          {footer}
        </div>}
      </div>
    </div>
  );
};
