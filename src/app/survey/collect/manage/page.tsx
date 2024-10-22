'use client';

import { Tabs, TabsProps } from 'antd';
import CollectListItem from './CollectListItem';
import { collectDataSource } from './testData';

const CollectManage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '我发布的任务',
      children: (
        <>
          <CollectListItem
            tabType="self"
            itemData={{
              title: '小学教学计划资料收集',
              dataSource: collectDataSource,
              showNumber: 1,
            }}
          />
          <CollectListItem
            tabType="self"
            itemData={{
              title: '初中教学计划资料收集',
              dataSource: collectDataSource,
              showNumber: 2,
            }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '下级发布的任务',
      children: (
        <CollectListItem
          tabType="subordinate"
          itemData={{
            title: '中学教学计划资料收集',
            dataSource: [],
            showNumber: 1,
          }}
        />
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default CollectManage;
