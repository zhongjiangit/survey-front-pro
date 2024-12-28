'use client';

import Api from '@/api';
import { taskType } from '@/app/modules/task-detail';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { DownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import type { TreeDataNode, TreeProps } from 'antd';
import { Modal, Tree } from 'antd';
import { useEffect } from 'react';

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

const TaskFilledModal = ({ open, setOpen, task }: TaskFilledModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

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
    >
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
      />
    </Modal>
  );
};

export default TaskFilledModal;
