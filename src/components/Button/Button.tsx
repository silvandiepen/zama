import React from "react";
import { useBemm } from "@/utils/bemm";
import { Icon } from "@/components/Icon/Icon";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import { type ButtonProps } from "./Button.model";
import "./Button.scss";
import { Size } from "@/types";

/**
 * Button component with various styles, sizes, and tooltip support.
 * @param {ButtonProps} props - Button component props
 * @returns {JSX.Element} The rendered button component.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  size = Size.MEDIUM,
  variant = 'default',
  disabled = false,
  onClick,
  type = "button",
  className,
  style,
  iconOnly = false,
  icon,
  customIcon,
  tooltip,
}) => {
  const bemm = useBemm("button");

  const buttonElement = (
    <button
      type={type}
      className={[
        bemm("", { color, size, disabled, variant, "icon-only": iconOnly, "has-icon": Boolean(icon || customIcon) }),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      disabled={disabled}
      title={tooltip} // Fallback title attribute
      style={
        {
          "--button-int-color": `var(--color-${color}, var(--color-secondary))`,
          "--button-int-text": `var(--color-${color}-text, var(--color-secondary-text))`,
          ...style,
        } as React.CSSProperties
      }
    >
      {icon && <Icon name={icon} size="small" className={bemm("icon")} />}
      {customIcon && <span className={bemm("custom-icon")}>{customIcon}</span>}
      {!iconOnly && children && <span className={bemm("text")}>{children}</span>}
    </button>
  );

  // Wrap with tooltip if provided and not disabled
  if (tooltip && !disabled) {
    return <Tooltip content={tooltip}>{buttonElement}</Tooltip>;
  }

  return buttonElement;
};
