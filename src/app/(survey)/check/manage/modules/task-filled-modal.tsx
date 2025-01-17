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
import type { TreeProps } from 'antd';
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useFillCountDetailsColumn } from '../../modules/hooks/useFillCountDetailsColumn';

interface TaskFilledModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: taskType | undefined;
}

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
      <Table
        columns={[...columns]}
        dataSource={dataSource}
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
