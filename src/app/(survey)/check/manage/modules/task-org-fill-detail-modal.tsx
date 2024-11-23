'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useFillProcessDetailColumns } from '@/hooks/useFillProcessDetailColumns';
import { TaskProcessStatusEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import type { TableProps } from 'antd';
import { message, Modal, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
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
  taskId: number | undefined;
  refreshList: () => void;
}

const TaskOrgFillDetailModal = ({
  open,
  setOpen,
  taskId,
  refreshList,
}: TaskFillDetailModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillProcessDetailColumns([]);

  const { data, run, refresh } = useRequest(
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
      refreshDeps: [taskId],
      onSuccess: data => {
        setColumns(data.data);
      },
    }
  );

  const operationColumn: ColumnType = {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    align: 'center',
    render: (_: any, record: any) => {
      return (
        <Space className="flex justify-center items-center">
          {record.processStatus && <a className=" text-blue-500">资料详情</a>}
          {record.processStatus === TaskProcessStatusEnum.NeedSelfAudit && (
            <a
              className=" text-blue-500"
              onClick={() => {
                if (taskId === undefined) {
                  return;
                }
                Api.approveFill({
                  currentSystemId: currentSystem!.systemId,
                  currentOrgId: currentOrg!.orgId,
                  taskId: taskId,
                  staffId: record.staffId,
                }).then(() => {
                  message.info('通过成功');
                  refresh();
                  refreshList();
                });
              }}
            >
              通过
            </a>
          )}
          {record.processStatus === TaskProcessStatusEnum.Submitted && (
            <a className=" text-blue-500">驳回</a>
          )}
        </Space>
      );
    },
  };
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
      afterClose={() => {
        setColumns([]);
      }}
    >
      <Table columns={[...columns, operationColumn]} dataSource={data?.data} />
    </Modal>
  );
};

export default TaskOrgFillDetailModal;
