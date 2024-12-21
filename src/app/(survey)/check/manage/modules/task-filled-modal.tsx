'use client';

import { DownOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import { Modal, Tree } from 'antd';

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
}

const TaskFilledModal = ({ open, setOpen }: TaskFilledModalProps) => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

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
