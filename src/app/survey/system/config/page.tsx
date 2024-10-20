'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { Spin, Tabs, TabsProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Basic from './modules/basic';
import Check from './modules/check';
import Collect from './modules/collect';
import Node from './modules/node';
import { useRequest } from 'ahooks';
import Api from '@/api';

export default function Page() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const selectedTab = searchParams.get('tab');
  const selectedId = searchParams.get('id');
  const [activeKey, setActiveKey] = useState(selectedTab || 'basic');
  const user = useSurveyUserStore(state => state.user);

  // 使用ahooks的useRequest
  const { data: systemList, loading: isLoading } = useRequest(() => {
    return Api.getSystemListAll({
      currentSystemId: user?.systems[0].systemId,
    });
  });

  const system = useMemo(() => {
    if ((systemList?.data ?? []).length > 0) {
      const dataList = systemList?.data;
      const dataSources = (dataList ?? []).filter(
        ({ id }: { id: number }) => id === Number(selectedId)
      );
      if (dataSources.length > 0) {
        return dataSources[0];
      }
      return null;
    }
    return null;
  }, [systemList?.data, selectedId]);

  /**
   * 设置url参数
   */
  const setUrlParams = useCallback(
    (key?: string) => {
      const params = new URLSearchParams(searchParams);
      if (key) {
        params.set('tab', key);
      } else {
        params.delete('tab');
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, replace, pathname]
  );

  useEffect(() => {
    if (!!selectedTab) {
      setActiveKey(selectedTab);
    }
  }, [selectedTab]);

  const items: TabsProps['items'] = useMemo(() => {
    if (!!system) {
      return [
        {
          key: 'basic',
          label: '标签配置',
          children: <Basic system={system} />,
        },
        {
          key: 'node',
          label: '单位节点配置',
          children: <Node system={system} />,
        },
        {
          key: 'collect',
          label: '资料收集配置',
          children: <Collect system={system} />,
        },
        {
          key: 'spotCheck',
          label: '试题抽检配置',
          children: <Check system={system} />,
        },
      ];
    } else {
      return [];
    }
  }, [system]);

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
      {isLoading ? (
        <div className="h-[50vh] w-full flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Tabs
          items={items}
          activeKey={activeKey}
          onChange={(activeKey: string) => {
            setActiveKey(activeKey);
            setUrlParams(activeKey);
          }}
        />
      )}
    </main>
  );
}
