'use client';

import { isProd } from '@/api/config';
import CookieApi from '@/api/cookie';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useRoles } from '@/hooks/useRoles';
import { ColorScheme } from '@/types/ColorScheme';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ReactNode, useEffect, useRef } from 'react';
import { TouchProvider } from '../components/display/hybrid';
import {
  ColorSchemeContext,
  createColorSchemeStore,
} from '../contexts/useColorScheme';
const { darkAlgorithm, defaultAlgorithm } = theme;

interface Props {
  colorScheme: ColorScheme;
  children: ReactNode;
}

export function Provider({ colorScheme, children }: Props) {
  const store = useRef(createColorSchemeStore({ colorScheme })).current;
  const setRoles = useSurveyCurrentRoleStore(state => state.setRoles);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const setCurrentRole = useSurveyCurrentRoleStore(
    state => state.setCurrentRole
  );
  const roles = useRoles();
  useEffect(() => {
    if (roles.length > 0) {
      const activeRoles = roles.filter(role => role.isActive);
      setRoles(roles);
      setCurrentRole(activeRoles[0]);
    }
  }, [roles, setCurrentRole, setRoles]);

  useEffect(() => {
    if (!isProd) {
      CookieApi.getCookie();
    }
  }, []);

  return (
    <ColorSchemeContext.Provider value={store}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm:
            colorScheme === ColorScheme.DARK ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        <TouchProvider>{children}</TouchProvider>
      </ConfigProvider>
    </ColorSchemeContext.Provider>
  );
}
