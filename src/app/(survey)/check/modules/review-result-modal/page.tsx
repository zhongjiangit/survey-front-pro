'use client';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { joinRowSpanData } from '@/lib/join-rowspan-data';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Modal, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import OrgResult from './modules/org-result';
import ProfessorResult from './modules/professor-result';

interface DataType {
  [key: string]: any;
}
const joinRowSpanKey = ['org1', 'org2', 'org3', 'name'];

interface Props {
  task: ListMyInspTaskResponse;
}

const ReviewResultModal = (props: any) => {
  const { task } = props;
  const [dataSource, setDataSource] = useState<any>();
  const [open, setOpen] = useState(false);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const {
    run: getReviewResult,
    data: reviewResultData,
    loading: getReviewResultLoading,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('currentSystem or currentOrg is not defined');
      }
      return Api.showReviewResult({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
    }
  );

  const columns: TableProps<DataType>['columns'] = [
    {
      title: (
        <>
          <div>第一层级单位</div>
          <div>平均分(点击查看详情)</div>
        </>
      ),
      dataIndex: 'org1',
      align: 'center',
      onCell: text => {
        return {
          rowSpan: text.rowSpan?.org1 || 0,
        };
      },
      render: (text, record) => (
        <>
          <div>{text}</div>
          <OrgResult
            buttonText={`${record.org1Result}分`}
            record={record}
            modalTitle={text}
          ></OrgResult>
        </>
      ),
    },
    {
      title: (
        <>
          <div>第二层级单位</div>
          <div>平均分(点击查看详情)</div>
        </>
      ),
      dataIndex: 'org2',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org2 || 0,
      }),
      render: (text, record) => (
        <>
          <div>{text}</div>
          <OrgResult
            buttonText={`${record.org2Result}分`}
            modalTitle={text}
            record={record}
          ></OrgResult>
        </>
      ),
    },
    {
      title: (
        <>
          <div>第三层级单位</div>
          <div>平均分(点击查看详情)</div>
        </>
      ),
      dataIndex: 'org3',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org3 || 0,
      }),
      render: (text, record) => (
        <>
          <div>{text}</div>
          <OrgResult
            buttonText={`${record.org3Result}分`}
            record={record}
            modalTitle={text}
          ></OrgResult>
        </>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <a className="text-blue-500">{record.phone}</a>
        </>
      ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
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
      dataIndex: 'personResult',
      render: (text, record) =>
        text && (
          <ProfessorResult
            buttonText={`${text}分`}
            record={record}
          ></ProfessorResult>
        ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
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
      dataIndex: 'paper',
      render: text =>
        text && (
          <div className="flex justify-center">
            <TemplateDetailModal
              // TODO need to use the correct templateId
              templateId={1}
              TemplateType={TemplateTypeEnum.Check}
              title="试卷详情"
              showDom={<Circle value={text} />}
            />
          </div>
        ),
    },
    {
      title: '试卷得分',
      align: 'center',
      dataIndex: 'result',
      render: text => text && <a>{text} </a>,
    },
  ];

  useEffect(() => {
    setDataSource(
      joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
        return joinRowSpanData(prev, currentKey);
      }, reviewResultData?.data || []) // checkDetailData
    );

    return () => {
      setDataSource(undefined);
    };
  }, [reviewResultData]);

  useEffect(() => {
    if (open) {
      getReviewResult();
    }
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
          columns={columns}
          dataSource={dataSource}
          bordered
          pagination={{
            total: dataSource?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            // current: pageNumber,
            // pageSize: pageSize,
            showTotal: total => `总共 ${total} 条`,
            // onChange: (page, pageSize) => {
            //   setPageNumber(page);
            //   setPageSize(pageSize);
            // },
          }}
        />
      </Modal>
    </>
  );
};

export default ReviewResultModal;
