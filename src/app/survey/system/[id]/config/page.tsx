import Breadcrumbs from '@/components/common/breadcrumbs';
import { fetchInvoiceById } from '@/lib/data';
import { Tabs, TabsProps } from 'antd';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Basic from './modules/basic';
import Check from './modules/check';
import Collect from './modules/collect';
import Node from './modules/node';

export const metadata: Metadata = {
  title: '系统配置',
};

const items: TabsProps['items'] = [
  {
    key: 'basic',
    label: '基本信息配置',
    children: <Basic />,
  },
  {
    key: 'node',
    label: '节点配置',
    children: <Node />,
  },
  {
    key: 'collect',
    label: '数据收集',
    children: <Collect />,
  },
  {
    key: 'spotCheck',
    label: '试题抽检问卷',
    children: <Check />,
  },
];

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [invoice] = await Promise.all([fetchInvoiceById(id)]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '配置系统',
            href: `/survey/system/${id}/config`,
            active: true,
          },
        ]}
      />
      <Tabs defaultActiveKey="basic" items={items} />
    </main>
  );
}
