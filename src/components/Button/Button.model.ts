import type { Color } from "@/types";
import { Size as SizeValues } from "@/types";
export type ButtonSize = typeof SizeValues[keyof typeof SizeValues];

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonVariant = 'default' | 'ghost' | 'outline';

export interface ButtonProps {
  children?: React.ReactNode;
  color?: Color;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: ButtonType;
  className?: string;
  style?: React.CSSProperties;
  iconOnly?: boolean;
  icon?: string;
  customIcon?: React.ReactNode;
  tooltip?: string;
}
