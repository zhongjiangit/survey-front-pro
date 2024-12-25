'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { getFirstMenuByMenus, hasMenu } from '@/lib/get-first-menu';
import { Role_Enum } from '@/types/CommonType';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import {
  BookOpenCheck,
  BookUser,
  Cable,
  MonitorCog,
  SquareLibrary,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const originMenus = [
  {
    label: '系统管理',
    key: '/system',
    icon: <MonitorCog className="w-4 h-4" />,
    access: [Role_Enum.PLATFORM_ADMIN, Role_Enum.SYSTEM_ADMIN],
  },
  {
    label: '成员管理',
    key: '/member',
    icon: <UsersRound className="w-4 h-4" />,
    access: [
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
    ],
  },
  {
    label: '专家配置',
    key: '/expert',
    icon: <BookUser className="w-4 h-4" />,
    access: [
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
    ],
  },
  {
    label: '试题抽检',
    key: '/check',
    icon: <BookOpenCheck className="w-4 h-4" />,
    access: [
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
      Role_Enum.MEMBER,
      Role_Enum.EXPERT,
    ],
    children: [
      {
        label: '管理',
        key: '/check/manage',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '分配',
        key: '/check/allocate',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '填报',
        key: '/check/fill',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
          Role_Enum.MEMBER,
        ],
      },
      {
        label: '评审',
        key: '/check/review',
        access: [Role_Enum.EXPERT],
      },
    ],
  },
  {
    label: '资料收集',
    key: '/collect',
    icon: <SquareLibrary className="w-4 h-4" />,
    access: [
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
      Role_Enum.MEMBER,
    ],
    children: [
      {
        label: '管理',
        key: '/collect/manage',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '分配',
        key: '/collect/allocate',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '填报',
        key: '/collect/fill',
        access: [
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
          Role_Enum.MEMBER,
        ],
      },
    ],
  },
  {
    label: '个人中心',
    key: '/setting',
    icon: <UserRoundCog className="w-4 h-4" />,
    access: [
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
      Role_Enum.MEMBER,
      Role_Enum.EXPERT,
    ],
  },
  {
    label: '充值/续费',
    key: '/recharge',
    icon: <Cable className="w-4 h-4" />,
    access: [Role_Enum.SYSTEM_ADMIN],
  },
];

export default function NavLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const [menus] = useSurveyCurrentRoleStore(state => [state.getMenus()]);

  // 跳转至第一个菜单
  useEffect(() => {
    if (!menus?.length || hasMenu(menus, pathname)) {
      return;
    }
    const firstMenu = getFirstMenuByMenus(menus);
    if (firstMenu) {
      router.push(firstMenu);
    }
  }, [pathname, menus]);

  const onSelect: MenuProps['onSelect'] = e => {
    router.push(e.key);
  };

  return (
    <Menu
      selectedKeys={[pathname]}
      onSelect={onSelect}
      defaultOpenKeys={['/collect', '/check']}
      style={{ width: 200 }}
      mode="inline"
      items={menus || []}
    />
  );
}
