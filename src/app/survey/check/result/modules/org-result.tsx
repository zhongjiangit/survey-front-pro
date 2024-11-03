import { Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { checkDetailProfessorData } from '../../testData';
import { joinRowSpanData } from '../utls/joinRowSpanData';

interface ProfessorDetailProps {
  buttonText: string;

  [key: string]: any;
}

const loginUserType: 'org' | 'professor' = 'org';
const OrgResult: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
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
        rowSpan: text.rowSpan?.name || 0,
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
    checkDetailProfessorData &&
      setDataSource(
        joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
          return joinRowSpanData(prev, currentKey);
        }, checkDetailProfessorData)
      );

    return () => {
      setDataSource(undefined);
    };
  }, [checkDetailProfessorData]);
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
        title={`${record.org3}`}
        open={open}
        onCancel={() => {
          setOpen;
        }}
        width={'70vw'}
      >
        <Table columns={columns} dataSource={dataSource}></Table>
      </Modal>
    </>
  );
};

export default OrgResult;
