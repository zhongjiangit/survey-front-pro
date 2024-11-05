'use client';

import { useGlobalSettingsStore } from '../contexts/useGlobalSettingsStore';

/**
 * developer flags
 */
export function useDeveloperFlags() {
  return useGlobalSettingsStore(state => state.developerFlags);
}
