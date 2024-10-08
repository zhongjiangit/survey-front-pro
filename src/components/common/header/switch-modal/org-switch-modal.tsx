import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import type { RadioChangeEvent } from 'antd';
import { Button, Modal, Radio, Space } from 'antd';
import { FunctionComponent } from 'react';

interface OrgSwitchModalProps {
  isOrgModalOpen: boolean;
  setIsOrgModalOpen: (isOrgModalOpen: boolean) => void;
}

const OrgSwitchModal: FunctionComponent<OrgSwitchModalProps> = ({
  isOrgModalOpen,
  setIsOrgModalOpen,
}) => {
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const setCurrentOrg = useSurveyOrgStore(state => state.setCurrentOrg);

  const onChange = (e: RadioChangeEvent) => {
    setCurrentOrg(
      currentSystem?.orgs?.find(org => org.orgId === e.target.value)
    );
  };

  const handleOk = () => {
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
        <Radio.Group onChange={onChange} value={currentOrg?.orgId}>
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
