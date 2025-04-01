import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  TableProps,
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

import Api from '@/api';
import { ListReviewExpertDetailsResponse } from '@/api/task/listReviewExpertDetails';
import RejectTimelineReview from '@/app/modules/reject-timeline-review';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  ProcessStatusObject,
  ProcessStatusType,
  ReviewTypeEnum,
  TemplateTypeEnum,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
interface Values {
  rejectComment: string;
}

interface ProfessorDetailProps {
  buttonText: string;
  type: ReviewTypeEnum;
  [key: string]: any;
}

const ProfessorDetail: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
  task,
  type,
  refresh: refreshParent,
}) => {
  const [open, setOpen] = useState(false);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [form] = Form.useForm();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [currentRecord, setCurrentRecord] =
    useState<ListReviewExpertDetailsResponse>();

  const {
    run: getListReviewExpertDetails,
    data: listReviewExpertDetailsData,
    loading: getListReviewExpertDetailsLoading,
    refresh,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('currentSystem or currentOrg is not defined');
      }
      return Api.listReviewExpertDetails({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        singleFillId: record.singleFillId,
        type: type,
      });
    },
    {
      manual: true,
    }
  );

  const { run: approveReviewBatch } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !task?.taskId) {
        return Promise.reject('未获取到必要数据');
      }

      return Api.approveReviewBatch({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
        singleFillIds: [record.singleFillId],
      });
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.info('一键通过成功');
        refresh();
        refreshParent?.();
      },
      onError: error => {
        // messageApi.error(error.toString());
      },
    }
  );

  const { run: rejectReview } = useRequest(
    (values: Values) => {
      if (
        !currentSystem?.systemId ||
        !currentOrg?.orgId ||
        !task?.taskId ||
        !currentRecord
      ) {
        return Promise.reject('未获取到必要数据');
      }

      return Api.rejectReview({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
        singleFillId: currentRecord.singleFillId,
        expertId: currentRecord.expertId,
        rejectComment: values.rejectComment,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.info('驳回成功');
        setRejectModalOpen(false);
        refresh();
        refreshParent?.();
      },
      onError: error => {
        // messageApi.error(error.toString());
      },
    }
  );

  const operationButtons: any = {
    pass: (record: ListReviewExpertDetailsResponse) => (
      <a
        className="text-blue-500"
        onClick={() => {
          if (task?.taskId === undefined) {
            return;
          }
          Api.approveReview({
            currentSystemId: currentSystem!.systemId,
            currentOrgId: currentOrg!.orgId,
            taskId: task.taskId,
            singleFillId: record.singleFillId,
            expertId: record.expertId,
          }).then(() => {
            messageApi.info('通过成功');
            refresh();
            refreshParent?.();
          });
        }}
      >
        通过
      </a>
    ),
    reject: (record: ListReviewExpertDetailsResponse) => (
      <a
        className=" text-blue-500"
        onClick={() => {
          setRejectModalOpen(true);
          setCurrentRecord(record);
        }}
      >
        驳回
      </a>
    ),
    rejectInfo: (record: ListReviewExpertDetailsResponse) => (
      <RejectTimelineReview
        taskId={task?.taskId}
        singleFillId={record.singleFillId}
        expertId={record.expertId}
      />
    ),
  };

  const columns: TableProps['columns'] = [
    {
      title: '专家信息',
      dataIndex: 'expertName',
      align: 'center',
      render: text => (
        <>
          <div>{text}</div>
        </>
      ),
    },
    {
      title: '评审对象',
      dataIndex: 'fillerStaffName',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{record.fillerOrgName}</div>
          <div>{text}</div>
        </>
      ),
    },
    {
      title: '评审试卷',
      dataIndex: 'singleFillId',
      align: 'center',

      render: text => (
        <div className="flex justify-center">
          <TemplateDetailModal
            templateId={task.templateId}
            taskId={task.taskId}
            singleFillId={text}
            TemplateType={TemplateTypeEnum.Check}
            title="试卷详情"
            showDom={'详情'}
          />
        </div>
      ),
    },
    {
      title: '专家评分',
      dataIndex: 'totalScore',
      align: 'center',
      render: text => text || '-',
    },
    {
      title: '评价维度',
      align: 'center',
      dataIndex: 'dimensionScores',
      render: text => (
        <div>
          {text?.map((item: any, i: number) => {
            return (
              <div key={i}>
                <span>{item.dimensionName}</span>
                {i + 1 !== text.length && <Divider className="my-4" />}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: '维度评分',
      align: 'center',
      dataIndex: 'dimensionScores',
      render: text => (
        <div>
          {text?.map((item: any, i: number) => {
            return (
              <div key={i}>
                <span>{item.reviewScore}</span>
                {i + 1 !== text.length && <Divider className="my-4" />}
              </div>
            );
          })}
        </div>
      ),
    },

    {
      title: '评审状态',
      align: 'center',
      dataIndex: 'processStatus',
      render: (text: ProcessStatusType) =>
        text && <span>{ProcessStatusObject[text]}</span>,
    },
    {
      title: '专家点评',
      align: 'center',
      dataIndex: 'expertComment',
      render: text => text || '-',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      render: (text, record) => (
        <Space>
          {type === ReviewTypeEnum.Passed && operationButtons.reject(record)}
          {type === ReviewTypeEnum.WaitAudit && [
            operationButtons.pass(record),
            operationButtons.reject(record),
          ]}
          {record.rejectedOnce === ZeroOrOneTypeEnum.One &&
            operationButtons.rejectInfo(record)}
          {type !== ReviewTypeEnum.Passed &&
            type !== ReviewTypeEnum.WaitAudit &&
            record.rejectedOnce === ZeroOrOneTypeEnum.Zero &&
            '-'}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (open) {
      getListReviewExpertDetails();
    }
  }, [getListReviewExpertDetails, open]);

  return (
    <>
      {contextHolder}
      <a
        onClick={() => {
          setOpen(true);
        }}
        className="text-blue-500"
      >
        {buttonText}
      </a>
      <Modal
        title={<div className="mx-5 mt-2">专家评审详情</div>}
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        footer={null}
      >
        <div className="m-5 mb-0">
          {type === ReviewTypeEnum.WaitAudit && (
            <div className="flex justify-end mb-2 ">
              <Button
                type="primary"
                onClick={() => {
                  approveReviewBatch();
                }}
              >
                一键通过
              </Button>
            </div>
          )}
          <Table
            columns={columns}
            dataSource={listReviewExpertDetailsData?.data || []}
            loading={getListReviewExpertDetailsLoading}
            pagination={{
              total: listReviewExpertDetailsData?.data?.length || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              // current: pageNumber,
              // pageSize: pageSize,
              // showTotal: total => `总共 ${total} 条`,
              // onChange: (page, pageSize) => {
              //   setPageNumber(page);
              //   setPageSize(pageSize);
              // },
            }}
          ></Table>
        </div>
      </Modal>
      <Modal
        open={rejectModalOpen}
        title="驳回信息"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setRejectModalOpen(false)}
        destroyOnClose
        maskClosable={false}
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={values => rejectReview(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="rejectComment"
          label="驳回原因"
          rules={[
            {
              required: true,
              message: '请输入驳回原因!',
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ProfessorDetail;
