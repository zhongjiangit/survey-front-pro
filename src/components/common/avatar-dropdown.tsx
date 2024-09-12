'use client';
import {
  ApartmentOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { signOut } from 'auth';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { Button } from '../ui/button';
import RoleSwitchModal from './RoleSwitchModal';
import SystemSwitchModal from './SystemSwitchModal';
import UnitSwitchModal from './UnitSwitchModal';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    // await outLogin();
    // const { search, pathname } = window.location;
    // const urlParams = new URL(window.location.href).searchParams;
    // /** 此方法会跳转到 redirect 参数所在的位置 */
    // const redirect = urlParams.get('redirect');
    // // Note: There may be security issues, please note
    // if (window.location.pathname !== '/user/login' && !redirect) {
    //   history.replace({
    //     pathname: '/user/login',
    //     search: stringify({
    //       redirect: pathname + search,
    //     }),
    //   });
    // }
    async () => {
      'use server';
      await signOut();
    };
  };

  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      // flushSync(() => {
      //   setInitialState(s => ({ ...s, currentUser: undefined }));
      // });
      ('use server');
      loginOut();
      return;
    }
    if (key === 'role') {
      setIsRoleModalOpen(true);
      return;
    }
    if (key === 'unit') {
      setIsUnitModalOpen(true);
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
      key: 'unit',
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
      <Dropdown menu={{ items }} placement="bottomRight">
        <Button variant="ghost">测试员</Button>
      </Dropdown>
      <RoleSwitchModal
        isRoleModalOpen={isRoleModalOpen}
        setIsRoleModalOpen={setIsRoleModalOpen}
      />
      <UnitSwitchModal
        isUnitModalOpen={isUnitModalOpen}
        setIsUnitModalOpen={setIsUnitModalOpen}
      />
      <SystemSwitchModal
        isSystemModalOpen={isSystemModalOpen}
        setIsSystemModalOpen={setIsSystemModalOpen}
      />
    </>
  );
};
