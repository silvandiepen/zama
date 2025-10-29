import React from 'react';
import { useTheme } from '@/store/theme';
import { useLocale } from '@/store/locale';
import { SwitchButton } from '@/components/Input/SwitchButton';
import { useTranslation } from 'react-i18next';

/**
 * Settings page component that allows users to configure theme and language preferences.
 * Provides switch buttons for selecting between light/dark themes and available languages.
 * @returns {JSX.Element} The rendered settings page.
 */
export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLocale();
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 'var(--space-l)', padding: 'var(--space)' }}>
      <div style={{ display: 'grid', gap: 'var(--space-m)' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-l)' }}>{t('dev.colorMode')}</div>
        <SwitchButton
          value={theme}
          onChange={(v) => setTheme(v as 'light' | 'dark')}
          options={[
            { value: 'light', label: t('switch.light'), icon: 'sun' },
            { value: 'dark', label: t('switch.dark'), icon: 'moon' },
          ]}
        />
      </div>
      
      <div style={{ display: 'grid', gap: 'var(--space-m)' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-l)' }}>{t('dev.language')}</div>
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
  );
}
