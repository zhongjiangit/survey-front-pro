import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import type { RadioChangeEvent } from 'antd';
import { Button, Modal, Radio, Space } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

interface OrgSwitchModalProps {
  isOrgModalOpen: boolean;
  setIsOrgModalOpen: (isOrgModalOpen: boolean) => void;
}

const OrgSwitchModal: FunctionComponent<OrgSwitchModalProps> = ({
  isOrgModalOpen,
  setIsOrgModalOpen,
}) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const [currentOrg, setCurrentOrg] = useSurveyOrgStore(state => [
    state.currentOrg,
    state.setCurrentOrg,
  ]);
  const [selectedOrg, setSelectedOrg] = useState(currentOrg?.orgId);

  useEffect(() => {
    if (isOrgModalOpen) {
      setSelectedOrg(currentOrg?.orgId);
    }
  }, [isOrgModalOpen]);

  const onChange = (e: RadioChangeEvent) => {
    setSelectedOrg(e.target.value);
  };

  const handleOk = () => {
    setCurrentOrg(currentSystem?.orgs?.find(org => org.orgId === selectedOrg));
    setIsOrgModalOpen(false);
  };

  const handleCancel = () => {
    setIsOrgModalOpen(false);
  };

  return (
    <Modal
      width={400}
      title="单位切换"
      open={isOrgModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
      maskClosable={false}
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
        <Radio.Group onChange={onChange} value={selectedOrg}>
          <Space direction="vertical">
            {currentSystem?.orgs?.map(org => (
              <Radio key={org.orgId} value={org.orgId}>
                {org.orgName}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default OrgSwitchModal;
