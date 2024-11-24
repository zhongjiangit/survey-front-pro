'use client';

import Role_Enum from '@/access/access-enum';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { cloneDeep } from 'lodash';
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
import { useEffect, useMemo, useState } from 'react';

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
      Role_Enum.PLATFORM_ADMIN,
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
      Role_Enum.PLATFORM_ADMIN,
      Role_Enum.SYSTEM_ADMIN,
      Role_Enum.ORG_ADMIN,
      Role_Enum.NORMAL_ADMIN,
    ],
  },
  {
    label: '资料收集',
    key: '/collect',
    icon: <SquareLibrary className="w-4 h-4" />,
    access: [
      Role_Enum.PLATFORM_ADMIN,
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
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '分配',
        key: '/collect/allocate',
        access: [
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '填报',
        key: '/collect/fill',
        access: [
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
          Role_Enum.MEMBER,
        ],
      },
    ],
  },
  {
    label: '试题抽检',
    key: '/check',
    icon: <BookOpenCheck className="w-4 h-4" />,
    access: [
      Role_Enum.PLATFORM_ADMIN,
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
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '分配',
        key: '/check/allocate',
        access: [
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
        ],
      },
      {
        label: '填报',
        key: '/check/fill',
        access: [
          Role_Enum.PLATFORM_ADMIN,
          Role_Enum.SYSTEM_ADMIN,
          Role_Enum.ORG_ADMIN,
          Role_Enum.NORMAL_ADMIN,
          Role_Enum.MEMBER,
        ],
      },
      {
        label: '评审',
        key: '/check/review',
        access: [Role_Enum.PLATFORM_ADMIN, Role_Enum.EXPERT],
      },
    ],
  },
  {
    label: '个人中心',
    key: '/profile',
    icon: <UserRoundCog className="w-4 h-4" />,
    access: [
      Role_Enum.PLATFORM_ADMIN,
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
    access: [Role_Enum.PLATFORM_ADMIN, Role_Enum.SYSTEM_ADMIN],
  },
];

export default function NavLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const menus = useMemo(() => {
    const cloneMenus = cloneDeep(originMenus);
    return cloneMenus.filter(item => {
      if (item.access.includes(currentRole?.key as string)) {
        if (item.children) {
          const children = item.children.filter(child => {
            return child.access.includes(currentRole?.key as string);
          });
          item.children = children;
        }
        return true;
      }
      return false;
    });
  }, [currentRole]);

  useEffect(() => {
    // 根据当前路径设置选中的菜单项，items是含有children的数组，所以需要遍历,返回匹配的key
    const key = menus
      .map(item => {
        if (pathname.includes(item.key) && !item.children) {
          return item.key;
        }
        if (item.children) {
          return item.children.find(child => pathname.includes(child.key))?.key;
        }
        return null;
      })
      .filter(Boolean)[0];

    if (key && key !== selectedKeys[0]) {
      setSelectedKeys([key]);
    } else if (menus.length && key === undefined) {
      router.push('/forbidden');
    }
  }, [menus, pathname, router, selectedKeys]);

  const onSelect: MenuProps['onSelect'] = e => {
    setSelectedKeys(e.selectedKeys);
    router.push(e.key);
  };
  return (
    <Menu
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      defaultOpenKeys={['/collect', '/check']}
      style={{ width: 240 }}
      mode="inline"
      items={menus}
    />
  );
}
