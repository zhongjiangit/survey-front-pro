'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useFillProcessDetailColumns } from '@/hooks/useFillProcessDetailColumns';
import { useRequest } from 'ahooks';
import type { TableProps } from 'antd';
import { Modal, Table } from 'antd';
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

// const data: DataType[] = [
//   {
//     key: 1,
//     city: '第一个市',
//     school: '',
//     member: '',
//     status: '',
//     children: [
//       {
//         key: 11,
//         city: '',
//         school: '第一个校',
//         status: '已提交(需审核)',
//         member: '成（139xxxx）资料提交： 1份',
//       },
//       {
//         key: 12,
//         city: '',
//         school: '第二个校',
//         status: '已通过',
//         member: '成（139xxxx）资料提交： 1份',
//       },
//     ],
//   },
// ];

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
}

const TaskOrgFillDetailModal = ({
  open,
  setOpen,
  taskId,
}: TaskFillDetailModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillProcessDetailColumns(undefined);

  const { data, run: getFillDetails } = useRequest(
    () => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到组织机构');
      } else if (!taskId) {
        return Promise.reject('未获取到任务信息');
      }
      return Api.getFillProcessDetails({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        pageNumber: 10,
        pageSize: 1,
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
      <Table columns={columns} dataSource={data?.data} />
    </Modal>
  );
};

export default TaskOrgFillDetailModal;
