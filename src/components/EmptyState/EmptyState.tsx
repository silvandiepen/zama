import React from 'react';
import { useBemm } from '@/utils/bemm';
import { Icon } from '@/components/Icon/Icon';
import type { EmptyStateProps } from './model';
import './empty-state.scss';

/**
 * Empty state component for displaying placeholder content when no data is available.
 * Shows an icon, title, optional description, and optional action button.
 * @param {EmptyStateProps} props - Component props
 * @param {string} props.icon - Icon name to display
 * @param {string} props.title - Title text to display
 * @param {string} [props.description] - Optional description text
 * @param {string} [props.size='medium'] - Size variant of the empty state
 * @param {React.ReactNode} [props.action] - Optional action button or content
 * @returns {JSX.Element} The rendered empty state component.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  size = 'medium',
  action
}) => {
  const bemm = useBemm('empty-state');

  return (
    <div className={bemm('', [size])}>
      <div className={bemm('icon')}>
        {icon && <Icon name={icon} size="large" />}
      </div>
      
      <div className={bemm('content')}>
        <h2 className={bemm('title')}>{title}</h2>
        {description && (
          <p className={bemm('description')}>{description}</p>
        )}
      </div>
      
      {action && (
        <div className={bemm('action')}>
          {action}
        </div>
      )}
    </div>
  );
};