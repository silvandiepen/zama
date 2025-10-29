import React from 'react';
import { useBemm } from '@/utils/bemm';
import './page-header.scss';

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  image?: string; // optional background image
  iconSrc?: string; // optional small icon next to title
  iconAlt?: string;
};

export const PageHeader: React.FC<Props> = ({ title, description, actions, className, image, iconSrc, iconAlt }) => {
  const bemm = useBemm('page-header');
  return (
    <section className={[bemm(''), className].filter(Boolean).join(' ')}>
      {image && (
        <div
          className={bemm('bg')}
          aria-hidden
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="container">
        <div className={bemm('inner')}>
          <div className={bemm('content')}>
            {iconSrc && <img src={iconSrc} alt={iconAlt || ''} className={bemm('icon')} />}
            <h1 className={bemm('title')}>{title}</h1>
            {description && <p className={bemm('description')}>{description}</p>}
          </div>
          {actions && <div className={bemm('actions')}>{actions}</div>}
        </div>
      </div>
    </section>
  );
};
