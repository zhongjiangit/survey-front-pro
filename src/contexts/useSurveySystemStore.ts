import { UserSystemType } from '@/interfaces/SystemType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveySystemStore = {
  currentSystem: UserSystemType | null;
  setCurrentSystem: (currentSystem: any) => void;
};

/**
 * Store for system settings
 */
export const useSurveySystemStore = create<SurveySystemStore>()(
  persist(
    set => ({
      currentSystem: null,
      setCurrentSystem: currentSystem => set({ currentSystem }),
    }),
    {
      name: 'survey.currentSystem',
    }
  )
);
