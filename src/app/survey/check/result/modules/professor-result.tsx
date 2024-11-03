import Circle from '@/components/display/circle';
import { Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { checkDetailProfessorData } from '../../testData';
import { joinRowSpanData } from '../utls/joinRowSpanData';

interface ProfessorDetailProps {
  buttonText: string;

  [key: string]: any;
}

const loginUserType: 'org' | 'professor' = 'org';
const ProfessorResult: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
}) => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<any>();
  const joinRowSpanKey = ['professorRate', 'paper', 'rate'];

  const columns: TableProps['columns'] = [
    {
      title: '个人平均分',
      dataIndex: 'professorRate',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '试卷序列',
      dataIndex: 'paper',
      align: 'center',

      render: (text: number) =>
        text && (
          <div className="flex justify-center">
            <a>
              <Circle value={text} />
            </a>
          </div>
        ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '试卷得分',
      dataIndex: 'rate',
      align: 'center',
      render: text => text && <a>{`${text}分`}</a>,
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '指标',
      align: 'center',
      dataIndex: 'standard',
    },
    {
      title: '小项均分',
      align: 'center',
      dataIndex: 'itemRate',
      render: text => text && <a>{`${text}分`}</a>,
    },
    {
      title: '评价',
      align: 'center',
      dataIndex: 'itemRate',
      hidden: loginUserType === 'org',
      render: text =>
        text && (
          <div>
            {text.map((item: any) => (
              <p>{item}</p>
            ))}
          </div>
        ),
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
        title={`${record.org3}-${record.name}`}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={'70vw'}
      >
        <Table columns={columns} dataSource={dataSource}></Table>
      </Modal>
    </>
  );
};

export default ProfessorResult;
