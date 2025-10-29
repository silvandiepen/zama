/**
 * Internationalization (i18n) configuration for the Zama application.
 * Sets up i18next with React integration, supporting English, Dutch, and French.
 * Persists language preference to localStorage and provides fallback to English.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/common.json';
import nl from './locales/nl/common.json';
import fr from './locales/fr/common.json';

const STORAGE_KEY = 'zama-app:lang';
const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const fallbackLng = 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      nl: { common: nl },
      fr: { common: fr },
    },
    lng: stored || fallbackLng,
    fallbackLng,
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });

export default i18n;

