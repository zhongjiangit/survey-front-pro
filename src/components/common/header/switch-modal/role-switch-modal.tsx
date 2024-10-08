import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useRoles } from '@/hooks/useRoles';
import type { RadioChangeEvent } from 'antd';
import { Button, Modal, Radio, Space } from 'antd';
import { FunctionComponent, useMemo, useState } from 'react';

interface RoleSwitchModalProps {
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (isRoleModalOpen: boolean) => void;
}

const RoleSwitchModal: FunctionComponent<RoleSwitchModalProps> = ({
  isRoleModalOpen,
  setIsRoleModalOpen,
}) => {
  const setCurrentRole = useSurveyCurrentRoleStore(
    state => state.setCurrentRole
  );
  const roles = useSurveyCurrentRoleStore(state => state.roles);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const activeRoles = useMemo(
    () => roles?.filter(role => role.isActive),
    [roles]
  );

  const onChange = (e: RadioChangeEvent) => {
    const currentRole = roles?.find(role => role.key === e.target.value);
    if (currentRole) {
      setCurrentRole(currentRole);
    }
  };

  const handleOk = () => {
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
        <Radio.Group onChange={onChange} value={currentRole?.key}>
          <Space direction="vertical">
            {activeRoles?.map(role => (
              <Radio value={role.key}>{role.label}</Radio>
            ))}
            {/* <Radio value={1}>平台管理员</Radio>
            <Radio value={2}>系统管理员（用户）</Radio>
            <Radio value={3}>普通管理员</Radio>
            <Radio value={4}>常规用户</Radio>
            <Radio value={5}>专家</Radio> */}
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default RoleSwitchModal;
