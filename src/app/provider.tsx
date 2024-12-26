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
      _currentSystem = user?.systems[0];
    }

    if (
      _currentSystem &&
      (!_currentOrg ||
        !_currentSystem?.orgs?.some(t => t.orgId === _currentOrg?.orgId))
    ) {
      _currentOrg = _currentSystem?.orgs[0];
    }

    let roles: RoleType[] = [];
    if (user) {
      roles = [
        {
          key: 'isPlatformManager',
          isActive: !!user.isPlatformManager,
          label: '平台管理员',
          name: !!user.isPlatformManager && user.platformManagerName,
          id: !!user.isPlatformManager && user.userId,
        },
        {
          key: 'isSystemManager',
          label: '系统管理员',
          isActive: !!_currentSystem?.isSystemManager,
          name:
            !!_currentSystem?.isSystemManager &&
            _currentSystem.systemManagerName,
          id: _currentOrg?.isStaff === 1 && _currentOrg.staffId,
        },
        {
          key: 'isExpert',
          label: '专家',
          isActive: !!_currentOrg?.isExpert,
          name: !!_currentOrg?.isExpert && _currentOrg.expertName,
          id: !!_currentOrg?.isExpert && _currentOrg.expertId,
        },
        {
          key: 'isOrgManager',
          label: '单位管理员',
          isActive: _currentOrg?.isStaff === 1 && _currentOrg?.staffType === 1,
          name: _currentOrg?.isStaff === 1 && _currentOrg.staffName,
          staffType: StaffTypeEnum.UnitAdmin,
          id: _currentOrg?.isStaff === 1 && _currentOrg.staffId,
        },
        {
          key: 'isManager',
          label: '普通管理员',
          isActive: _currentOrg?.isStaff === 1 && _currentOrg?.staffType === 2,
          name: _currentOrg?.isStaff === 1 && _currentOrg.staffName,
          staffType: StaffTypeEnum.Admin,
          id: _currentOrg?.isStaff === 1 && _currentOrg.staffId,
        },
        {
          key: 'isMember',
          label: '普通成员',
          isActive: _currentOrg?.isStaff === 1 && _currentOrg?.staffType === 3,
          name: _currentOrg?.isStaff === 1 && _currentOrg.staffName,
          staffType: StaffTypeEnum.Member,
          id: _currentOrg?.isStaff === 1 && _currentOrg.staffId,
        },
      ];
    }
    if (
      _currentOrg &&
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
