'use client';

import type { TableColumnsType, TableProps } from 'antd';
import { Modal, Space, Table } from 'antd';
import React from 'react';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.ReactNode;
  city: string;
  school: string;
  member: string;
  status: string;
  children?: DataType[];
}

const columns: TableColumnsType<DataType> = [
  {
    title: '市',
    dataIndex: 'city',
    key: 'city',
    width: '15%',
  },
  {
    title: '校',
    dataIndex: 'school',
    key: 'school',
    width: '20%',
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
    width: '15%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
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
    city: '第一个市',
    school: '',
    member: '',
    status: '',
    children: [
      {
        key: 11,
        city: '',
        school: '第一个校',
        status: '已提交(需审核)',
        member: '成（139xxxx）资料提交： 1份',
      },
      {
        key: 12,
        city: '',
        school: '第二个校',
        status: '已通过',
        member: '成（139xxxx）资料提交： 1份',
      },
    ],
  },
];

// rowSelection objects indicates the need for row selection
const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};

interface TaskFillDetailModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskOrgFillDetailModal = ({
  open,
  setOpen,
}: TaskFillDetailModalProps) => {
  return (
    <Modal
      open={open}
      title={
        <div className="flex gap-5 items-center justify-between mb-3 pr-10">
          <h2 className="text-xl">任务详情</h2>
          {/* <Button type="primary">一键通过</Button> */}
        </div>
      }
      okText="确定"
      cancelText="取消"
      width={1200}
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

export default TaskOrgFillDetailModal;
