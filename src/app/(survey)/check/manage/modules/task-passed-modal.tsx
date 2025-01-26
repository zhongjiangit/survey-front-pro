'use client';

import Api from '@/api';
import { taskType } from '@/app/modules/task-detail';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  fullJoinRowSpanData,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { useRequest } from 'ahooks';
import type { TreeDataNode, TreeProps } from 'antd';
import { Modal, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useFillPassCountDetailsColumn } from '../../modules/hooks/useFillPassCountDetailsColumn';

const treeData: TreeDataNode[] = [
  {
    title: '四川省教育机构（12人，13份）',
    key: '0-0',
    children: [
      {
        title: '乐山市（2人， 2份）',
        key: '0-0-0',
        children: [
          {
            title: '乐山第一小学（1人， 一份）',
            key: '0-0-0-0',
          },
        ],
      },
      {
        title: '绵阳市（3人， 3份）',
        key: '0-0-1',
      },
      {
        title: '成都市（1人， 1份）',
        key: '0-0-2',
      },
    ],
  },
];

interface TaskPassedModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: taskType | undefined;
}

const TaskPassedModal = ({ open, setOpen, task }: TaskPassedModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillPassCountDetailsColumn([]);
  const [dataSource, setDataSource] = useState<any>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    run: getFillPassCountDetails,
    data: fillPassCountDetailsData,
    loading: getFillPassCountDetailsLoading,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg || !task) {
        return Promise.reject(
          'currentSystem or currentOrg or task is not defined'
        );
      }
      return Api.getFillPassCountDetails({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        setColumns(data?.data);
        const joinRowSpanKey: joinRowSpanKeyParamsType[] = [];
        for (let i = 0; i < data?.data[0]?.orgCount; i++) {
          joinRowSpanKey.push({
            coKey: `org${i + 1}`,
            compareKeys: [`org${i + 1}`],
            childKey: { [`org${i + 1}`]: 'orgId' },
          });
        }
        setDataSource(
          joinRowSpanKey.reduce(
            (prev: any[] | undefined, keyParams) => {
              return fullJoinRowSpanData(prev, keyParams);
            },
            data?.data.length ? data?.data : []
          )
        );
      },
    }
  );

  const sortColumns: ColumnType = {
    title: 'No.',
    width: 50,
    align: 'center',
    render: (_: any, __: any, index: number) => {
      return index + 1 + (pageNumber - 1) * pageSize;
    },
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  useEffect(() => {
    if (open) {
      getFillPassCountDetails();
    }
  }, [getFillPassCountDetails, open]);
  return (
    <Modal
      afterClose={() => {
        setPageNumber(1);
        setPageSize(10);
      }}
      open={open}
      title="通过量"
      okText="确定"
      cancelText="取消"
      maskClosable={false}
      onCancel={() => setOpen(false)}
      onOk={() => {
        setOpen(false);
      }}
      width={1200}
    >
      <Table
        columns={[sortColumns, ...columns]}
        dataSource={dataSource}
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          showQuickJumper: true,
          current: pageNumber,
          pageSize: pageSize,
          // showTotal: total => `总共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          },
        }}
      />
    </Modal>
  );
};

export default TaskPassedModal;
