import React from 'react';
import { useBemm } from '@/utils/bemm';
import { Link, useNavigate } from 'react-router-dom';
import './mobile-menu.scss';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/theme';
import { useLocale } from '@/store/locale';
import { useAuth } from '@/store/auth';
import { SwitchButton } from '@/components/Input/SwitchButton';
import { Button } from '@/components/Button';
import { Colors, Size } from '@/types';
import { Modal } from '@/components/Modal/Modal';

type NavItem = { id: string; label: string; to: string };

type Props = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

export const MobileMenu: React.FC<Props> = ({ open, onClose, items }) => {
  const bemm = useBemm('mobile-menu');
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLocale();
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('menu.title')}>
      <div className={bemm('content')}>
        <nav className={bemm('nav')} aria-label={t('menu.primaryAria')} onClick={onClose}>
          {items.map((item) => (
            <Link key={item.id} to={item.to} className={bemm('nav-link')}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={bemm('section')}>
          <div className={bemm('section-title')}>{t('menu.options')}</div>
          <div className={bemm('options')}>
            <Button size={Size.SMALL} onClick={toggleTheme}>
              {theme === 'dark' ? t('switch.light') : t('switch.dark')}
            </Button>
            <SwitchButton
              value={lang}
              onChange={(v) => setLang(v)}
              options={[
                { value: 'en', label: t('switch.en') },
                { value: 'nl', label: t('switch.nl') },
                { value: 'fr', label: t('switch.fr') },
              ]}
            />
          </div>
        </div>

        {user && (
          <div className={bemm('section')}>
            <div className={bemm('section-title')}>{t('menu.account')}</div>
            <div className={bemm('options')}>
              <Button size={Size.SMALL} color={Colors.SECONDARY} onClick={() => { onClose(); navigate('/settings'); }}>{t('menu.settings')}</Button>
              <Button size={Size.SMALL} color={Colors.ERROR} onClick={() => { onClose(); signout(); navigate('/signin'); }}>{t('menu.logout')}</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
