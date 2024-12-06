'use client';

import Api from '@/api';
import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { Role_Enum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Spin, Tabs, TabsProps } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Basic from './modules/basic';
import Check from './modules/check';
import Collect from './modules/collect';
import Node from './modules/node';

export default function Page() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const selectedTab = searchParams.get('tab');
  const selectedId = searchParams.get('id');
  const [activeKey, setActiveKey] = useState(selectedTab || 'basic');
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const isPlatformAdmin = currentRole?.key === Role_Enum.PLATFORM_ADMIN;

  const { data: systemList, loading: isLoading } = useRequest(
    () => {
      if (!isPlatformAdmin && !currentSystem?.systemId) {
        return Promise.reject('currentSystem is not exist');
      } else if (!isPlatformAdmin && currentSystem?.systemId) {
        return Api.getSystemListAll({
          currentSystemId: currentSystem.systemId,
        });
      } else {
        return Api.getSystemListAll({ currentSystemId: null });
      }
    },
    {
      refreshDeps: [currentSystem?.systemId],
    }
  );

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
          key: 'check',
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
          { label: '系统管理', href: '/system' },
          {
            label: '配置系统',
            href: `/system/config?id=${selectedId}`,
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
