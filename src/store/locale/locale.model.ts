export type LocaleCtx = {
  lang: string;
  setLang: (lng: string) => void;
};

export const STORAGE_KEY = 'zama-app:lang';