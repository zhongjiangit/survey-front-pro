'use client';
import { Button, message, Progress, Space, Table, TableProps } from 'antd';
import React, { ReactNode, useMemo, useState } from 'react';
import DetailModal from './modules/detail-modal';
import NewTaskModal from './modules/new-task-modal';

interface DataType {
  key: string;
  name: string;
  progress: ReactNode;
  status: string;
  startTime: string;
  endTime: string;
  score: string;
}

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const data: DataType[] = useMemo(
    () => [
      {
        key: '1',
        name: '名称1',
        progress: <Progress percent={50} status="active" />,
        status: '未提交',
        startTime: '2024-07-11 22:56',
        endTime: '2024-07-18 22:56',
        score: '100',
      },
      {
        key: '2',
        name: '名称2',
        progress: <Progress percent={50} status="active" />,
        status: '未提交',
        startTime: '2024-07-11 22:56',
        endTime: '2024-07-18 22:56',
        score: '100',
      },
      {
        key: '3',
        name: '名称3',
        progress: <Progress percent={50} status="active" />,
        status: '未提交',
        startTime: '2024-07-11 22:56',
        endTime: '2024-07-18 22:56',
        score: '100',
      },
    ],
    []
  );

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'NO',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '阶段名称',
      dataIndex: 'name',
      key: 'name',
      render: () => (
        <div>
          <div>(一)材料上报与自评</div>
          <div>(二)专家评估与审核</div>
        </div>
      ),
    },
    {
      title: '总进度',
      dataIndex: 'progress',
      key: 'progress',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '开始时间',
      key: 'startTime',
      dataIndex: 'startTime',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '预定结束时间',
      key: 'endTime',
      dataIndex: 'endTime',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '实际结束时间',
      key: 'actualTime',
      dataIndex: 'actualTime',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '填写评分进度',
      key: 'score',
      dataIndex: 'score',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '审核进度',
      key: 'check',
      dataIndex: 'check',
      render: text => (
        <div>
          <div>{text}</div>
          <div>-</div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsModalOpen(true);
              setModalTitle('填写详情');
            }}
          >
            填写详情
          </a>
          <a
            onClick={() => {
              setIsModalOpen(true);
              setModalTitle('填写修改履历');
            }}
          >
            填写修改履历
          </a>
          <a
            onClick={() => {
              setIsModalOpen(true);
              setModalTitle('人员');
            }}
          >
            人员
          </a>
          <a
            onClick={() => {
              messageApi.open({
                type: 'success',
                content: '提交成功',
              });
            }}
          >
            提交
          </a>
          <a
            onClick={() => {
              messageApi.open({
                type: 'success',
                content: '提醒成功',
              });
            }}
          >
            提醒
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Button type="primary" onClick={() => setNewTaskModalOpen(true)}>
        新增任务
      </Button>
      <Table columns={columns} dataSource={data} />
      <DetailModal
        modalTitle={modalTitle}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <NewTaskModal
        newTaskModalOpen={newTaskModalOpen}
        setNewTaskModalOpen={setNewTaskModalOpen}
      />
    </div>
  );
};

export default Page;
