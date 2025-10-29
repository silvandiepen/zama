import type { FeatureFlags } from '@/types/apikey';

const STORAGE_KEY = 'zama-app:feature-flags';

export const DEFAULT_FLAGS: FeatureFlags = {
  // API Key features
  enableDescriptions: true,
  enableCopy: true,
  enableRevoke: true,

  // Theme & Appearance
  enableDarkMode: true,
  enableLightMode: true,
  enableSystemTheme: true,
  enableCustomColors: false,
  enableColorModeSwitch: true,
  defaultTheme: 'light',
  enableUserMenu: true,

  // Language & Localization
  enableLanguageSwitcher: true,
  enableAutoDetectLanguage: true,
  enableTranslations: true,

  // UI Components
  enableAnimations: true,
  enableTooltips: true,
  enableShortcuts: true,
  enableDevTools: true,
  enableAdvancedSettings: false,

  // Dashboard Features
  enableCharts: true,
  enableStats: true,
  enableActivityFeed: true,
  enableQuickActions: true,

  // Modal & Interaction
  enableModalBackdrop: true,
  enableKeyboardShortcuts: true,
  enableClickOutsideToClose: true,
};

type Listener = (flags: FeatureFlags) => void;

export class FeatureFlagService {
  private flags: FeatureFlags = { ...DEFAULT_FLAGS };
  private listeners = new Set<Listener>();

  /**
   * Initializes the feature flag service with optional initial values.
   * @param {Partial<FeatureFlags>} [initial] - Optional initial feature flag values.
   */
  init(initial?: Partial<FeatureFlags>) {
    // Load from storage
    const stored = this.readFromStorage();
    // Merge order: defaults < storage < initial < query overrides
    this.flags = { ...DEFAULT_FLAGS, ...stored, ...initial } as FeatureFlags;
    // Apply query string overrides (ff.myFlag=true)
    try {
      if (typeof window !== 'undefined' && window.location?.search) {
        const overrides = this.parseQueryOverrides(window.location.search);
        if (Object.keys(overrides).length) {
          this.flags = { ...this.flags, ...overrides } as FeatureFlags;
        }
      }
    } catch { /* ignore */ }
    this.persist();
    this.emit();
  }

  /**
   * Gets all current feature flags.
   * @returns {FeatureFlags} All feature flags.
   */
  getAll(): FeatureFlags {
    return { ...this.flags };
  }

  /**
   * Checks if a specific feature flag is enabled.
   * @param {K} key - The feature flag key.
   * @returns {boolean} True if the feature flag is enabled.
   */
  isEnabled<K extends keyof FeatureFlags>(key: K): boolean {
    return Boolean(this.flags[key]);
  }

  /**
   * Sets feature flag values.
   * @param {Partial<FeatureFlags>} patch - Feature flag values to update.
   */
  set(patch: Partial<FeatureFlags>) {
    this.flags = { ...this.flags, ...patch } as FeatureFlags;
    this.persist();
    this.emit();
  }

  /**
   * Adds a listener for feature flag changes.
   * @param {Listener} fn - Callback function to call when flags change.
   * @returns {Function} Function to remove the listener.
   */
  onChange(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    for (const fn of this.listeners) fn(this.getAll());
  }

  private persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.flags)); } catch { /* ignore */ }
  }

  private readFromStorage(): Partial<FeatureFlags> | undefined {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FeatureFlags) : undefined;
    } catch { return undefined; }
  }

  private parseQueryOverrides(search: string): Partial<FeatureFlags> {
    const params = new URLSearchParams(search);
    const out: Record<string, unknown> = {};
    // Pattern: ff.<key>=true|false|value
    params.forEach((value, key) => {
      if (!key.startsWith('ff.')) return;
      const k = key.slice(3);
      // coerce booleans if possible
      let v: unknown = value;
      if (value === 'true') v = true;
      else if (value === 'false') v = false;
      out[k] = v;
    });
    return out as Partial<FeatureFlags>;
  }
}

// Singleton default instance
export const featureFlags = new FeatureFlagService();

// Convenience helpers
/**
 * Convenience function to check if a feature flag is enabled.
 * @param {K} key - The feature flag key.
 * @returns {boolean} True if the feature flag is enabled.
 */
export function isFeatureEnabled<K extends keyof FeatureFlags>(key: K) {
  return featureFlags.isEnabled(key);
}

