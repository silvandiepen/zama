export type Position = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: Position;
  delay?: number;
  disabled?: boolean;
}
