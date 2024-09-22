import type { RadioChangeEvent } from 'antd';
import { Modal, Radio, Space } from 'antd';
import { FunctionComponent, useState } from 'react';

interface UnitSwitchModalProps {
  isUnitModalOpen: boolean;
  setIsUnitModalOpen: (isUnitModalOpen: boolean) => void;
}

const UnitSwitchModal: FunctionComponent<UnitSwitchModalProps> = ({
  isUnitModalOpen,
  setIsUnitModalOpen,
}) => {
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleOk = () => {
    setIsUnitModalOpen(false);
  };

  const handleCancel = () => {
    setIsUnitModalOpen(false);
  };

  return (
    <Modal
      width={400}
      title="单位切换"
      open={isUnitModalOpen}
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
            <Radio value={1}>省机构</Radio>
            <Radio value={2}>市机构</Radio>
            <Radio value={3}>区机构</Radio>
            <Radio value={4}>高校</Radio>
            <Radio value={5}>中小学</Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default UnitSwitchModal;
