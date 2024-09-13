import logo from '@/assets/icons/logo.png';
import {
  ApartmentOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { lusitana } from '../fonts';
import ThemeSwitcher from '../theme-switcher';
import { AvatarDropdown } from './avatar-dropdown';

interface HeaderProps {
  isThemeShow?: boolean;
}

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
];
export default function Header({ isThemeShow = false }: HeaderProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <Link href="/">
        <div
          className={`${lusitana.className} flex flex-row items-center gap-2 leading-none`}
        >
          <Image alt="logo" className="w-8 h-8 md:w-12 md:h-12" src={logo} />
          <p className="hidden sm:block sm:text-md md:text-2xl">
            四川鼎兴数智教育咨询有限公司
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {isThemeShow && <ThemeSwitcher />}
        <AvatarDropdown />

        {/* <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 dark:hover:bg-gray-950 hover:text-blue-600 dark:hover:text-blue-50 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form> */}
      </div>
    </div>
  );
}
