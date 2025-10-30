import React from 'react';
import { Button } from '@/components/Button';
import { Size } from '@/types/size';
import type { Color } from '@/types/colors';
import { Colors } from '@/types';
import { useToast } from '@/store/toast';
import { useTranslation } from 'react-i18next';

type Props = {
  text: string;
  size?: Size;
  color?: Color;
  variant?: 'default' | 'ghost' | 'outline';
  iconOnly?: boolean;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * CopyButton component that handles copying text to clipboard with toast notifications.
 * @param {Object} props - Component props
 * @param {string} props.text - Text to copy to clipboard
 * @param {Size} [props.size=Size.SMALL] - Button size
 * @param {Colors} [props.color=Colors.SECONDARY] - Button color
 * @param {string} [props.variant='default'] - Button variant
 * @param {boolean} [props.iconOnly=false] - Whether to show only icon
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {string} [props.tooltip] - Tooltip text
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Button children
 * @returns {JSX.Element} The rendered copy button
 */
export const CopyButton: React.FC<Props> = ({
  text,
  size = Size.SMALL,
  color = Colors.SECONDARY,
  variant = 'default',
  iconOnly = false,
  disabled = false,
  tooltip,
  className,
  style,
  children,
}) => {
  const { addToast } = useToast();
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        title: t("toast.copiedTitle"),
        message: t("toast.copiedMsg"),
        variant: "success",
      });
    } catch (error) {
      console.error("Copy failed", error);
      addToast({
        title: t("toast.errorTitle", { defaultValue: "Error" }),
        message: t("toast.copyFailed", { defaultValue: "Failed to copy to clipboard" }),
        variant: "error",
      });
    }
  };

  return (
    <Button
      size={size}
      color={color}
      variant={variant}
      iconOnly={iconOnly}
      disabled={disabled}
      tooltip={tooltip || t("btn.copy")}
      className={className}
      style={style}
      onClick={handleCopy}
      icon="copy"
    >
      {children || t("btn.copy")}
    </Button>
  );
};