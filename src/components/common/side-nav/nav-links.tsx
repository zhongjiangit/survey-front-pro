'use client';
import { cn } from '@/lib/utils';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import {
  BookOpenCheck,
  BookUser,
  MonitorCog,
  SquareLibrary,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, hide: true },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: UserGroupIcon,
    hide: true,
  },
  { name: '系统管理', href: '/survey/system', icon: MonitorCog, hide: false },
  { name: '成员管理', href: '/survey/member', icon: UsersRound, hide: false },
  { name: '专家配置', href: '/survey/expert', icon: BookUser, hide: false },
  {
    name: '数据收集一览',
    href: '/survey/collect',
    icon: SquareLibrary,
    hide: false,
  },
  {
    name: '试题抽检一览',
    href: '/survey/check',
    icon: BookOpenCheck,
    hide: false,
  },
  {
    name: '个人中心',
    href: '/survey/profile',
    icon: UserRoundCog,
    hide: false,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map(link => {
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
      })}
    </>
  );
}
