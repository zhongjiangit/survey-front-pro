'use client';

import api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { TaskStatusObject, TaskStatusTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import StandardDetailModal from '../modules/standard-detail-modal';
import { collectDataSource } from '../testData';
import TaskReviewDetailModal from './modules/task-review-detail-modal';

const CheckReview = () => {
  const [total, setTotal] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const operateButton = {
    detail: () => {
      return <TaskReviewDetailModal key="detail" />;
    },
  };
  const { data: reviewResponse } = useRequest(
    () => {
      return api.listReviewTaskExpert({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        pageNumber,
        pageSize,
      });
    },
    {
      refreshDeps: [
        currentSystem?.systemId,
        currentOrg?.orgId,
        pageNumber,
        pageSize,
      ],
    }
  );

  // 给columns添加ts类型
  const columns: ColumnsType = [
    {
      title: (
        <div>
          <div>发布单位</div>
          <div>发布人</div>
        </div>
      ),
      dataIndex: 'orgAndUser',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.createOrgName}</div>
            <div>{record.staffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>任务名称</div>,
      dataIndex: 'taskName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.taskName}</div>;
      },
    },
    {
      title: <div>评价标准及准则</div>,
      dataIndex: 'standard',
      align: 'center',
      render: (_: any, record: any) => {
        return <StandardDetailModal />;
      },
    },
    {
      title: <div>任务状态</div>,
      dataIndex: 'reviewTaskStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
              TaskStatusObject[record.reviewTaskStatus]
            }
          </div>
        );
      },
    },
    {
      title: <div>任务预定期限</div>,
      dataIndex: 'key5',
      width: '18%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.beginTimeReviewEstimate?.slice?.(0, 10)}</div>
            <div>~</div>
            <div>{record.endTimeReviewEstimate?.slice?.(0, 10)}</div>
          </div>
        );
      },
    },
    {
      title: <div>通过</div>,
      dataIndex: 'endTimeFillActual',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <div>
            <div>{record.reviewPassRate}%</div>
            <div>{record.reviewPassCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>驳回</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.reviewRejectRate}%</div>
            <div>{record.reviewRejectCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>提交</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.reviewSubmitRate}%</div>
            <div>{record.reviewSubmitCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>填报</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.reviewRate}%</div>
            <div>{record.reviewCount}份</div>
          </div>
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
          <div>
            {record.reviewTaskStatus === TaskStatusTypeEnum.Processing
              ? operateButton.detail()
              : '-'}
          </div>
        );
      },
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <Table columns={columns} dataSource={collectDataSource} />
    </div>
  );
};

export default CheckReview;