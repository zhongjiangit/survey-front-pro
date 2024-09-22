import logo from '@/assets/icons/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { lusitana } from '../../display/fonts';
import ThemeSwitcher from '../theme-switcher';
import { AvatarDropdown } from './avatar-dropdown';

interface HeaderProps {
  isThemeShow?: boolean;
}

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
      </div>
    </div>
  );
}
