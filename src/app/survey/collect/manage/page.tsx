'use client';

import { Button, Tabs, TabsProps } from 'antd';
import CollectListItem from './modules/CollectListItem';
import { collectDataSource } from './testData';

const CollectManage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '我发布的任务',
      children: (
        <div className="relative">
          <div className="absolute right-0 -top-14">
            <Button type="primary">发布新任务</Button>
          </div>
          <CollectListItem
            tabType="self"
            itemData={{
              title: '小学教学计划资料收集',
              dataSource: collectDataSource,
              showNumber: 1,
            }}
          />
          {/* <CollectListItem
            tabType="self"
            itemData={{
              title: '初中教学计划资料收集',
              dataSource: collectDataSource,
              showNumber: 2,
            }}
          /> */}
        </div>
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
            dataSource: collectDataSource,
            showNumber: 1,
          }}
        />
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default CollectManage;
