import { UserType } from '@/types/SystemType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveyUserStore = {
  user: UserType | null;
  setUser: (user: any) => void;
};

/**
 * Store for user settings
 */
export const useSurveyUserStore = create<SurveyUserStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
    }),
    {
      name: 'survey.user',
    }
  )
);
