import ba from '@/src/assets/icons/ba.jpg';
import gh from '@/src/assets/icons/gh.jpg';
import { DefaultFooter } from '@ant-design/pro-components';
import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
        margin: '0 0 12px',
      }}
      copyright={`四川鼎兴数智教育咨询有限公司 ${year} 版权所有`}
      links={[
        {
          key: '蜀ICP备20007092号',
          title: (
            <>
              <Image src={ba} alt="ba" width={20} />
              <span>蜀ICP备20007092号</span>
            </>
          ),
          href: 'http://beian.miit.gov.cn',
          blankTarget: true,
        },
        {
          key: '川公网安备 51019002002625号',
          title: (
            <>
              <Image src={gh} alt="gh" width={20} />
              <span>川公网安备 51019002002625号</span>
            </>
          ),
          href: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51019002002625',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
