import ba from '@/assets/icons/ba.jpg';
import gh from '@/assets/icons/gh.jpg';
import { Copyright } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <div className="w-full pt-6 flex flex-col items-center gap-2">
      <div className="flex gap-5">
        <div className="flex items-center gap-1">
          <Image src={ba} alt="ba" className="w-5 h-5" />
          <span className="text-gray-500 text-sm">蜀ICP备20007092号</span>
        </div>
        <div className="flex items-center gap-1">
          <Image src={gh} alt="gh" width={20} />
          <span className="text-gray-500 text-sm">
            川公网安备 51019002002625号
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-gray-700">
        <Copyright className="h-5 w-5" />
        {`四川鼎兴数智教育咨询有限公司 ${year} 版权所有`}
      </div>
    </div>
  );
};

export default Footer;
