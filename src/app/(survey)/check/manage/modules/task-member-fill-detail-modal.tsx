'use client';

import type { TableColumnsType, TableProps } from 'antd';
import { Button, Modal, Popover, Space, Table } from 'antd';
import React from 'react';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.ReactNode;
  org: string;
  member: string;
  status: string;
  children?: DataType[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: '单位',
    dataIndex: 'org',
    key: 'org',
    width: '20%',
    render: (_: any, record: any) => {
      return (
        <div className="cursor-pointer">
          <Popover content={record.org}>{record.org.split('/')[0]}</Popover>
        </div>
      );
    },
  },
  {
    title: '人员',
    dataIndex: 'member',
    key: 'member',
    width: '30%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '20%',
  },
  {
    title: <div>操作</div>,
    dataIndex: 'operation',
    align: 'center',
    render: (_: any, record: any) => {
      return (
        <Space className="flex justify-center items-center">
          {record.status && <a>资料详情</a>}
          {record.status === '已提交(需审核)' && <a>通过</a>}
          {record.status === '已提交(需审核)' && <a>驳回</a>}
        </Space>
      );
    },
  },
];

const data: DataType[] = [
  {
    key: 1,
    org: 'aaa市/aaaa校',
    status: '已提交(需审核)',
    member: '成（139xxxx）资料提交： 1份',
  },
  {
    key: 2,
    org: 'aaa市/aaaa校',
    status: '已通过',
    member: '成（139xxxx）资料提交： 1份',
  },
];

interface TaskFillDetailModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskMemberFillDetailModal = ({
  open,
  setOpen,
}: TaskFillDetailModalProps) => {
  return (
    <Modal
      open={open}
      title={
        <div className="flex gap-5 items-center justify-between mb-3 pr-10">
          <h2 className="text-xl">任务详情</h2>
          <Button type="primary">一键通过</Button>
        </div>
      }
      okText="确定"
      cancelText="取消"
      width={1000}
      onCancel={() => setOpen(false)}
      onOk={() => {
        setOpen(false);
      }}
      maskClosable={false}
      footer={false}
    >
      <Table<DataType> columns={columns} dataSource={data} />
    </Modal>
  );
};

export default TaskMemberFillDetailModal;
