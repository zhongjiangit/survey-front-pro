import api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import { Pagination } from 'antd';
import { useState } from 'react';
import CollectListItem from './collect-list-item';
import TaskAddNewModal from './task-new-modal';

const MyPublishTask = () => {
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { data: myPublishTackData, refresh: refreshMyPublishTask } = useRequest(
    () => {
      if (!currentOrg?.orgId) {
        return Promise.reject('未获取到组织机构');
      }
      return api.listMyInspTask({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg.orgId,
        pageNumber,
        pageSize,
      });
    },
    {
      refreshDeps: [
        currentSystem?.systemId,
        currentOrg?.orgId,
        pageNumber,
        pageSize,
      ],
    }
  );
  return (
    <div className="relative">
      <TaskAddNewModal refreshMyPublishTask={refreshMyPublishTask} />
      <CollectListItem
        tabType="self"
        itemData={myPublishTackData?.data}
        refreshMyPublishTask={refreshMyPublishTask}
      />
      <div className="flex py-4 justify-end">
        <Pagination
          total={total}
          showSizeChanger
          showQuickJumper
          pageSize={pageSize}
          current={pageNumber}
          showTotal={total => `总共 ${total} 条`}
          onChange={(page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </div>
  );
};

export default MyPublishTask;
