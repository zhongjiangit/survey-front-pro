'use client';

import Api from '@/api';
import TaskDetail, { taskType } from '@/app/modules/task-detail';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  DetailShowTypeEnum,
  TaskProcessStatusEnum,
  TaskProcessStatusObject,
  TaskProcessStatusType,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Form, Input, message, Modal, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';

interface Values {
  rejectComment: string;
}

interface TaskFillDetailModalProps {
  task: taskType | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshList: () => void;
}

const TaskMemberFillDetailModal = ({
  task,
  open,
  setOpen,
  refreshList,
}: TaskFillDetailModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [form] = Form.useForm();

  const {
    run: getFillProcessDetails,
    data: fillProcessDetailsList,
    refresh,
  } = useRequest(
    () => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到组织机构');
      } else if (!task?.taskId) {
        return Promise.reject('未获取到任务信息');
      }
      return Api.getFillProcessDetails({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        pageNumber: 1,
        pageSize: 10,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
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

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: '单位',
        dataIndex: 'org',
        key: 'org',
        width: '20%',
        render: (_: any, record: any) => {
          return (
            <div className="cursor-pointer">
              {/* TODO need to add org */}
              {/* <Popover content={record.org}>{record.org.split('/')[0]}</Popover> */}
            </div>
          );
        },
      },
      {
        title: '人员',
        dataIndex: 'member',
        key: 'member',
        align: 'center',
        // width: '30%',
        render: (_, record) => {
          return (
            <>
              {record.cellphone
                ? `${record.staffName}(${record.cellphone}) 资料提交：${record.fillCount}份`
                : '-'}
            </>
          );
        },
      },
      {
        title: '状态',
        dataIndex: 'processStatus',
        align: 'center',
        render: value => {
          return (
            <div>
              {TaskProcessStatusObject[value as TaskProcessStatusType] || value}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 200,
        align: 'center',
        render: (_: any, record: any) => {
          return (
            <Space className="flex justify-center items-center">
              {record.processStatus && (
                <TaskDetail
                  task={task}
                  staffId={record.staffId}
                  customTitle="任务详情"
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
                  通过
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
            </Space>
          );
        },
      },
    ],
    [currentOrg, currentSystem, messageApi, refresh, refreshList, task?.taskId]
  );

  useEffect(() => {
    if (open) {
      getFillProcessDetails();
    }
  }, [getFillProcessDetails, open]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={
          <div className="flex gap-5 items-center justify-between mb-3 pr-10">
            <h2 className="text-xl">任务详情</h2>
          </div>
        }
        width={1000}
        onCancel={() => setOpen(false)}
        onOk={() => {
          setOpen(false);
        }}
        maskClosable={false}
        footer={false}
      >
        <Table
          columns={columns}
          dataSource={fillProcessDetailsList?.data || []}
          pagination={{
            total: fillProcessDetailsList?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
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

export default TaskMemberFillDetailModal;
