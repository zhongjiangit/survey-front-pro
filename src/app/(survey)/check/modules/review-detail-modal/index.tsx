'use client';

import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { Button, Modal, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  fullJoinRowSpanData,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { checkDetailData } from '../../testData';
import { useReviewDetailColumn } from '../hooks/useReviewDetailColumn';
import ProfessorDetail from './modules/professor-detail';

interface DataType {
  [key: string]: any;
}

const joinRowSpanKey: joinRowSpanKeyParamsType[] = [
  { coKey: 'org1', compareKeys: ['org1'], childKey: { org1: 'orgId' } },
  { coKey: 'org2', compareKeys: ['org2'], childKey: { org2: 'orgId' } },
  { coKey: 'org3', compareKeys: ['org3'], childKey: { org3: 'orgId' } },
  { coKey: 'name', compareKeys: ['name', 'org3'], childKey: { org1: 'orgId' } },
];

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
  console.log('columns', columns);

  const {
    run: getListReviewDetailsManager,
    data: listReviewDetailsManagerData,
    loading: getListReviewDetailsManagerLoading,
  } = useRequest(
    () => {
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
      manual: true,
      refreshDeps: [pageNumber, pageSize],
      onSuccess: data => {
        setColumns(data.data);
        setDataSource(
          joinRowSpanKey.reduce(
            (prev: any[] | undefined, keyParams) => {
              return fullJoinRowSpanData(prev, keyParams);
            },
            data?.data.length ? data?.data : checkDetailData // TODO: remove this line
          )
        );
      },
    }
  );

  const baseColumns: TableProps<DataType>['columns'] = [
    // {
    //   title: '第一层级单位',
    //   dataIndex: 'org1',
    //   align: 'center',
    //   onCell: text => {
    //     return {
    //       rowSpan: text.rowSpan?.org1 || 0,
    //     };
    //   },
    //   render: text => text.orgName || '-',
    // },
    // {
    //   title: '第二层级单位',
    //   dataIndex: 'org2',
    //   align: 'center',
    //   onCell: text => ({
    //     rowSpan: text.rowSpan?.org2 || 0,
    //   }),
    //   render: text => text.orgName || '-',
    // },
    // {
    //   title: '第三层级单位',
    //   dataIndex: 'org3',
    //   align: 'center',
    //   onCell: text => ({
    //     rowSpan: text.rowSpan?.org3 || 0,
    //   }),
    //   render: text => text.orgName || '-',
    // },
    {
      title: '姓名',
      dataIndex: 'fillerStaffName',
      align: 'center',
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
        text != null && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '待审核专家',
      align: 'center',
      dataIndex: 'needReviewExportCount',
      render: (text, record) =>
        text != null && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '待提交专家',
      align: 'center',
      dataIndex: 'needSubmitExportCount',
      render: (text, record) =>
        text != null && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '已驳回专家',
      align: 'center',
      dataIndex: 'rejectedExportCount',
      render: (text, record) =>
        text != null && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
  ];

  // useEffect(() => {
  //   setDataSource(
  //     joinRowSpanKey.reduce(
  //       (prev: any[] | undefined, keyParams) => {
  //         return fullJoinRowSpanData(prev, keyParams);
  //       },
  //       listReviewDetailsManagerData?.data.length
  //         ? listReviewDetailsManagerData?.data
  //         : checkDetailData // TODO: remove this line
  //     )
  //   );

  //   return () => {
  //     setDataSource(undefined);
  //   };
  // }, [listReviewDetailsManagerData]);

  useEffect(() => {
    if (open) {
      getListReviewDetailsManager();
    }
  }, [getListReviewDetailsManager, open]);

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        评审详情
      </a>
      <Modal
        title="专家详情"
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        loading={getListReviewDetailsManagerLoading}
        footer={null}
      >
        <div className="flex justify-end mb-2">
          <Space>
            <Button type="primary">一键通过本页待审核专家</Button>
            <Button type="primary">一键通过所有待审核专家</Button>
          </Space>
        </div>
        <Table<DataType>
          columns={[...columns, ...baseColumns]}
          dataSource={dataSource}
          bordered
          pagination={{
            total: dataSource?.length,
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
