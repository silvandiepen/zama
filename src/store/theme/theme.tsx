import React, { useEffect, useMemo, useState } from 'react';
import { Ctx } from './theme.context';
import { STORAGE_KEY, type ThemeMode } from './theme.model';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const raw = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return raw === "dark" || raw === "light" ? raw : "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    // Always reflect theme on the <html> element for styling hooks
    root.setAttribute("color-mode", theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};