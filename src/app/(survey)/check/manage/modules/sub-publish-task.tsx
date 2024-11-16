import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { Pagination } from 'antd';
import { useState } from 'react';
import CollectListItem from './collect-list-item';

const SubPublishTask = () => {
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  // todo 接口未完成
  // const { data: subPublishResponse } = useRequest(
  //   () => {
  //     return api.listSubInspTask({
  //       currentSystemId: currentSystem?.systemId!,
  //       currentOrgId: currentOrg!.orgId!,
  //       pageNumber,
  //       pageSize,
  //     });
  //   },
  //   {
  //     refreshDeps: [
  //       currentSystem?.systemId,
  //       currentOrg?.orgId,
  //       pageNumber,
  //       pageSize,
  //     ],
  //   }
  // );
  return (
    <div>
      <CollectListItem
        tabType="subordinate"
        itemData={[]}
        // itemData={subPublishResponse?.data}
        refreshMyPublishTask={() => {
          // Add your refresh logic here
        }}
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
