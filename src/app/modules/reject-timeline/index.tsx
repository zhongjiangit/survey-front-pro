'use client';

import { useRequest } from 'ahooks';
import { Modal, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import Api from '../../../api';
import { useSurveyOrgStore } from '../../../contexts/useSurveyOrgStore';
import { useSurveyCurrentRoleStore } from '../../../contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '../../../contexts/useSurveySystemStore';

interface RejectTimelineProps {
  taskId: number;
}

const RejectTimeline = ({ taskId }: RejectTimelineProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
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
      if (!currentSystem?.systemId || !currentOrg?.orgId || !currentRole?.id) {
        return Promise.reject(
          'currentSystem or currentOrg or currentRole is not exist'
        );
      }
      return Api.listRejectFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg!.orgId!,
        taskId: taskId,
        staffId: currentRole.id as number,
      });
    },
    {
      refreshDeps: [
        currentSystem?.systemId,
        currentOrg?.orgId,
        currentRole?.id,
      ],
    }
  );

  useEffect(() => {
    if (isModalOpen) {
      run();
    }
  }, [open]);

  return (
    <>
      <a className="text-blue-500" onClick={showModal}>
        驳回履历
      </a>
      <Modal
        title="驳回履历"
        open={isModalOpen}
        onOk={handleOk}
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
