import logo from '@/assets/icons/logo.png';
import Image from 'next/image';
import { lusitana } from './fonts';

export default function HeaderLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center gap-2 leading-none text-white`}
    >
      <Image alt="logo" className="w-8 h-8 md:w-12 md:h-12" src={logo} />
      <p className="text-md md:text-2xl">
        Acme
        {/* 四川鼎兴数智教育咨询有限公司 */}
      </p>
      {/* <ThemeSwitcher /> */}
    </div>
  );
}
