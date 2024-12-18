import Circle from '@/components/display/circle';
import { joinRowSpanData } from '@/lib/join-rowspan-data';
import { Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { professorResultData } from '../../../testData';

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
        rowSpan: text.rowSpan?.professorRate || 0,
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
        rowSpan: text.rowSpan?.paper || 0,
      }),
    },
    {
      title: '试卷得分',
      dataIndex: 'rate',
      align: 'center',
      render: text => text && <a>{`${text}分`}</a>,
      onCell: text => ({
        rowSpan: text.rowSpan?.rate || 0,
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
            {text.map((item: any, index: number) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        ),
    },
  ];

  useEffect(() => {
    if (professorResultData) {
      setDataSource(
        joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
          return joinRowSpanData(prev, currentKey);
        }, professorResultData)
      );
    }

    return () => {
      setDataSource(undefined);
    };
  }, [professorResultData]);
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
        title={
          <div className="mx-5 m-2">
            {record.org1}-{record.org2}-{record.org3}-{record.name}
          </div>
        }
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        footer={null}
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

export default ProfessorResult;
