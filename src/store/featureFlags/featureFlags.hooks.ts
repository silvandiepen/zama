import { useContext } from "react";
import type { FeatureFlags } from "@/types/apikey";
import { isFeatureEnabled } from "@/services/featureFlags";
import { Ctx } from "./featureFlags.context";

/**
 * Hook to access the feature flags context.
 * @throws {Error} If used outside of FeatureFlagsProvider.
 * @returns {Object} The feature flags context value.
 */
export function useFeatureFlags() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  return ctx;
}

/**
 * Hook to check if a specific feature flag is enabled.
 * @param {K} key - The feature flag key to check.
 * @returns {boolean} True if the feature flag is enabled.
 */
export function useFeatureFlag<K extends keyof FeatureFlags>(key: K): boolean {
  const { flags } = useFeatureFlags();
  return Boolean(flags[key]);
}

/**
 * Convenience function to check if a feature flag is enabled.
 * @param {K} key - The feature flag key to check.
 * @returns {boolean} True if the feature flag is enabled.
 */
export function isFlagEnabled<K extends keyof FeatureFlags>(key: K) {
  return isFeatureEnabled(key);
}
