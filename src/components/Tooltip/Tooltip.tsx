import React, { useState, useRef, useEffect } from 'react';
import { useBemm } from '@/utils/bemm';
import type { TooltipProps } from './model';
import './tooltip.scss';

/**
 * Tooltip component that shows content on hover with customizable position and delay.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Trigger element for the tooltip
 * @param {React.ReactNode} props.content - Tooltip content to display
 * @param {string} [props.position='top'] - Tooltip position relative to trigger
 * @param {number} [props.delay=300] - Delay in milliseconds before showing tooltip
 * @param {boolean} [props.disabled=false] - Whether the tooltip is disabled
 * @returns {JSX.Element} The rendered tooltip component.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  disabled = false
}) => {
  const bemm = useBemm('tooltip');
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Shows the tooltip after the configured delay.
   */
  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    setTimeoutId(id);
  };

  /**
   * Hides the tooltip immediately.
   */
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  // Simplified: no auto-flip/reposition to avoid jumpy animations
  useEffect(() => {
    // No-op on show; CSS handles appearance
  }, [isVisible, position]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div 
      ref={triggerRef}
      className={bemm('trigger')}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={bemm('content', [position])}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
          <div className={bemm('arrow')} />
        </div>
      )}
    </div>
  );
};
