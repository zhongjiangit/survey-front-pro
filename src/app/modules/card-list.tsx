'use client';

import computer from '@/assets/images/computer.svg';
import magnifying from '@/assets/images/magnifying.svg';
import person from '@/assets/images/person.svg';
import road from '@/assets/images/road.svg';
import { Card } from 'antd';
import Image from 'next/image';

function CardList() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Card
        onClick={() => {
          window.open('https://dxjy.online/', '_blank');
        }}
        bordered={false}
        hoverable
        className="bg-sky-100 dark:bg-sky-900 p-4"
      >
        <div className="flex justify-center gap-2 font-extrabold text-zinc-600 dark:text-zinc-200">
          <Image src={computer} alt="" width={24} />
          平台服务
        </div>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-300">
          打造智慧督导创新平台
        </div>
      </Card>
      <Card
        onClick={() => {
          window.open('https://dxjy.online/', '_blank');
        }}
        bordered={false}
        hoverable
        className="bg-sky-100 dark:bg-sky-900 p-4"
      >
        <div className="flex justify-center gap-2 font-extrabold text-zinc-600 dark:text-zinc-200">
          <Image src={magnifying} alt="" width={24} />
          数据采集与挖掘
        </div>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-300">
          你身边的教育数据治理专家
        </div>
      </Card>
      <Card
        onClick={() => {
          window.open('https://dxjy.online/', '_blank');
        }}
        bordered={false}
        hoverable
        className="bg-sky-100 dark:bg-sky-900 p-4"
      >
        <div className="flex justify-center gap-2 font-extrabold text-zinc-600 dark:text-zinc-200">
          <Image src={road} alt="" width={24} />
          学校发展咨询
        </div>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-300">
          学校特色发展的指导师
        </div>
      </Card>
      <Card
        onClick={() => {
          window.open('https://dxjy.online/', '_blank');
        }}
        bordered={false}
        hoverable
        className="bg-sky-100 dark:bg-sky-900 p-4"
      >
        <div className="flex justify-center gap-2 font-extrabold text-zinc-600 dark:text-zinc-200">
          <Image src={person} alt="" width={24} />
          教育决策咨询
        </div>
        <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-300">
          区域教育发展的智囊团
        </div>
      </Card>
    </div>
  );
}

export default CardList;
