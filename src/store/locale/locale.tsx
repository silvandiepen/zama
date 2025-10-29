import React, { useEffect, useMemo, useState } from 'react';
import i18n from '@/i18n/i18n';
import { Ctx } from './locale.context';
import { STORAGE_KEY } from './locale.model';

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || i18n.language || 'en');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  const setLang = (lng: string) => setLangState(lng);
  const value = useMemo(() => ({ lang, setLang }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};