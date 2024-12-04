'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useRoles } from '@/hooks/useRoles';
import { getFirstMenu } from '@/lib/get-first-menu';
import { ColorScheme } from '@/types/ColorScheme';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const store = useRef(createColorSchemeStore({ colorScheme })).current;
  const setRoles = useSurveyCurrentRoleStore(state => state.setRoles);
  const setCurrentRole = useSurveyCurrentRoleStore(
    state => state.setCurrentRole
  );
  const roles = useRoles();

  useEffect(() => {
    if (roles.length > 0) {
      const activeRoles = roles.filter(role => role.isActive);
      setRoles(roles);
      setCurrentRole(activeRoles[0]);
      const firstMenu = getFirstMenu(activeRoles[0]);
      if (firstMenu) {
        router.push(firstMenu);
      }
    }
  }, [roles, router, setCurrentRole, setRoles]);

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
