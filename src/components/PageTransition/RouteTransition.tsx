import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { PageTransition } from './PageTransition';
import type { TransitionType } from './types';

interface RouteTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  type = 'slide-up',
  duration = 250
}) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={nodeRef} className="route-transition-container">
      <PageTransition
        key={location.pathname}
        type={type}
        duration={duration}
        className="route-transition"
      >
        {children}
      </PageTransition>
    </div>
  );
};
