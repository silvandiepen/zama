import React from 'react';
import { useBemm } from '@/utils/bemm';
import type { BadgeProps } from './badge.model';
import './badge.scss';

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  icon,
  className 
}) => {
  const bemm = useBemm('badge');
  
  return (
    <span className={bemm('', { variant, size }, className)}>
      {icon && <span className={bemm('icon')}>{icon}</span>}
      <span className={bemm('content')}>{children}</span>
    </span>
  );
};