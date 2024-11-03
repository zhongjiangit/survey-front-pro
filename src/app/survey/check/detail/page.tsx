'use client';

import Circle from '@/components/display/circle';
import { Button, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { checkDetailData } from '../testData';
import ProfessorDetail from './modules/professor-detail';
import { joinRowSpanData } from './utls/joinRowSpanData';

interface CheckDetailProps {}
interface DataType {
  [key: string]: any;
}
const joinRowSpanKey = ['org1', 'org2', 'org3', 'name'];
const CheckDetail = () => {
  const [dataSource, setDataSource] = useState<any>();
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '第一层级单位',
      dataIndex: 'org1',
      align: 'center',
      onCell: text => {
        return {
          rowSpan: text.rowSpan?.org1 || 0,
        };
      },
    },
    {
      title: '第二层级单位',
      dataIndex: 'org2',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org2 || 0,
      }),
    },
    {
      title: '第三层级单位',
      dataIndex: 'org3',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org3 || 0,
      }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <ProfessorDetail
            buttonText={record.phone}
            record={record}
          ></ProfessorDetail>
        </>
      ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: (
        <>
          <div> 试卷</div>
          <div> (点击查看详情)</div>
        </>
      ),
      align: 'center',
      dataIndex: 'detail',
      render: text => (
        <div className="flex justify-center">
          <a>
            <Circle value={text} />
          </a>
        </div>
      ),
    },
    {
      title: '评审完成度',
      align: 'center',
      dataIndex: 'finishRate',
      render: text => text && <a>{`${text}%`}</a>,
    },
    {
      title: '已通过专家',
      align: 'center',
      dataIndex: 'finishPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '待审核专家',
      align: 'center',
      dataIndex: 'checkingPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '待提交专家',
      align: 'center',
      dataIndex: 'toSubmitPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '已驳回专家',
      align: 'center',
      dataIndex: 'rejectedPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
  ];

  useEffect(() => {
    setDataSource(
      joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
        return joinRowSpanData(prev, currentKey);
      }, checkDetailData)
    );

    return () => {
      setDataSource(undefined);
    };
  }, [checkDetailData]);
  console.log(dataSource, 'dataSource');

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Space>
          <Button type="primary">一键通过本页待审核专家</Button>
          <Button type="primary">一键通过所有待审核专家</Button>
        </Space>
      </div>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        bordered
        // table空值时显示 -
        locale={{
          emptyText: '-',
        }}
        // pagination={false}
      />
    </div>
  );
};

export default CheckDetail;
