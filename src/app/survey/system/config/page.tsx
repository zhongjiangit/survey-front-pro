'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import useSystemListAllSWR from '@/data/system/useSystemListAllSWR';
import { Button, Spin, Tabs, TabsProps } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Basic from './modules/basic';
import Check from './modules/check';
import Collect from './modules/collect';
import Node from './modules/node';
import CreateModal from './modules/create-modal';

export default function Page() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedTab = searchParams.get('tab');
  const [activeKey, setActiveKey] = useState(selectedTab || 'basic');
  const [open, setOpen] = useState(false);
  const user = useSurveyUserStore(state => state.user);
  const { data: list, isLoading } = useSystemListAllSWR({
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

  useEffect(() => {
    if (!!selectedTab) {
      setActiveKey(selectedTab);
    }
  }, [selectedTab]);

  const extraButton = useMemo(() => {
    switch (activeKey) {
      case 'collect':
        return (
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            新增数据收集
          </Button>
        );
      case 'spotCheck':
        return (
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            新增试题抽检问卷
          </Button>
        );
      default:
        return <></>;
    }
  }, [activeKey]);

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
          tabBarExtraContent={extraButton}
          items={items}
          activeKey={activeKey}
          onChange={(activeKey: string) => {
            setActiveKey(activeKey);
          }}
        />
      )}
      <CreateModal
        open={open}
        setOpen={setOpen}
        title={activeKey === 'collect' ? '资料收集' : '试题抽检'}
      />
    </main>
  );
}
