'use client';

import { Tabs, TabsProps } from 'antd';
import { collectDataSource } from '../testData';
import CollectListItem from './modules/CollectListItem';
import TaskAddNewModal from './modules/task-new-modal';

const CollectManage = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '我发布的任务',
      children: (
        <div className="relative">
          <TaskAddNewModal />
          <CollectListItem
            tabType="self"
            itemData={{
              title: '小学教学计划资料收集',
              dataSource: collectDataSource,
              showNumber: 1,
            }}
          />
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
