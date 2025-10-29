import React from 'react';
import type { FeatureFlags } from '@/types/apikey';
import { useFeatureFlag } from '@/store/featureFlags';

type Props<K extends keyof FeatureFlags> = {
  name: K;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function Flag<K extends keyof FeatureFlags>({ name, fallback = null, children }: Props<K>) {
  const enabled = useFeatureFlag(name);
  return <>{enabled ? children : fallback}</>;
}

