import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { UserSystemType } from '@/types/SystemType';
import type { RadioChangeEvent } from 'antd';
import { Button, Modal, Radio, Space } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

interface SystemSwitchModalProps {
  systems?: UserSystemType[];
  isSystemModalOpen: boolean;
  setIsSystemModalOpen: (isSystemModalOpen: boolean) => void;
}

const SystemSwitchModal: FunctionComponent<SystemSwitchModalProps> = ({
  systems,
  isSystemModalOpen,
  setIsSystemModalOpen,
}) => {
  const setCurrentSystem = useSurveySystemStore(
    state => state.setCurrentSystem
  );
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const setCurrentOrg = useSurveyOrgStore(state => state.setCurrentOrg);

  const [selectedSystem, setSelectedSystem] = useState(currentSystem?.systemId);

  useEffect(() => {
    setSelectedSystem(currentSystem?.systemId);
  }, [currentSystem]);

  const onChange = (e: RadioChangeEvent) => {
    setSelectedSystem(e.target.value);
  };

  const handleOk = () => {
    const currentSystem = systems?.find(
      system => system.systemId === selectedSystem
    );
    setCurrentSystem(currentSystem);
    setCurrentOrg(currentSystem?.orgs[0]);
    setIsSystemModalOpen(false);
  };

  const handleCancel = () => {
    setIsSystemModalOpen(false);
  };

  return (
    <Modal
      width={400}
      title="系统切换"
      open={isSystemModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确认"
      footer={
        <div>
          <Button type="primary" onClick={handleOk}>
            确认
          </Button>
        </div>
      }
    >
      <div
        style={{
          padding: '24px 40px',
        }}
      >
        <Radio.Group onChange={onChange} value={selectedSystem}>
          <Space direction="vertical">
            {systems?.map(system => (
              <Radio key={system.systemId} value={system.systemId}>
                {system.systemName}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default SystemSwitchModal;
