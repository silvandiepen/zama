export type ApiKey = {
  id: string;
  title: string;
  description?: string;
  key: string; // This will now store the "masked" representation
  encryptedKey?: string; // The actual encrypted key data
  createdAt: string; // ISO date
  revoked: boolean;
  revokedAt?: string | null;
  readRules: string[];
  writeRules: string[];
  // Whether the full key has been shown to the user (at creation/regeneration time)
  revealOnceSeen?: boolean;
  // Optional timestamp when key was last regenerated
  lastRegeneratedAt?: string | null;
  // Encryption metadata
  encryptionInfo?: {
    algorithm: string;
    provider: string;
    version: string;
    checksum: string;
  };
};

export type CreateApiKeyInput = {
  title: string;
  description?: string;
  key?: string; // optional; if omitted, generate
  readRules?: string[];
  writeRules?: string[];
};

export type FeatureFlags = {
  // API Key features
  enableDescriptions: boolean;
  enableCopy: boolean;
  enableRevoke: boolean;
  
  // Theme & Appearance
  enableDarkMode: boolean;
  enableLightMode: boolean;
  enableSystemTheme: boolean;
  enableCustomColors: boolean;
  // Color mode switcher visibility and default
  enableColorModeSwitch: boolean;
  defaultTheme: 'light' | 'dark';
  // User menu visibility
  enableUserMenu: boolean;
  
  // Language & Localization
  enableLanguageSwitcher: boolean;
  enableAutoDetectLanguage: boolean;
  enableTranslations: boolean;
  
  // UI Components
  enableAnimations: boolean;
  enableTooltips: boolean;
  enableShortcuts: boolean;
  enableDevTools: boolean;
  enableAdvancedSettings: boolean;
  
  // Dashboard Features
  enableCharts: boolean;
  enableStats: boolean;
  enableActivityFeed: boolean;
  enableQuickActions: boolean;
  
  // Modal & Interaction
  enableModalBackdrop: boolean;
  enableKeyboardShortcuts: boolean;
  enableClickOutsideToClose: boolean;
};
