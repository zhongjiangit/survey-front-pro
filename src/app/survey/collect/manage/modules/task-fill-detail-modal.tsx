'use client';

import { G6, IndentedTree } from '@ant-design/graphs';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tree, Modal } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

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

const TaskPassedModal = () => {
  const [open, setOpen] = useState(false);
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <>
      <a className="underline" onClick={() => setOpen(true)}>
        通过数量
      </a>
      <Modal
        open={open}
        title="通过数量"
        okText="确定"
        cancelText="取消"
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
        }}
      >
        <div className="border flex flex-col">
          <div className="border flex">
            <div className="border">成都</div>
            <div className="border">七中</div>
            <div className="border"></div>
          </div>
          <div className="border flex"></div>
        </div>
      </Modal>
    </>
  );
};

export default TaskPassedModal;
