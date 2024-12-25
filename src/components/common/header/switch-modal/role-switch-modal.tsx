import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useRoles } from '@/hooks/useRoles';
import type { RadioChangeEvent } from 'antd';
import { Button, Modal, Radio, Space } from 'antd';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

interface RoleSwitchModalProps {
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (isRoleModalOpen: boolean) => void;
}

const RoleSwitchModal: FunctionComponent<RoleSwitchModalProps> = ({
  isRoleModalOpen,
  setIsRoleModalOpen,
}) => {
  const [currentRole, setCurrentRole] = useSurveyCurrentRoleStore(state => [
    state.currentRole,
    state.setCurrentRole,
  ]);
  const roles = useRoles();

  const [selectedRole, setSelectedRole] = useState(currentRole?.key);

  const activeRoles = useMemo(
    () => roles?.filter(role => role.isActive),
    [roles]
  );

  useEffect(() => {
    if (isRoleModalOpen) {
      setSelectedRole(currentRole?.key);
    }
  }, [isRoleModalOpen]);

  const onChange = (e: RadioChangeEvent) => {
    setSelectedRole(e.target.value);
  };

  const handleOk = () => {
    const currentRole = roles?.find(role => role.key === selectedRole);
    if (currentRole) {
      setCurrentRole(currentRole);
    }
    setIsRoleModalOpen(false);
  };

  const handleCancel = () => {
    setIsRoleModalOpen(false);
  };

  return (
    <Modal
      width={400}
      title="角色切换"
      open={isRoleModalOpen}
      onOk={handleOk}
      destroyOnClose
      maskClosable={false}
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
        <Radio.Group onChange={onChange} value={selectedRole}>
          <Space direction="vertical">
            {activeRoles?.map((role, index) => (
              <Radio key={index} value={role.key}>
                {role.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default RoleSwitchModal;
