import { OrgType } from '@/types/SystemType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveyOrgStore = {
  currentOrg: OrgType | null;
  setCurrentOrg: (currentOrg: any) => void;
};

/**
 * Store for currentOrg settings
 */
export const useSurveyOrgStore = create<SurveyOrgStore>()(
  persist(
    set => ({
      currentOrg: null,
      setCurrentOrg: currentOrg => set({ currentOrg }),
    }),
    {
      name: 'survey.currentOrg',
    }
  )
);
