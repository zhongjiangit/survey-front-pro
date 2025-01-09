import { UserType } from '@/types/SystemType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveyUserStore = {
  user: UserType | null;
  ready: boolean;
  setUser: (user: any) => void;
  setReady: (ready: boolean) => void;
};

/**
 * Store for user settings
 */
export const useSurveyUserStore = create<SurveyUserStore>()(
  persist(
    set => {
      return {
        user: null,
        ready: false,
        setUser: user => set({ user }),
        setReady: ready => set({ ready }),
      };
    },
    {
      name: 'survey.user',
    }
  )
);
// console.log(useSurveyUserStore())
