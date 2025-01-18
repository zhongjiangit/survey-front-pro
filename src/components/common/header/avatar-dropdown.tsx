'use client';

import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { useRoles } from '@/hooks/useRoles';
import {
  ApartmentOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, type MenuProps } from 'antd';
import { CircleUserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useMemo, useState } from 'react';
import HeaderDropdown from './header-dropdown';
import OrgSwitchModal from './switch-modal/org-switch-modal';
import RoleSwitchModal from './switch-modal/role-switch-modal';
import SystemSwitchModal from './switch-modal/system-switch-modal';

export const AvatarDropdown: React.FC = () => {
  const [user, setUser] = useSurveyUserStore(state => [
    state.user,
    state.setUser,
  ]);
  const [currentRole] = useSurveyCurrentRoleStore(state => [state.currentRole]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const [currentOrg, setCurrentOrg] = useSurveyOrgStore(state => [
    state.currentOrg,
    state.setCurrentOrg,
  ]);
  const router = useRouter();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

  const roles = useRoles();

  const activeRoles = useMemo(
    () => roles?.filter(role => role.isActive),
    [roles]
  );

  const orgRoleName = useMemo(() => {
    // currentOrg?.orgId
    const org = currentSystem?.orgs?.filter(
      org => org.orgId === currentOrg?.orgId
    );
    const role = activeRoles?.filter(role => role.key === currentRole?.key);

    if (!org || !role || org?.length === 0 || role?.length === 0) {
      return '';
    }

    return `${org[0]?.orgName} - ${role[0].label}`;
  }, [activeRoles, currentOrg?.orgId, currentRole?.key, currentSystem?.orgs]);
  /**
   * 退出登录
   */
  const loginOut = () => {
    // 跳转到登录页
    router.push('/');
    // 清空用户信息
    setUser(null);
  };

  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      loginOut();
      return;
    }
    if (key === 'role') {
      setIsRoleModalOpen(true);
      return;
    }
    if (key === 'org') {
      setIsOrgModalOpen(true);
      return;
    }
    if (key === 'system') {
      setIsSystemModalOpen(true);
      return;
    }
    // history.push(`/account/${key}`);
  }, []);

  const items: MenuProps['items'] = [
    {
      key: 'system',
      icon: <TeamOutlined />,
      label: '系统切换',
    },
    {
      key: 'org',
      icon: <ApartmentOutlined />,
      label: '单位切换',
    },
    {
      key: 'role',
      icon: <UserSwitchOutlined />,
      label: '角色切换',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: items,
        }}
        placement="bottomRight"
      >
        <div className="flex flex-col items-center">
          <Button type="text" className="flex gap-1 items-center">
            <CircleUserRound className="w-5 h-5" />
            <span>{!!user && currentRole?.name}</span>
          </Button>
          <div className="text-sm text-blue-400">{orgRoleName}</div>
        </div>
      </HeaderDropdown>
      <RoleSwitchModal
        isRoleModalOpen={isRoleModalOpen}
        setIsRoleModalOpen={setIsRoleModalOpen}
      />
      <OrgSwitchModal
        isOrgModalOpen={isOrgModalOpen}
        setIsOrgModalOpen={setIsOrgModalOpen}
      />
      <SystemSwitchModal
        systems={user?.systems}
        isSystemModalOpen={isSystemModalOpen}
        setIsSystemModalOpen={setIsSystemModalOpen}
      />
    </>
  );
};
