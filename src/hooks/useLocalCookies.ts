'use client';

import { useGlobalSettingsStore } from '../contexts/useGlobalSettingsStore';

/**
 * developer flags
 */
export function useLocalCookies() {
  return useGlobalSettingsStore(state => state.localCookies);
}
