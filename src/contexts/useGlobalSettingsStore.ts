import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum DeveloperFlags {
  NONE = 0,
  NORMAL = 0x1,
  ADVANCED = 0x2,
  // ALL = 0x3, // NORMAL | ADVANCED
}

type GlobalSettingsStore = {
  /**
   * developer flags
   */
  developerFlags: number;
  setDeveloperFlags: (value: number) => void;
};

/**
 * Global Settings
 */
export const useGlobalSettingsStore = create<GlobalSettingsStore>()(
  persist(
    (set, get) => ({
      developerFlags: DeveloperFlags.NONE,
      setDeveloperFlags: value =>
        set({
          developerFlags: value,
        }),
    }),
    {
      name: 'survey.global.settings',
      version: 1,
      migrate: (developerFlags, version) => {
        if (version < 1) {
          // setDeveloperFlags(DeveloperFlags.NONE);
        }
        return developerFlags;
      },
    }
  )
);
