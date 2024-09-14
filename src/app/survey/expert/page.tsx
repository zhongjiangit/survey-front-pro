'use client';
import CustomTree from '@/components/common/custom-tree';
import type { TreeDataNode } from 'antd';

const mockData: TreeDataNode[] = [
  {
    title: '四川省',
    key: '0-0',
    children: [
      {
        title: '绵阳市',
        key: '0-0-0',
        children: [
          {
            title: '涪城区',
            key: '0-0-0-0',
            children: [
              { title: '绵阳中学', key: '0-0-0-0-0' },
              { title: '南山中学', key: '0-0-0-1-1' },
            ],
          },
          { title: '游仙区', key: '0-0-0-1' },
          { title: '江油市', key: '0-0-0-2' },
        ],
      },
      {
        title: '自贡市',
        key: '0-0-1',
        children: [{ title: '二中', key: '0-0-1-0' }],
      },
      {
        title: '内江市',
        key: '0-0-2',
      },
    ],
  },
];

function Page() {
  return (
    <div>
      <CustomTree dataSource={mockData} />
    </div>
  );
}

export default Page;
