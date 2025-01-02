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
import { useEffect, useState } from 'react';
import { useFillCountDetailsColumn } from '../../modules/hooks/useFillCountDetailsColumn';

const treeData: TreeDataNode[] = [
  {
    title: '四川省教育机构',
    key: '0-0',
    children: [
      {
        title: '乐山市',
        key: '0-0-0',
        children: [
          {
            title: '乐山第一小学（1人， 一份）',
            key: '0-0-0-0',
          },
        ],
      },
      {
        title: '绵阳市',
        key: '0-0-1',
      },
      {
        title: '成都市',
        key: '0-0-2',
      },
    ],
  },
];

interface TaskFilledModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: taskType | undefined;
}
const joinRowSpanKey: joinRowSpanKeyParamsType[] = [
  { coKey: 'org1', compareKeys: ['org1'], childKey: { org1: 'orgId' } },
  { coKey: 'org2', compareKeys: ['org2'], childKey: { org2: 'orgId' } },
  { coKey: 'org3', compareKeys: ['org3'], childKey: { org3: 'orgId' } },
];
const TaskFilledModal = ({ open, setOpen, task }: TaskFilledModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillCountDetailsColumn([]);
  const [dataSource, setDataSource] = useState<any>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const {
    run: getFillCountDetails,
    data: fillCountDetailsData,
    loading: getFillCountDetailsLoading,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg || !task) {
        return Promise.reject(
          'currentSystem or currentOrg or task is not defined'
        );
      }
      return Api.getFillCountDetails({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        setColumns(data?.data);
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

  useEffect(() => {
    if (open) {
      getFillCountDetails();
    }
  }, [getFillCountDetails, open]);

  return (
    <Modal
      open={open}
      title="填报量"
      maskClosable={false}
      okText="确定"
      cancelText="取消"
      onCancel={() => setOpen(false)}
      onOk={() => {
        setOpen(false);
      }}
      width={1200}
    >
      {/* <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      /> */}
      <Table
        columns={[...columns]}
        dataSource={dataSource}
        bordered
        pagination={{
          total: dataSource?.length,
          showSizeChanger: true,
          showQuickJumper: true,
          current: pageNumber,
          pageSize: pageSize,
          showTotal: total => `总共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          },
        }}
      />
    </Modal>
  );
};

export default TaskFilledModal;
