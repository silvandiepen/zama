import React from 'react';
import type { ReactNode } from 'react';
import { useBemm } from '@/utils/bemm';
import type { TransitionType } from './types';
import './PageTransition.scss';

// Re-export for convenience
export { TRANSITIONS } from './types';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  className?: string;
  onAnimationEnd?: () => void;
}

/**
 * Component that provides animated transitions for content.
 * Supports various transition types with customizable duration and delay.
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Content to apply transition to
 * @param {TransitionType} [props.type='fade'] - Type of transition animation
 * @param {number} [props.duration=300] - Duration of the transition in milliseconds
 * @param {number} [props.delay=0] - Delay before starting the transition
 * @param {string} [props.className] - Additional CSS class names
 * @param {Function} [props.onAnimationEnd] - Callback when animation ends
 * @returns {JSX.Element} The page transition component.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 300,
  delay = 0,
  className,
  onAnimationEnd
}) => {
  const bemm = useBemm('page-transition');

  const inlineStyles = {
    '--transition-duration': `${duration}ms`,
    '--transition-delay': `${delay}ms`,
  } as React.CSSProperties;

  const classes = [bemm('', [type]), className].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      style={inlineStyles}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};
