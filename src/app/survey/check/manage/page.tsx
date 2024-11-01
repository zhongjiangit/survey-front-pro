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
          <CollectListItem tabType="self" itemData={collectDataSource} />
        </div>
      ),
    },
    {
      key: '2',
      label: '下级发布的任务',
      children: (
        <CollectListItem tabType="subordinate" itemData={collectDataSource} />
      ),
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default CollectManage;
