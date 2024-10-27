'use client';

import { Tabs } from 'antd';
import TemplateDetail from '@/components/common/template-detail';
import Breadcrumbs from '@/components/common/breadcrumbs';

const Page = () => {
  return (
    <>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '资料收集', href: '/survey/collect/fill' },
          {
            label: '资料填报',
            href: '/survey/collect/fill/detail',
            active: true,
          },
        ]}
      />
      <div className="py-10 min-h-96 h-[80vh] shadow-lg">
        <Tabs
          tabPosition={'left'}
          items={new Array(3).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: `NO ${id}`,
              key: id,
              children: <TemplateDetail />,
            };
          })}
        />
      </div>
    </>
  );
};

export default Page;
