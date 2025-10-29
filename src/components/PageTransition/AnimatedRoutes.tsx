import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageTransition } from './PageTransition';
import type { TransitionType } from './types';

interface AnimatedRoutesProps {
  children: React.ReactNode;
  transitionType?: TransitionType;
  duration?: number;
}

/**
 * Wrapper component that provides animated transitions between routes.
 * Handles fade in/out animations when location changes.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child routes to animate
 * @param {TransitionType} [props.transitionType='fade'] - Type of transition animation
 * @param {number} [props.duration=300] - Duration of the transition in milliseconds
 * @returns {JSX.Element} The animated routes component.
 */
export const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({
  children,
  transitionType = 'fade',
  duration = 300
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  /**
   * Handles the end of transition animation.
   * Updates the displayed location when fade-out completes.
   */
  const handleTransitionEnd = () => {
    if (transitionStage === 'fade-out') {
      setTransitionStage('fade-in');
      setDisplayLocation(location);
    }
  };

  return (
    <PageTransition
      type={transitionType}
      duration={duration}
      className={`page-transition--${transitionStage}`}
      onAnimationEnd={handleTransitionEnd}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { location: displayLocation } as any);
        }
        return child;
      })}
    </PageTransition>
  );
};
