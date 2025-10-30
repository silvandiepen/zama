import React, { Fragment } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

/**
 * Component that wraps children and provides scroll-to-top functionality on route changes.
 * Must be rendered inside a Router context.
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The wrapped children with scroll-to-top behavior.
 */
export const ScrollToTopWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useScrollToTop();
  return <Fragment>{children}</Fragment>;
};