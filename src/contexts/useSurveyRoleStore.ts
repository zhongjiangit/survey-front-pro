import { RoleType } from '@/types/CommonType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SurveyCurrentRoleStore = {
  roles: RoleType[] | null;
  menus: any[];
  setRoles: (roles: RoleType[]) => void;
  getMenus: () => any[];
  setMenus: (menus: any[]) => void;
  currentRole: RoleType | null;
  setCurrentRole: (currentRole: RoleType | null) => void;
};

/**
 * Store for currentRole settings
 */
export const useSurveyCurrentRoleStore = create<SurveyCurrentRoleStore>()(
  persist(
    set => {
      let menus: any[] = [];
      return {
        roles: null,
        menus: [],
        getMenus() {
          return menus;
        },
        setRoles: roles => set({ roles }),
        setMenus: _menus => {
          menus = _menus;
          set({ menus });
        },
        currentRole: null,
        setCurrentRole: currentRole => set({ currentRole }),
      };
    },
    {
      name: 'survey.currentRole',
    }
  )
);
