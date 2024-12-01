'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
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
import React, { useCallback, useState } from 'react';
import HeaderDropdown from './header-dropdown';
import OrgSwitchModal from './switch-modal/org-switch-modal';
import RoleSwitchModal from './switch-modal/role-switch-modal';
import SystemSwitchModal from './switch-modal/system-switch-modal';

export type GlobalHeaderRightProps = {};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  const user = useSurveyUserStore(state => state.user);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const router = useRouter();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = useCallback(() => {
    // 清空local storage
    localStorage.clear();
    // 跳转到登录页
    router.push('/');
  }, [router]);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
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
    },
    [loginOut]
  );

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
        <Button type="text" className="flex gap-1 items-center">
          <CircleUserRound className="w-5 h-5" />
          {currentRole?.name}
        </Button>
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
