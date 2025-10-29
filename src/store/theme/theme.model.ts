export type ThemeMode = "light" | "dark";

export type ThemeCtx = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const STORAGE_KEY = "zama-app:theme";