'use client';

import { G6, IndentedTree } from '@ant-design/graphs';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Tree, Modal, Table, Button, Divider, Input, InputNumber } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { collectDataSource } from '../../testData';
import { TaskStatusObject } from '@/interfaces/CommonType';

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

interface TaskReviewDetailModalProps {}

const TaskReviewDetailModal = ({}: TaskReviewDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const columns: any = [
    {
      title: '单位',
      dataIndex: 'orgName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.orgName}</div>;
      },
    },
    {
      title: <div>姓名</div>,
      dataIndex: 'task',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.name}</div>;
      },
    },
    {
      title: <div>试卷编号</div>,
      dataIndex: 'num',
      align: 'center',
    },
    {
      title: <div>试卷</div>,
      dataIndex: 'testPaper',
      align: 'center',
    },
    {
      title: <div>状态</div>,
      dataIndex: 'taskStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
              TaskStatusObject[record.taskStatus]
            }
          </div>
        );
      },
    },
    {
      title: <div>评分（满分：50）</div>,
      dataIndex: 'score',
      align: 'center',
    },
    {
      title: <div>评价维度</div>,
      dataIndex: 'key5',
      width: '18%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>评价维度一</div>
            <Divider className="my-4" />
            <div>评价维度二</div>
          </div>
        );
      },
    },
    {
      title: <div>维度评分</div>,
      dataIndex: 'endTimeFillActual',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return (
          <div>
            <InputNumber min={0} max={5} defaultValue={1} />
            <Divider className="my-4" />
            <InputNumber min={0} max={5} defaultValue={1} />
          </div>
        );
      },
    },
    {
      title: <div>专家点评</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
          ></Input.TextArea>
        );
      },
    },

    {
      title: <div>操作</div>,
      width: '10%',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>买买买</div>;
      },
    },
  ];

  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        评审详情
      </a>
      <Modal
        open={open}
        title="专家评审"
        width={1400}
        onCancel={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-5">
            <Button size="large" onClick={() => {}}>
              保存本页
            </Button>
            <Button size="large" type="primary" onClick={() => {}}>
              提交本页
            </Button>
          </div>
        }
      >
        <Table columns={columns} dataSource={collectDataSource} />
      </Modal>
    </>
  );
};

export default TaskReviewDetailModal;
