import { Modal, Table } from 'antd';
import { ReactNode, useMemo, useState } from 'react';
import { DimensionsType } from '@/api/template/create-details';

interface Props {
  showDom?: ReactNode;
  dimensions?: DimensionsType[];
}

const StandardDetailModal = ({ showDom, dimensions }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const columns: any[] = useMemo(
    () => [
      {
        title: '序号',
        width: '15%',
        render: (text, record, index) => `${index + 1}`,
        editable: false,
      },
      {
        title: '指标',
        dataIndex: 'dimensionName',
        width: '20%',
      },
      {
        title: '最高分值',
        dataIndex: 'score',
        width: '20%',
      },
      {
        title: '准则',
        dataIndex: 'guideline',
        width: '30%',
      },
    ],
    []
  );

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
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table columns={columns} dataSource={dimensions} pagination={false} />
      </Modal>
    </>
  );
};

export default StandardDetailModal;
