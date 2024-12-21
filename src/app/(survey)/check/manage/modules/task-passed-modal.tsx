'use client';

import { DownOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import { Modal, Tree } from 'antd';

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
}

const TaskPassedModal = ({ open, setOpen }: TaskPassedModalProps) => {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Modal
      open={open}
      title="通过量"
      okText="确定"
      cancelText="取消"
      maskClosable={false}
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

export default TaskPassedModal;
