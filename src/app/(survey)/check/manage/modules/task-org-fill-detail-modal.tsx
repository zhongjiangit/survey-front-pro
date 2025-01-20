'use client';

import Api from '@/api';
import RejectTimeline from '@/app/modules/reject-timeline';
import TaskDetail, { taskType } from '@/app/modules/task-detail';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useFillProcessDetailColumns } from '@/hooks/useFillProcessDetailColumns';
import { joinRowSpanDataChild } from '@/lib/join-rowspan-data';
import {
  DetailShowTypeEnum,
  TaskProcessStatusEnum,
  TaskStatusTypeEnum,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useEffect, useState } from 'react';

interface Values {
  rejectComment: string;
}

interface TaskFillDetailModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: taskType | undefined;
  refreshList: () => void;
  origin?: boolean;
}

const TaskOrgFillDetailModal = ({
  open,
  setOpen,
  task,
  refreshList,
  origin,
}: TaskFillDetailModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillProcessDetailColumns([]);
  const [form] = Form.useForm();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [dataSource, setDataSource] = useState<any>();
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const {
    run: getFillProcessDetails,
    data,
    refresh,
  } = useRequest(
    (pageNumber, pageSize) => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到组织机构');
      } else if (!task?.taskId) {
        return Promise.reject('未获取到任务信息');
      }
      return Api.getFillProcessDetails({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        pageNumber: pageNumber,
        pageSize: pageSize,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        setColumns(data.data);
        const combineKeys =
          data.data[0].levels &&
          Object.keys(data.data[0].levels).map(
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

  const { run: approveFillBatch } = useRequest(
    (staffIds?: number[]) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !task?.taskId) {
        return Promise.reject('未获取到组织机构');
      }
      return Api.approveFillBatch({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
        staffIds: staffIds,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.info('驳回成功');
        setRejectModalOpen(false);
        refresh();
      },
      onError: error => {
        messageApi.error(error.toString());
      },
    }
  );

  const { run: rejectFill } = useRequest(
    (values: Values) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !task?.taskId) {
        return Promise.reject('未获取到组织机构');
      }
      return Api.rejectFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
        staffId: currentRecord?.staffId,
        rejectComment: values.rejectComment,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.info('驳回成功');
        setRejectModalOpen(false);
        refresh();
      },
      onError: error => {
        messageApi.error(error.toString());
      },
    }
  );

  const sortColumns: ColumnType = {
    title: 'No.',
    width: 50,
    align: 'center',
    render: (_: any, __: any, index: number) => {
      return index + 1 + (pagination.pageNumber - 1) * pagination.pageSize;
    },
  };

  const operationColumn: ColumnType = {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    align: 'center',
    render: (_: any, record: any) => {
      return (
        <Space className="flex justify-center items-center">
          {(record.processStatus === TaskProcessStatusEnum.WaitAssign ||
            record.processStatus === TaskProcessStatusEnum.NotSubmitToSelf) &&
            record.rejectedOnce !== ZeroOrOneTypeEnum.One &&
            '-'}
          {record.processStatus !== TaskProcessStatusEnum.WaitAssign &&
            record.processStatus !== TaskProcessStatusEnum.NotSubmitToSelf && (
              <TaskDetail
                task={task}
                staffId={record.staffId}
                customTitle="资料详情"
                showType={DetailShowTypeEnum.Check}
              />
            )}
          {record.processStatus === TaskProcessStatusEnum.NeedSelfAudit && (
            <a
              className=" text-blue-500"
              onClick={() => {
                if (task?.taskId === undefined) {
                  return;
                }
                Api.approveFill({
                  currentSystemId: currentSystem!.systemId,
                  currentOrgId: currentOrg!.orgId,
                  taskId: task.taskId,
                  staffId: record.staffId,
                }).then(() => {
                  messageApi.info('通过成功');
                  refresh();
                  refreshList();
                });
              }}
            >
              {origin ? '通过' : '提交'}
            </a>
          )}
          {record.processStatus === TaskProcessStatusEnum.NeedSelfAudit && (
            <a
              className=" text-blue-500"
              onClick={() => {
                setRejectModalOpen(true);
                setCurrentRecord(record);
              }}
            >
              驳回
            </a>
          )}
          {record.processStatus === TaskProcessStatusEnum.Passed &&
            // @ts-expect-error: task is possibly undefined
            task?.fillTaskStatus !== TaskStatusTypeEnum.Finished &&
            origin && (
              <a
                className=" text-blue-500"
                onClick={() => {
                  setRejectModalOpen(true);
                  setCurrentRecord(record);
                }}
              >
                驳回
              </a>
            )}
          {record.rejectedOnce === ZeroOrOneTypeEnum.One && (
            <RejectTimeline
              taskId={task?.taskId}
              staffId={record.staffId}
              key="reject"
            />
          )}
        </Space>
      );
    },
  };

  useEffect(() => {
    if (open) {
      getFillProcessDetails(pagination.pageNumber, pagination.pageSize);
    }
  }, [getFillProcessDetails, open, pagination]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={
          <div className="flex gap-5 items-center justify-between mb-3 pr-10">
            <h2 className="text-xl">征集详情</h2>
          </div>
        }
        width={1200}
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
        }}
        maskClosable={false}
        footer={false}
        destroyOnClose
        afterClose={() => {
          setColumns([]);
          setPagination({ pageNumber: 1, pageSize: 10 });
        }}
      >
        <div className="flex justify-end mb-2">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const staffIds = data?.data
                  ?.filter(
                    (item: any) =>
                      item.processStatus === TaskProcessStatusEnum.NeedSelfAudit
                  )
                  .map((item: any) => item.staffId);
                if (staffIds?.length === 0) {
                  messageApi.info('没有可通过的数据');
                  return;
                }
                approveFillBatch(staffIds);
              }}
            >
              一键通过本页
            </Button>
            <Button
              type="primary"
              onClick={() => {
                approveFillBatch();
              }}
            >
              一键通过所有
            </Button>
          </Space>
        </div>
        <Table
          columns={[sortColumns, ...columns, operationColumn]}
          dataSource={dataSource}
          pagination={{
            total: data?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            onChange: (page, pageSize) => {
              setPagination({ pageNumber: page, pageSize: pageSize });
            },
            showTotal: total => `总共 ${total} 条`,
          }}
        />
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
            onFinish={values => rejectFill(values)}
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

export default TaskOrgFillDetailModal;
