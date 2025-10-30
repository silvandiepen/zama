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
  const bemm = useBemm();
  
  return (
    <span className={bemm('badge', { variant, size }, className)}>
      {icon && <span className={bemm('badge__icon')}>{icon}</span>}
      <span className={bemm('badge__content')}>{children}</span>
    </span>
  );
};