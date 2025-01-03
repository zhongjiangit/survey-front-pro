'use client';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  joinRowSpanDataChild,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Modal, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { useReviewResultColumns } from '../hooks/useReviewResultColumns';
import ProfessorResult from './modules/professor-result';

interface DataType {
  [key: string]: any;
}
// const joinRowSpanKey = ['org1', 'org2', 'org3', 'name'];

const joinRowSpanKey: joinRowSpanKeyParamsType[] = [
  { coKey: 'org1', compareKeys: ['org1'], childKey: { org1: 'orgId' } },
  { coKey: 'org2', compareKeys: ['org2'], childKey: { org2: 'orgId' } },
  { coKey: 'org3', compareKeys: ['org3'], childKey: { org3: 'orgId' } },
  {
    coKey: 'fillerStaffName',
    compareKeys: ['fillerStaffName', 'fillerCellphone'],
  },
];

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
      onSuccess: data => {
        setColumns(data.data);
        const combineKeys = Object.keys(data.data[0]?.levels).map(
          (_key, index) => `org${index + 1}`
        );
        const tableData = (combineKeys || []).reduce(
          (prev: any[] | undefined, currentKey: string) => {
            return joinRowSpanDataChild(prev, currentKey, 'orgId');
          },
          data?.data
        );
        setDataSource(tableData);
      },
    }
  );

  const baseColumns: TableProps<DataType>['columns'] = [
    // {
    //   title: (
    //     <>
    //       <div>第一层级单位</div>
    //       <div>平均分(点击查看详情)</div>
    //     </>
    //   ),
    //   dataIndex: 'org1',
    //   align: 'center',
    //   onCell: text => {
    //     return {
    //       rowSpan: text.rowSpan?.org1 || 0,
    //     };
    //   },
    //   render: (text, record) => (
    //     <>
    //       <div>{text.orgName || '-'}</div>
    //       <OrgResult
    //         buttonText={`${record.averageScore}分`}
    //         record={record}
    //         modalTitle={text.orgName || '-'}
    //       ></OrgResult>
    //     </>
    //   ),
    // },
    // {
    //   title: (
    //     <>
    //       <div>第二层级单位</div>
    //       <div>平均分(点击查看详情)</div>
    //     </>
    //   ),
    //   dataIndex: 'org2',
    //   align: 'center',
    //   onCell: text => ({
    //     rowSpan: text.rowSpan?.org2 || 0,
    //   }),
    //   render: (text, record) => (
    //     <>
    //       <div>{text.orgName || '-'}</div>
    //       <OrgResult
    //         buttonText={`${record?.org2Result}分`}
    //         modalTitle={text.orgName || '-'}
    //         record={record}
    //       ></OrgResult>
    //     </>
    //   ),
    // },
    // {
    //   title: (
    //     <>
    //       <div>第三层级单位</div>
    //       <div>平均分(点击查看详情)</div>
    //     </>
    //   ),
    //   dataIndex: 'org3',
    //   align: 'center',
    //   onCell: text => ({
    //     rowSpan: text.rowSpan?.org3 || 0,
    //   }),
    //   render: (text, record) => (
    //     <>
    //       <div>{text.orgName || '-'}</div>
    //       <OrgResult
    //         buttonText={`${record.org3Result}分`}
    //         record={record}
    //         modalTitle={text.orgName || '-'}
    //       ></OrgResult>
    //     </>
    //   ),
    // },
    {
      title: '姓名',
      dataIndex: 'fillerStaffName',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <a className="text-blue-500">{record.fillerCellphone}</a>
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
      render: (text, record) =>
        text != null && (
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
              templateId={task.templateId}
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

  // useEffect(() => {
  //   setDataSource(
  //     joinRowSpanKey.reduce(
  //       (prev: any[] | undefined, currentKey) => {
  //         return fullJoinRowSpanData(prev, currentKey);
  //       },
  //       reviewResultData?.data.length ? reviewResultData?.data : checkDetailData // TODO: remove this line
  //     )
  //   );

  //   return () => {
  //     setDataSource(undefined);
  //   };
  // }, [reviewResultData]);

  useEffect(() => {
    if (open) {
      getReviewResult();
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
