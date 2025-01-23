'use client';

import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { Button, message, Modal, Space, Table, TableProps } from 'antd';
import { useMemo, useState } from 'react';

import Api from '@/api';
import { ApproveReviewBatchParamsType } from '@/api/task/approveReviewBatch';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import { ListReviewDetailsManagerResponse } from '@/api/task/listReviewDetailsManager';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  fullJoinRowSpanData,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { ReviewTypeEnum, TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { ColumnType } from 'antd/es/table';
import { useReviewDetailColumn } from '../hooks/useReviewDetailColumn';
import ProfessorDetail from './modules/professor-detail';

interface DataType {
  [key: string]: any;
}

interface Props {
  task: ListMyInspTaskResponse;
}

const ReviewDetailModal = (props: Props) => {
  const { task } = props;
  const [dataSource, setDataSource] = useState<any>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { columns, setColumns } = useReviewDetailColumn([]);

  const [messageApi, contextHolder] = message.useMessage();

  const {
    run: getListReviewDetailsManager,
    data: listReviewDetailsManagerData,
    loading: getListReviewDetailsManagerLoading,
    refresh,
  } = useRequest(
    () => {
      if (!open) {
        return Promise.reject('No open');
      }
      if (!currentSystem || !currentOrg) {
        return Promise.reject('currentSystem or currentOrg is not defined');
      }
      return Api.listReviewDetailsManager({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    },
    {
      refreshDeps: [pageNumber, pageSize, task, open],
      onSuccess: data => {
        const joinRowSpanKey: joinRowSpanKeyParamsType[] = [];
        const orgCount = data?.data[0]?.orgCount;
        for (let i = 0; i < orgCount; i++) {
          joinRowSpanKey.push({
            coKey: `org${i + 1}`,
            compareKeys: [`org${i + 1}`],
            childKey: { [`org${i + 1}`]: 'orgId' },
          });
        }
        joinRowSpanKey.push({
          coKey: 'fillerStaffName',
          compareKeys: ['fillerStaffName', 'fillerStaffId', `org${orgCount}`], //姓名列的合并条件是name和org的最后一级均相同
          childKey: { [`org${orgCount}`]: 'orgId' },
        });
        setColumns(data.data);

        const tableData = joinRowSpanKey?.reduce(
          (prev: any[] | undefined, keyParams) => {
            return fullJoinRowSpanData(prev, keyParams);
          },
          data?.data
        );

        if (tableData) {
          tableData.slice = () => tableData;
        }
        setDataSource(tableData);
      },
    }
  );

  const { run: approveReviewBatch } = useRequest(
    (singleFillIds?: number[]) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !task?.taskId) {
        return Promise.reject('未获取到必要数据');
      }
      const params: ApproveReviewBatchParamsType = {
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
      };
      if (singleFillIds) {
        params.singleFillIds = singleFillIds;
      }
      return Api.approveReviewBatch(params);
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.info('一键通过成功');
        refresh();
      },
      onError: error => {
        messageApi.error(error.toString());
      },
    }
  );

  const { data: taskDetail } = useRequest(
    () => {
      if (!open) {
        return Promise.reject('No open');
      }
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getInspTaskFill({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        taskId: task.taskId,
      });
    },
    {
      refreshDeps: [currentSystem, currentOrg, task, open],
    }
  );
  const { data: listVisibleLevels } = useRequest(
    () => {
      if (!open) {
        return Promise.reject('No open');
      }
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listVisibleLevels({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        orgId: currentOrg.orgId!,
      });
    },
    {
      refreshDeps: [currentSystem, currentOrg, open],
    }
  );
  const levelList = useMemo(() => {
    if (!taskDetail || !listVisibleLevels) {
      return [];
    }
    const levels = taskDetail.data.levels;
    const levelList = listVisibleLevels.data;
    return [
      levelList[0],
      ...levelList.filter(t =>
        levels?.some(f => f.levelIndex === t.levelIndex)
      ),
    ];
  }, [taskDetail, listVisibleLevels]);

  const sortColumns: ColumnType = {
    title: 'No.',
    width: 50,
    align: 'center',
    render: (_: any, __: any, index: number) => {
      return index + 1 + (pageNumber - 1) * pageSize;
    },
  };

  const allColumns = useMemo<TableProps<DataType>['columns']>(() => {
    return [
      ...columns.map((t, i) => ({
        ...t,
        title: levelList[i]?.levelName || t.title,
      })),
      {
        title: '姓名',
        dataIndex: 'fillerStaffName',
        align: 'center',
        onCell: text => ({
          rowSpan: text.rowSpan?.fillerStaffName || 0,
        }),
      },
      {
        title: (
          <>
            <div> 试卷</div>
            <div> (点击查看详情)</div>
          </>
        ),
        align: 'center',
        dataIndex: 'fillIndex',
        render: (text, record) => (
          <div className="flex justify-center">
            <TemplateDetailModal
              templateId={task.templateId}
              taskId={task.taskId}
              singleFillId={record.singleFillId}
              TemplateType={TemplateTypeEnum.Check}
              title="试卷详情"
              showDom={<Circle value={text} />}
            />
          </div>
        ),
      },
      {
        title: '评审完成度',
        align: 'center',
        dataIndex: 'reviewCompleteRate',
        render: text => text != null && <span>{`${text}%`}</span>,
      },
      {
        title: '已通过专家',
        align: 'center',
        dataIndex: 'passedExpertCount',
        render: (text, record) =>
          !!text && (
            <ProfessorDetail
              buttonText={`${text}人`}
              record={record}
              task={task}
              refresh={refresh}
              type={ReviewTypeEnum.Passed}
            ></ProfessorDetail>
          ),
      },
      {
        title: '待审核专家',
        align: 'center',
        dataIndex: 'needReviewExportCount',
        render: (text, record) =>
          !!text && (
            <ProfessorDetail
              buttonText={`${text}人`}
              record={record}
              task={task}
              refresh={refresh}
              type={ReviewTypeEnum.WaitAudit}
            ></ProfessorDetail>
          ),
      },
      {
        title: '待提交专家',
        align: 'center',
        dataIndex: 'needSubmitExportCount',
        render: (text, record) =>
          !!text && (
            <ProfessorDetail
              buttonText={`${text}人`}
              record={record}
              task={task}
              type={ReviewTypeEnum.WaitSubmit}
            ></ProfessorDetail>
          ),
      },
      {
        title: '已驳回专家',
        align: 'center',
        dataIndex: 'rejectedExportCount',
        render: (text, record) =>
          !!text && (
            <ProfessorDetail
              buttonText={`${text}人`}
              record={record}
              task={task}
              type={ReviewTypeEnum.Reject}
            ></ProfessorDetail>
          ),
      },
    ];
  }, [columns, levelList, refresh, task]);
  return (
    <>
      {contextHolder}
      <a
        className="text-blue-500 block max-w-8"
        onClick={() => {
          setOpen(true);
        }}
      >
        评审详情
      </a>
      <Modal
        title="评审详情"
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        afterClose={() => {
          setPageNumber(1);
          setPageSize(10);
        }}
        width={1400}
        loading={getListReviewDetailsManagerLoading}
        footer={null}
      >
        <div className="flex justify-end mb-2">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                approveReviewBatch(
                  dataSource.map(
                    (item: ListReviewDetailsManagerResponse) =>
                      item.singleFillId
                  )
                );
              }}
            >
              一键通过本页待审核专家
            </Button>
            <Button
              type="primary"
              onClick={() => {
                approveReviewBatch();
              }}
            >
              一键通过所有待审核专家
            </Button>
          </Space>
        </div>
        <Table<DataType>
          columns={[sortColumns, ...(allColumns || [])]}
          dataSource={dataSource}
          pagination={{
            total: listReviewDetailsManagerData?.total || 0,
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
    </>
  );
};

export default ReviewDetailModal;
