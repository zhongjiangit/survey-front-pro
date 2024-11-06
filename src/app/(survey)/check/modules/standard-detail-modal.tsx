import { Modal } from 'antd';
import { ReactNode, useState } from 'react';

interface Props {
  showDom?: ReactNode;
}

const StandardDetailModal = ({ showDom }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        {showDom || <span>详情</span>}
      </a>

      <Modal
        title="标准详情"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>标准一</p>
        <p>标准二</p>
        <p>标准三</p>
        <p>标准四</p>
      </Modal>
    </>
  );
};

export default StandardDetailModal;
