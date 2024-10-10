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
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon, hide: true },
//   {
//     name: 'Customers',
//     href: '/dashboard/customers',
//     icon: UserGroupIcon,
//     hide: true,
//   },
//   { name: '系统管理', href: '/survey/system', icon: MonitorCog, hide: false },
//   { name: '成员管理', href: '/survey/member', icon: UsersRound, hide: false },
//   { name: '专家配置', href: '/survey/expert', icon: BookUser, hide: false },
//   {
//     name: '数据收集一览',
//     href: '/survey/collect',
//     icon: SquareLibrary,
//     hide: false,
//   },
//   {
//     name: '试题抽检一览',
//     href: '/survey/check',
//     icon: BookOpenCheck,
//     hide: false,
//   },
//   {
//     name: '个人中心',
//     href: '/survey/profile',
//     icon: UserRoundCog,
//     hide: false,
//   },
//   {
//     name: '充值/续费',
//     href: '/survey/recharge',
//     icon: Cable,
//     hide: false,
//   },
// ];

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
  const pathname = usePathname();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  const onSelect: MenuProps['onSelect'] = e => {
    console.log('onSelect', e);
    setSelectedKeys(e.selectedKeys);
    router.push(e.key);
  };
  return (
    <div>
      {/* {links.map(link => {
        if (link.hide) return null;
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-900 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-800 hover:text-blue-600 dark:hover:text-blue-50 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 dark:bg-sky-800 text-blue-600 dark:text-blue-50':
                  pathname.includes(link.href),
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })} */}
      <Menu
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        defaultOpenKeys={['/survey/collect']}
        style={{ width: 240 }}
        mode="inline"
        items={items}
      />
    </div>
  );
}
