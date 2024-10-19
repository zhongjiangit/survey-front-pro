'use client';
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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const items = [
  {
    label: '系统管理',
    key: '/survey/system',
    icon: <MonitorCog className="w-4 h-4" />,
  },
  {
    label: '成员管理',
    key: '/survey/member',
    icon: <UsersRound className="w-4 h-4" />,
  },
  {
    label: '专家配置',
    key: '/survey/expert',
    icon: <BookUser className="w-4 h-4" />,
  },
  {
    label: '资料收集',
    key: '/survey/collect',
    icon: <SquareLibrary className="w-4 h-4" />,
    children: [
      {
        label: '管理',
        key: '/survey/collect/manage',
      },
      {
        label: '分配',
        key: '/survey/collect/allocate',
      },
      {
        label: '填报',
        key: '/survey/collect/fill',
      },
    ],
  },
  {
    label: '试题抽检',
    key: '/survey/check',
    icon: <BookOpenCheck className="w-4 h-4" />,
  },
  {
    label: '个人中心',
    key: '/survey/profile',
    icon: <UserRoundCog className="w-4 h-4" />,
  },
  {
    label: '充值/续费',
    key: '/survey/recharge',
    icon: <Cable className="w-4 h-4" />,
  },
];

export default function NavLinks() {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onSelect: MenuProps['onSelect'] = e => {
    setSelectedKeys(e.selectedKeys);
    router.push(e.key);
  };
  return (
    <Menu
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      defaultOpenKeys={['/survey/collect']}
      style={{ width: 240 }}
      mode="inline"
      items={items}
    />
  );
}
