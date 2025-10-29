import type { Color } from '@/types';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: Color;
  variant?: 'default' | 'elevated' | 'ghost';
  featured?: boolean;
  hoverable?: boolean;
  noPadding?: boolean;
  noHeaderPadding?: boolean;
  noContentPadding?: boolean;
  noFooterPadding?: boolean;
}
