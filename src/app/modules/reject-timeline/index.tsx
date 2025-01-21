'use client';

import { useRequest } from 'ahooks';
import { Modal, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import Api from '../../../api';
import { useSurveyOrgStore } from '../../../contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '../../../contexts/useSurveySystemStore';

interface RejectTimelineProps {
  taskId?: number;
  staffId: number;
}

const RejectTimeline = ({ taskId, staffId }: RejectTimelineProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * 获取驳回列表
   */
  const { data, run } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !taskId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.listRejectFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: taskId,
        staffId: staffId,
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (isModalOpen) {
      run();
    }
  }, [isModalOpen, run]);

  return (
    <>
      <a className="text-blue-500 block max-w-8" onClick={showModal}>
        驳回履历
      </a>
      <Modal
        title="驳回履历"
        open={isModalOpen}
        onOk={handleOk}
        maskClosable={false}
        onCancel={handleCancel}
      >
        <div className="p-10">
          <Timeline
            items={
              data?.data?.map(item => ({
                color: 'red',
                children: (
                  <>
                    <h2 className="text-lg font-bold">
                      {item.rejecterName} {item.rejectTime}
                    </h2>
                    <p className="max-w-80">{item.rejectComment}</p>
                  </>
                ),
              })) || []
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default RejectTimeline;
