import type { RadioChangeEvent } from 'antd';
import { Modal, Radio, Space } from 'antd';
import { FunctionComponent, useState } from 'react';

interface SystemSwitchModalProps {
  isSystemModalOpen: boolean;
  setIsSystemModalOpen: (isSystemModalOpen: boolean) => void;
}

const SystemSwitchModal: FunctionComponent<SystemSwitchModalProps> = ({
  isSystemModalOpen,
  setIsSystemModalOpen,
}) => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleOk = () => {
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
      cancelText="取消"
    >
      <div
        style={{
          padding: '24px 40px',
        }}
      >
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio value={1}>系统1</Radio>
            <Radio value={2}>系统2</Radio>
            <Radio value={3}>系统3</Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default SystemSwitchModal;
