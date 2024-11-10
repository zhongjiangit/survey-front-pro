import { Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
// import { orgResultData } from '../../testData';
import { joinRowSpanData } from '@/lib/join-rowspan-data';
import { orgResultData } from '../../../testData';

interface ProfessorDetailProps {
  buttonText: string;
  modalTitle: string;
  [key: string]: any;
}

const loginUserType: 'org' | 'professor' = 'org';
const OrgResult: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
  modalTitle,
}) => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<any>();
  const joinRowSpanKey = ['orgRate'];

  const columns: TableProps['columns'] = [
    {
      title: '单位平均分',
      dataIndex: 'orgRate',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.orgRate || 0,
      }),
      render: text => text && <a>{`${text}分`}</a>,
    },
    {
      title: '准测',
      dataIndex: 'paper',
      align: 'center',
    },
    {
      title: '小项均分',
      align: 'center',
      dataIndex: 'itemRate',
      render: text => text && <a>{`${text}分`}</a>,
    },
    {
      title: '指标',
      align: 'center',
      dataIndex: 'standard',
    },
  ];

  useEffect(() => {
    orgResultData &&
      setDataSource(
        joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
          return joinRowSpanData(prev, currentKey);
        }, orgResultData)
      );

    return () => {
      setDataSource(undefined);
    };
  }, [orgResultData]);
  return (
    <>
      <a
        onClick={() => {
          setOpen(true);
        }}
        className="text-blue-500"
      >
        {buttonText}
      </a>
      <Modal
        title={<div className="mx-5 m-2">{modalTitle}</div>}
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          bordered
          style={{ margin: '20px' }}
        ></Table>
      </Modal>
    </>
  );
};

export default OrgResult;
