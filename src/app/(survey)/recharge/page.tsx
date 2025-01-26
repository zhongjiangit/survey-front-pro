'use client';

import { Button, Table, TableProps } from 'antd';
import React, { useMemo } from 'react';

interface DataType {
  id: string;
  systemName: string;
  createTime: string;
  leftTimes: string;
  totalTimes: string;
}

const Recharge: React.FC = () => {
  const data: DataType[] = useMemo(
    () => [
      {
        id: '1',
        systemName: '系统1',
        createTime: '2021-09-10',
        leftTimes: '10',
        totalTimes: '20',
      },
      {
        id: '2',
        systemName: '系统2',
        createTime: '2021-09-11',
        leftTimes: '15',
        totalTimes: '30',
      },
    ],
    []
  );
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '系统名称',
      dataIndex: 'systemName',
      key: 'systemName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '剩余次数/总次数',
      key: 'leftTimes/totalTimes',
      render: record => (
        <span>
          <span>{record.leftTimes}</span>
          <span>/</span>
          <span>{record.totalTimes}</span>
        </span>
      ),
    },
    {
      title: '消耗记录',
      key: 'useRecord',
      render: () => <a className="text-blue-400">详情</a>,
    },
    {
      title: '充值记录',
      key: 'rechargeRecord',
      render: () => <a className="text-blue-400">详情</a>,
    },
  ];
  return (
    <div className="flex flex-col gap-5 pt-3">
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          total: data.length,
          showSizeChanger: true,
          showQuickJumper: true,
          // current: pageNumber,
          // pageSize: pageSize,
          // showTotal: total => `总共 ${total} 条`,
          // onChange: (page, pageSize) => {
          //   setPageNumber(page);
          //   setPageSize(pageSize);
          // },
        }}
      />
      <div className="flex justify-center items-center">
        <Button size="large" className="text-lg">
          充值/续费
        </Button>
      </div>
    </div>
  );
};
export default Recharge;
