import type { FeatureFlags } from "@/types/apikey";

export type FlagsCtx = {
  flags: FeatureFlags;
  setFlags: (patch: Partial<FeatureFlags>) => void;
};

export const STORAGE_KEY = "zama-app:feature-flags"; // kept for compatibility with existing storage key
