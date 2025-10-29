import type { Color } from '@/types';

export type IconProps = {
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  color?: Color;
  className?: string;
  ariaLabel?: string;
};
