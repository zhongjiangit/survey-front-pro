'use client';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  fullJoinRowSpanData,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Divider, Modal, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { useReviewResultColumns } from '../hooks/useReviewResultColumns';
import ProfessorResult from './modules/professor-result';

interface DataType {
  [key: string]: any;
}

interface Props {
  task: ListMyInspTaskResponse;
}

const ReviewResultModal = (props: Props) => {
  const { task } = props;
  const [dataSource, setDataSource] = useState<any>();
  const [open, setOpen] = useState(false);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useReviewResultColumns([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    run: getReviewResult,
    loading: getReviewResultLoading,
    data: reviewResultData,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('currentSystem or currentOrg is not defined');
      }
      return Api.showReviewResult({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        const joinRowSpanKey: joinRowSpanKeyParamsType[] = [];
        for (let i = 0; i < data?.data[0]?.orgCount; i++) {
          joinRowSpanKey.push({
            coKey: `org${i + 1}`,
            compareKeys: [`org${i + 1}`],
            childKey: { [`org${i + 1}`]: 'orgId' },
          });
        }
        joinRowSpanKey.push({
          coKey: 'fillerStaffName',
          compareKeys: ['fillerStaffName', 'fillerCellphone'],
        });
        setColumns(
          data?.data?.map(item => ({
            ...item,
            task: task,
          }))
        );
        setDataSource(
          joinRowSpanKey?.reduce((prev: any[] | undefined, keyParams) => {
            return fullJoinRowSpanData(prev, keyParams);
          }, data?.data)
        );
      },
    }
  );

  const baseColumns: TableProps<DataType>['columns'] = [
    {
      title: '姓名',
      dataIndex: 'fillerStaffName',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div className="text-slate-500">{record.fillerCellphone}</div>
        </>
      ),
      onCell: text => ({
        rowSpan: text.rowSpan?.fillerStaffName || 0,
      }),
    },
    {
      title: (
        <>
          <div> 个人平均分</div>
          <div> (点击查看详情)</div>
        </>
      ),
      align: 'center',
      dataIndex: 'fillerAverageScore',
      render: (text, record) => (
        <ProfessorResult
          buttonText={`${text}分`}
          record={record}
          task={task}
        ></ProfessorResult>
      ),
    },
    {
      title: (
        <>
          <div> 试卷</div>
          <div> (点击查看详情)</div>
        </>
      ),
      align: 'center',
      dataIndex: 'singleFills',
      render: text =>
        text != null && (
          <div className="flex justify-center">
            {text?.map((item: any, i: number) => {
              return (
                <div key={i}>
                  <TemplateDetailModal
                    templateId={task.templateId}
                    taskId={task.taskId}
                    singleFillId={item.singleFillId}
                    TemplateType={TemplateTypeEnum.Check}
                    title="试卷详情"
                    showDom={<Circle value={item.fillIndex} />}
                  />
                  {i + 1 !== text.length && <Divider className="my-4" />}
                </div>
              );
            })}
          </div>
        ),
    },
    {
      title: '试卷得分',
      align: 'center',
      dataIndex: 'singleFills',
      render: text =>
        text != null && (
          <div className="flex justify-center">
            {text?.map((item: any, i: number) => {
              return (
                <div key={i}>
                  <span>{`${item.score}分`}</span>
                  {i + 1 !== text.length && <Divider className="my-4" />}
                </div>
              );
            })}
          </div>
        ),
    },
  ];

  useEffect(() => {
    if (open) {
      getReviewResult();
    } else {
      setColumns([]);
    }
    return () => {
      setDataSource(undefined);
    };
  }, [getReviewResult, open]);

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        评审结果
      </a>
      <Modal
        title="专家详情"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        maskClosable={false}
        footer={null}
        loading={getReviewResultLoading}
      >
        <Table<DataType>
          columns={[...columns, ...baseColumns]}
          dataSource={dataSource}
          bordered
          pagination={{
            total: reviewResultData?.total,
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

export default ReviewResultModal;
