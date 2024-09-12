import type { RadioChangeEvent } from 'antd';
import { Modal, Radio, Space } from 'antd';
import { FunctionComponent, useState } from 'react';

interface RoleSwitchModalProps {
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (isRoleModalOpen: boolean) => void;
}

const RoleSwitchModal: FunctionComponent<RoleSwitchModalProps> = ({
  isRoleModalOpen,
  setIsRoleModalOpen,
}) => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
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
    >
      <div
        style={{
          padding: '24px 40px',
        }}
      >
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio value={1}>平台管理员</Radio>
            <Radio value={2}>系统管理员（用户）</Radio>
            <Radio value={3}>普通管理员</Radio>
            <Radio value={4}>常规用户</Radio>
            <Radio value={5}>专家</Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default RoleSwitchModal;
