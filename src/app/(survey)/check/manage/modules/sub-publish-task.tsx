import api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import { Pagination } from 'antd';
import { useState } from 'react';
import CollectListItem from './collect-list-item';

const SubPublishTask = () => {
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { data: subPublishResponse } = useRequest(
    () => {
      // todo 是否是这个接口
      return api.listReviewTaskExpert({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
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
    <div>
      <CollectListItem
        tabType="subordinate"
        itemData={subPublishResponse?.data}
      />
      <div className="flex py-4 justify-end">
        <Pagination
          total={15}
          showSizeChanger
          showQuickJumper
          showTotal={total => `总共 ${total} 条`}
        />
      </div>
    </div>
  );
};

export default SubPublishTask;
