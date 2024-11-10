'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { StaffTypeEnum } from '@/types/CommonType';
import { Tabs, TabsProps } from 'antd';
import { useMemo } from 'react';
import MyPublishTask from './modules/my-publish-task';
import SubPublishTask from './modules/sub-publish-task';

const CollectManage = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const items: TabsProps['items'] = useMemo(() => {
    if (currentRole && currentRole?.staffType === StaffTypeEnum.Admin) {
      return [
        {
          key: '1',
          label: '我发布的任务',
          children: <MyPublishTask />,
        },
      ];
    } else {
      return [
        {
          key: '1',
          label: '我发布的任务',
          children: <MyPublishTask />,
        },
        {
          key: '2',
          label: '下级发布的任务',
          children: <SubPublishTask />,
        },
      ];
    }
  }, []);
  return <Tabs defaultActiveKey="1" items={items} />;
};

export default CollectManage;
