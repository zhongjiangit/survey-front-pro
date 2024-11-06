'use client';

import React, { useState } from 'react';
import { Modal, Table, Button, Divider, Input, InputNumber, Space } from 'antd';
import type { TreeDataNode } from 'antd';
import { testDataSource } from '../../testData';
import { ReviewStatusObject } from '@/interfaces/CommonType';
import TemplateDetailModal from '@/components/common/template-detail-modal';
import StandardDetailModal from '../../modules/standard-detail-modal';
import { ExclamationCircleOutlined } from '@ant-design/icons';

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

  const columns: any = [
    {
      title: '单位',
      dataIndex: 'orgName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.orgName : '-'}</div>;
      },
    },
    {
      title: <div>姓名</div>,
      dataIndex: 'name',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.name : '-'}</div>;
      },
    },
    {
      title: <div>试卷编号</div>,
      dataIndex: 'num',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.num : '-'}</div>;
      },
    },
    {
      title: <div>试卷</div>,
      dataIndex: 'testPaper',
      align: 'center',
      render: (_: any, record: any) => {
        return <TemplateDetailModal showDom={'详情'} />;
      },
    },
    {
      title: <div>状态</div>,
      dataIndex: 'reviewStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
              ReviewStatusObject[record.reviewStatus]
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
      title: (
        <div className="flex gap-1 items-center justify-center">
          <span>评价维度</span>
          <StandardDetailModal
            showDom={<ExclamationCircleOutlined className="cursor-pointer" />}
          />
        </div>
      ),
      dataIndex: 'dimension',
      width: '18%',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <div>
            {text.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <span>{item}</span>
                  {index + 1 !== text.length && <Divider className="my-4" />}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: <div>维度评分</div>,
      dataIndex: 'dimensionScore',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return (
          <div>
            {text.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <InputNumber min={0} max={5} defaultValue={item} />
                  {index + 1 !== text.length && <Divider className="my-4" />}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: <div>专家点评</div>,
      dataIndex: 'comment',
      align: 'center',
      render: (text: string) => {
        return (
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            defaultValue={text}
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
        return (
          <>
            {record.reviewStatus === 0 && (
              <Space>
                <a className="text-blue-500">保存</a>
                <a className="text-blue-500">提交</a>
              </Space>
            )}
            {record.reviewStatus === 1 && (
              <Space>
                <a className="text-blue-500">保存</a>
                <a className="text-blue-500">提交</a>
              </Space>
            )}
            {record.reviewStatus === 2 && '-'}
            {record.reviewStatus === 3 && '-'}
            {record.reviewStatus === 4 && (
              <Space>
                <a className="text-blue-500">保存</a>
                <a className="text-blue-500">提交</a>
                <a className="text-blue-500">驳回履历</a>
              </Space>
            )}
          </>
        );
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
          <div className="flex justify-end gap-5 px-20">
            <Button size="large" onClick={() => {}}>
              保存本页
            </Button>
            <Button size="large" type="primary" onClick={() => {}}>
              提交本页
            </Button>
          </div>
        }
      >
        <Table columns={columns} dataSource={testDataSource} />
      </Modal>
    </>
  );
};

export default TaskReviewDetailModal;
