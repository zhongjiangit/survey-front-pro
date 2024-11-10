'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { StaffTypeEnum } from '@/types/CommonType';
import { Pagination, Tabs, TabsProps } from 'antd';
import { useMemo } from 'react';
import { checkDataSource } from '../testData';
import CollectListItem from './modules/collect-list-item';
import TaskAddNewModal from './modules/task-new-modal';

const CollectManage = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const items: TabsProps['items'] = useMemo(() => {
    if (currentRole && currentRole?.staffType === StaffTypeEnum.Admin) {
      return [
        {
          key: '1',
          label: '我发布的任务',
          children: (
            <div className="relative">
              <TaskAddNewModal />
              <CollectListItem tabType="self" itemData={checkDataSource} />
              <div className="flex py-4 justify-end">
                <Pagination
                  total={15}
                  showSizeChanger
                  showQuickJumper
                  showTotal={total => `总共 ${total} 条`}
                />
              </div>
            </div>
          ),
        },
      ];
    } else {
      return [
        {
          key: '1',
          label: '我发布的任务',
          children: (
            <div className="relative">
              <TaskAddNewModal />
              <CollectListItem tabType="self" itemData={checkDataSource} />
              <div className="flex py-4 justify-end">
                <Pagination
                  total={15}
                  showSizeChanger
                  showQuickJumper
                  showTotal={total => `总共 ${total} 条`}
                />
              </div>
            </div>
          ),
        },
        {
          key: '2',
          label: '下级发布的任务',
          children: (
            <CollectListItem tabType="subordinate" itemData={checkDataSource} />
          ),
        },
      ];
    }
  }, []);
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default CollectManage;
