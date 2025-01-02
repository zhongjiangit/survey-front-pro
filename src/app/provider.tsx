'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { getMenus } from '@/lib/get-first-menu';
import { ColorScheme } from '@/types/ColorScheme';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ReactNode, useEffect, useRef } from 'react';
import { TouchProvider } from '../components/display/hybrid';
import {
  ColorSchemeContext,
  createColorSchemeStore,
} from '../contexts/useColorScheme';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { RoleType, StaffTypeEnum } from '@/types/CommonType';
import { getActiveRoles } from '@/lib/get-active-roles';
const { darkAlgorithm, defaultAlgorithm } = theme;

interface Props {
  colorScheme: ColorScheme;
  children: ReactNode;
}

export function Provider({ colorScheme, children }: Props) {
  const store = useRef(createColorSchemeStore({ colorScheme })).current;
  const user = useSurveyUserStore(state => state.user);
  const [currentSystem, setCurrentSystem] = useSurveySystemStore(state => [
    state.currentSystem,
    state.setCurrentSystem,
  ]);
  const [currentOrg, setCurrentOrg] = useSurveyOrgStore(state => [
    state.currentOrg,
    state.setCurrentOrg,
  ]);
  const [currentRole, setCurrentRole, setRoles, setMenus] =
    useSurveyCurrentRoleStore(state => [
      state.currentRole,
      state.setCurrentRole,
      state.setRoles,
      state.setMenus,
    ]);

  useEffect(() => {
    if (!user) {
      return;
    }
    let _currentSystem = currentSystem;
    let _currentOrg = currentOrg;
    let _currentRole = currentRole;
    if (
      user &&
      (!_currentSystem ||
        !user?.systems?.some(t => t.systemId === _currentSystem?.systemId))
    ) {
      _currentSystem = user?.systems?.[0];
    }

    if (
      _currentSystem &&
      (!_currentOrg ||
        !_currentSystem?.orgs?.some(t => t.orgId === _currentOrg?.orgId))
    ) {
      _currentOrg = _currentSystem?.orgs?.[0];
    }

    let roles: RoleType[] = [];
    if (user) {
      roles = getActiveRoles(user, _currentOrg, _currentSystem);
    }
    if (
      user &&
      (!_currentRole ||
        !roles?.some(t => JSON.stringify(t) === JSON.stringify(_currentRole)))
    ) {
      _currentRole = roles.filter(role => role.isActive)[0];
    }

    setCurrentSystem(_currentSystem);
    setCurrentOrg(_currentOrg);
    setCurrentRole(_currentRole);
    setMenus(getMenus(_currentRole));
    setRoles(roles);
  }, [user, currentSystem, currentOrg, currentRole]);

  return (
    <ColorSchemeContext.Provider value={store}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          // hashed: false,
          algorithm:
            colorScheme === ColorScheme.DARK ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <TouchProvider>{children}</TouchProvider>
      </ConfigProvider>
    </ColorSchemeContext.Provider>
  );
}
