'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import {
  getFirstMenuByMenus,
  getMenus,
  hasMenu,
  selectMenu,
} from '@/lib/get-first-menu';
import { ColorScheme } from '@/types/ColorScheme';
import { ConfigProvider, message, theme } from 'antd';
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
import { RoleType } from '@/types/CommonType';
import { getActiveRoles } from '@/lib/get-active-roles';
import { usePathname, useRouter } from 'next/navigation';
const { darkAlgorithm, defaultAlgorithm } = theme;

interface Props {
  colorScheme: ColorScheme;
  children: ReactNode;
}

export function Provider({ colorScheme, children }: Props) {
  const store = useRef(createColorSchemeStore({ colorScheme })).current;
  const [user, ready, setReady] = useSurveyUserStore(state => [
    state.user,
    state.ready,
    state.setReady,
  ]);
  const [currentSystem, setCurrentSystem] = useSurveySystemStore(state => [
    state.currentSystem,
    state.setCurrentSystem,
  ]);
  const [currentOrg, setCurrentOrg] = useSurveyOrgStore(state => [
    state.currentOrg,
    state.setCurrentOrg,
  ]);
  const [roles, currentRole, menus, setCurrentRole, setRoles, setMenus] =
    useSurveyCurrentRoleStore(state => [
      state.roles,
      state.currentRole,
      state.getMenus(),
      state.setCurrentRole,
      state.setRoles,
      state.setMenus,
    ]);
  const router = useRouter();
  const pathname = usePathname();
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    // @ts-ignore
    window.messageApi = messageApi;
  }, [messageApi]);

  useEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }

    if (!user) {
      // setCurrentSystem(null);
      // setCurrentOrg(null);
      // setCurrentRole(null);
      // if (roles?.length) {
      //   setRoles([]);
      // }
      if (menus?.length) {
        setMenus([]);
      }
      return;
    }

    let _currentSystem = currentSystem;
    let _currentOrg = currentOrg;
    let _currentRole = currentRole;
    if (
      !_currentSystem ||
      !user?.systems?.some(t => t.systemId === _currentSystem?.systemId)
    ) {
      _currentSystem = user?.systems?.[0];
    }
    if (_currentSystem) {
      Object.assign(
        _currentSystem,
        user.systems.find(t => t.systemId === _currentSystem.systemId)
      );
    }

    if (
      _currentSystem &&
      (!_currentOrg ||
        !_currentSystem?.orgs?.some(t => t.orgId === _currentOrg?.orgId))
    ) {
      _currentOrg = _currentSystem?.orgs?.[0];
    }

    if (_currentOrg) {
      Object.assign(
        _currentOrg,
        _currentSystem?.orgs?.find(t => t.orgId === _currentOrg?.orgId)
      );
    }

    let _roles: RoleType[] = [];
    _roles = getActiveRoles(user, _currentOrg, _currentSystem);
    if (!_currentRole || !_roles?.some(t => t.key === _currentRole?.key)) {
      _currentRole = _roles[0];
    }
    if (_currentRole) {
      Object.assign(
        _currentRole,
        _roles?.find(t => _roles?.find(t => t.key === _currentRole?.key))
      );
    }

    setCurrentSystem(_currentSystem);
    setCurrentOrg(_currentOrg);
    setCurrentRole(_currentRole);
    setMenus(getMenus(_currentRole));
    setRoles(_roles);
  }, [ready, user, currentSystem, currentOrg, currentRole]);

  // 如果用户不存在，则重定向到登录页
  useEffect(() => {
    if (!ready) {
      return;
    }
    if (!user && pathname !== '/') {
      router.push('/');
      return;
    }
  }, [ready, pathname, user]);

  // 菜单变化时，切换子菜单到父亲菜单, 切换系统\机构\角色,才会从新生产菜单
  useEffect(() => {
    if (!ready || !menus.length) {
      return;
    }
    const menu = selectMenu(menus, pathname);
    if (menu && pathname !== menu.key) {
      router.push(menu.key);
    }
  }, [ready, menus]);

  // 检查是否有当前路由的访问权限,没有就跳转至第一个菜单
  useEffect(() => {
    if (!ready || !menus.length) {
      return;
    }
    if (!hasMenu(menus, pathname)) {
      const firstMenu = getFirstMenuByMenus(menus);
      if (firstMenu) {
        router.push(firstMenu);
      }
    }
  }, [ready, pathname, menus]);

  // 判断路由是否需要渲染
  if (
    !ready ||
    (pathname === '/' && user) ||
    (pathname !== '/' && (!user || !menus.length || !hasMenu(menus, pathname)))
  ) {
    children = null;
  }

  return (
    <ColorSchemeContext.Provider value={store}>
      {contextHolder}
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
