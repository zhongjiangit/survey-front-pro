'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useFillProcessDetailColumns } from '@/hooks/useFillProcessDetailColumns';
import { joinRowSpanDataChild } from '@/lib/join-rowspan-data';
import { TaskProcessStatusEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import type { TableProps } from 'antd';
import { Form, Input, message, Modal, Space, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

interface Values {
  rejectComment: string;
}

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];

interface DataType {
  key: React.ReactNode;
  city: string;
  school: string;
  member: string;
  status: string;
  children?: DataType[];
}

interface TaskFillDetailModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  taskId: number | undefined;
  refreshList: () => void;
}

const TaskOrgFillDetailModal = ({
  open,
  setOpen,
  taskId,
  refreshList,
}: TaskFillDetailModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const { columns, setColumns } = useFillProcessDetailColumns([]);
  const [form] = Form.useForm();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [dataSource, setDataSource] = useState<any>();

  const {
    run: getFillProcessDetails,
    data,
    refresh,
  } = useRequest(
    () => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到组织机构');
      } else if (!taskId) {
        return Promise.reject('未获取到任务信息');
      }
      return Api.getFillProcessDetails({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        pageNumber: 1,
        pageSize: 10,
        taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        setColumns(data.data);
        const combineKeys = Object.keys(data.data[0].levels).map(
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

  const { run: rejectFill } = useRequest(
    (values: Values) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId || !taskId) {
        return Promise.reject('未获取到组织机构');
      }
      return Api.rejectFill({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId,
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

  const operationColumn: ColumnType = {
    title: '操作',
    dataIndex: 'operation',
    width: 200,
    align: 'center',
    render: (_: any, record: any) => {
      return (
        <Space className="flex justify-center items-center">
          {record.processStatus && <a className=" text-blue-500">资料详情</a>}
          {record.processStatus === TaskProcessStatusEnum.NeedSelfAudit && (
            <a
              className=" text-blue-500"
              onClick={() => {
                if (taskId === undefined) {
                  return;
                }
                Api.approveFill({
                  currentSystemId: currentSystem!.systemId,
                  currentOrgId: currentOrg!.orgId,
                  taskId: taskId,
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
  };

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
        }}
      >
        <Table
          bordered
          columns={[...columns, operationColumn]}
          dataSource={dataSource}
        />
      </Modal>
      <Modal
        open={rejectModalOpen}
        title="驳回信息"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setRejectModalOpen(false)}
        destroyOnClose
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
