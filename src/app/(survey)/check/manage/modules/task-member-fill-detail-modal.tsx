'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import type { TableColumnsType, TableProps } from 'antd';
import { message, Modal, Popover, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';

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
  taskId: number | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TaskMemberFillDetailModal = ({
  taskId,
  open,
  setOpen,
}: TaskFillDetailModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const [dataSource, setDataSource] = useState<any>();

  const {
    run: getFillProcessDetails,
    data: fillProcessDetailsList,
    refresh,
  } = useRequest(
    () => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到组织机构');
      } else if (!taskId) {
        return Promise.reject('未获取到任务信息');
      }
      return Api.getFillProcessDetails({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        pageNumber: 1,
        pageSize: 10,
        taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        console.log('data', data);

        // setColumns(data.data);
        // const combineKeys = Object.keys(data.data[0].levels).map(
        //   (_key, index) => `org${index + 1}`
        // );
        // const tableData = (combineKeys || []).reduce(
        //   (prev: any[] | undefined, currentKey: string) => {
        //     return joinRowSpanDataChild(prev, currentKey, 'orgId');
        //   },
        //   data?.data
        // );
        // setDataSource(tableData);
      },
    }
  );

  useEffect(() => {
    if (open) {
      getFillProcessDetails();
    }
  }, [getFillProcessDetails, open]);

  return (
    <Modal
      open={open}
      title={
        <div className="flex gap-5 items-center justify-between mb-3 pr-10">
          <h2 className="text-xl">任务详情 2</h2>
        </div>
      }
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
