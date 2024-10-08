'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import { Tabs, TabsProps } from 'antd';
import { useSearchParams } from 'next/navigation';
import Basic from './modules/basic';
import Check from './modules/check';
import Collect from './modules/collect';
import Node from './modules/node';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import useSystemListAllSWR from '@/data/system/useSystemListAllSWR';
import { useMemo } from 'react';
import NotFound from './not-found';

export default function Page() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  const user = useSurveyUserStore(state => state.user);
  const { data: list } = useSystemListAllSWR({
    currentSystemId: user?.systems[0].systemId,
  });

  const system = useMemo(() => {
    if ((list?.data.data ?? []).length > 0) {
      const dataList = list?.data.data;
      const dataSources = (dataList ?? []).filter(
        ({ id }: { id: number }) => id === Number(selectedId)
      );
      if (dataSources.length > 0) {
        return dataSources[0];
      }
      return null;
    }
    return null;
  }, [list?.data.data, selectedId]);

  if (!system) {
    return <NotFound />;
  }

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'basic',
        label: '基本信息配置',
        children: <Basic system={system} />,
      },
      {
        key: 'node',
        label: '单位节点配置',
        children: <Node system={system} />,
      },
      {
        key: 'collect',
        label: '数据收集配置',
        children: <Collect system={system} />,
      },
      {
        key: 'spotCheck',
        label: '试题抽检问卷配置',
        children: <Check system={system} />,
      },
    ],
    [system]
  );

  return (
    <main>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '配置系统',
            href: `/survey/system/config?id=${selectedId}`,
            active: true,
          },
        ]}
      />
      <Tabs defaultActiveKey="basic" items={items} />
    </main>
  );
}
