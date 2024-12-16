'use client';

import Api from '@/api';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  DetailShowTypeEnum,
  ProcessStatusObject,
  ProcessStatusTypeEnum,
  TemplateTypeEnum,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Modal, Space, Table } from 'antd';
import { useState } from 'react';
import RejectTimeline from '../../../modules/reject-timeline';
import TaskDetail from '../../../modules/task-detail';

const ToAllotTask = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { runAsync: submitFill } = useRequest(
    (taskId: number) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.fillerSubmit({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        taskId: taskId,
      });
    },
    {
      manual: true,
    }
  );

  const operateButton = {
    fill: (record: any) => (
      <TaskDetail
        task={record}
        customTitle="填报任务"
        showType={DetailShowTypeEnum.Fill}
        key="fill"
      />
    ),
    reject: (record: any) => (
      <RejectTimeline taskId={record.taskId} key="reject" />
    ),
    submit: (record: any) => (
      <a
        onClick={() => {
          modal.confirm({
            title: '确认',
            icon: <ExclamationCircleFilled />,
            content: <>确定提交？</>,
            onOk() {
              submitFill(record.taskId).then(() => {
                refreshFillInspTaskData();
              });
            },
          });
        }}
        className=" text-blue-500"
      >
        提交
      </a>
    ),
  };

  const { data: fillInspTaskData, refreshAsync: refreshFillInspTaskData } =
    useRequest(
      () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        return Api.listFillInspTask({
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
  const columns: any = [
    {
      title: (
        <div>
          <div>发布单位</div>
          <div>发布人</div>
        </div>
      ),
      align: 'center',
      dataIndex: 'orgAndUser',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.createOrgName}</div>
            <div>{record.createStaffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>任务名称</div>,
      dataIndex: 'taskName',
      align: 'center',
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: (
        <div>
          <div>模板</div>
          <div>每人填报数</div>
        </div>
      ),
      dataIndex: 'maxFillCount',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
              <TemplateDetailModal
                templateId={record.templateId}
                TemplateType={TemplateTypeEnum.Check}
              />
            </div>
            {record.maxFillCount !== 0 ? (
              <div>{record.maxFillCount}份以内</div>
            ) : (
              '不限数量'
            )}
          </div>
        );
      },
    },
    {
      title: <div>任务预定期限</div>,
      dataIndex: 'key5',
      width: '20%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.beginTimeFillEstimate.slice(0, -3)}</div>
            <div>~</div>
            <div>{record.endTimeFillEstimate.slice(0, -3)}</div>
          </div>
        );
      },
    },
    {
      title: <div>提交状态</div>,
      dataIndex: 'processStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-expect-error：这里的record是any类型，所以会报错
              ProcessStatusObject[record.processStatus]
            }
          </div>
        );
      },
    },
    {
      title: <div>操作</div>,
      width: '12%',
      dataIndex: 'operation',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space className="fle justify-center items-center">
            {record.processStatus === ProcessStatusTypeEnum.NotSubmit && [
              operateButton.fill(record),
              operateButton.submit(record),
            ]}
            {record.processStatus === ProcessStatusTypeEnum.Reject && [
              operateButton.fill(record),
              operateButton.submit(record),
            ]}
            {record.rejectedOnce === ZeroOrOneTypeEnum.One &&
              operateButton.reject(record)}
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={fillInspTaskData?.data || []}
        // dataSource={toAllotTaskData}
      ></Table>
      {contextHolder}
    </>
  );
};

export default ToAllotTask;
