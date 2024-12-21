'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { DatePicker, Form, Modal, Switch } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
const { RangePicker } = DatePicker;

interface EvaluateConfigModalProps {
  type?: string | number;
  taskId: number;
  taskName?: string;
  refreshPublishTask?: () => void;
}

interface Values {
  showFiller: boolean;
  showExpertName: boolean;
  showExpertComment: boolean;
  dateRange: [any, any];
}

const EvaluateConfigModal: React.FC<EvaluateConfigModalProps> = ({
  type = 'config',
  taskId,
  taskName,
  refreshPublishTask,
}: EvaluateConfigModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);

    const { showFiller, showExpertName, showExpertComment } = values;
    if (!currentSystem?.systemId || !currentOrg?.orgId) {
      return Promise.reject('未获取到组织机构');
    }
    Api.updateInspTaskReview({
      showFiller: showFiller ? 1 : 0,
      showExpertName: showExpertName ? 1 : 0,
      showExpertComment: showExpertComment ? 1 : 0,
      taskId: taskId,
      currentSystemId: currentSystem.systemId,
      currentOrgId: currentOrg.orgId,
      beginTimeReviewEstimate: values.dateRange[0].format('YYYY-MM-DD HH:mm'),
      endTimeReviewEstimate: values.dateRange[1].format('YYYY-MM-DD HH:mm'),
    }).then(() => {
      setOpen(false);
      refreshPublishTask?.();
    });
  };

  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        {type === 'config' ? '设置' : '修改'}
      </a>
      <Modal
        destroyOnClose
        afterClose={() => form.resetFields()}
        open={open}
        maskClosable={false}
        title="专家评审设置"
        okText="提交"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        modalRender={dom => (
          <Form
            layout="horizontal"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            form={form}
            name="form_in_modal"
            onFinish={values => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item label="任务名称">
          <div className="font-medium">关于{taskName}的任务</div>
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="专家评审起止日期"
          rules={[
            {
              required: true,
              message: '日期不能为空!',
            },
          ]}
        >
          <RangePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              format: 'HH:mm',
              defaultValue: [dayjs('09:00', 'HH:mm'), dayjs('09:00', 'HH:mm')],
            }}
          />
        </Form.Item>
        <Form.Item name="showFiller" label="专家能否查看填报人信息">
          <Switch />
        </Form.Item>
        <Form.Item name="showExpertName" label="填报人能否查看专家姓名">
          <Switch />
        </Form.Item>
        <Form.Item name="showExpertComment" label="填报人能否查看专家评审意见">
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};

export default EvaluateConfigModal;
