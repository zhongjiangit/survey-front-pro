import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import { Pagination } from 'antd';
import { useState } from 'react';
import CollectListItem from './collect-list-item';

const SubPublishTask = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { data: subPublishTackData, refresh: refreshSubPublishTask } =
    useRequest(
      () => {
        if (!currentOrg?.orgId) {
          return Promise.reject('未获取到组织机构');
        }
        return Api.listSubInspTask({
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
      <CollectListItem
        tabType="subordinate"
        itemData={subPublishTackData?.data}
        refreshPublishTask={refreshSubPublishTask}
      />
      <div className="flex py-4 justify-end">
        <Pagination
          total={subPublishTackData?.total || 0}
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

export default SubPublishTask;
