import { RoleType } from '@/types/CommonType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveyCurrentRoleStore = {
  roles: RoleType[] | null;
  setRoles: (roles: RoleType[]) => void;
  currentRole: RoleType | null;
  setCurrentRole: (currentRole: RoleType) => void;
};

/**
 * Store for currentRole settings
 */
export const useSurveyCurrentRoleStore = create<SurveyCurrentRoleStore>()(
  persist(
    set => ({
      roles: null,
      setRoles: roles => set({ roles }),
      currentRole: null,
      setCurrentRole: currentRole => set({ currentRole }),
    }),
    {
      name: 'survey.currentRole',
    }
  )
);
