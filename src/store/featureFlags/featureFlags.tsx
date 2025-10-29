import React, { useEffect, useMemo, useState } from "react";
import type { FeatureFlags } from "@/types/apikey";
import { featureFlags as service } from "@/services/featureFlags";
import { Ctx } from "./featureFlags.context";

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flags, setFlagsState] = useState<FeatureFlags>(() => {
    // Initialize service and read snapshot
    service.init();
    return service.getAll();
  });

  useEffect(() => {
    // Subscribe to service updates
    const off = service.onChange(setFlagsState);
    return () => {
      off();
    };
  }, []);

  const setFlags = (patch: Partial<FeatureFlags>) => service.set(patch);

  const value = useMemo(() => ({ flags, setFlags }), [flags]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
