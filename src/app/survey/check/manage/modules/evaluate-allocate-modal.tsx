'use client';

import { DatePicker, Form, Input, Modal, Switch } from 'antd';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;

interface EvaluateAllocateModalProps {}

interface Values {
  taskName?: string;
}

const EvaluateAllocateModal: React.FC<
  EvaluateAllocateModalProps
> = ({}: EvaluateAllocateModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Values>();

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setOpen(false);
  };

  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        分配
      </a>
      <Modal
        open={open}
        title="专家评审分配"
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
          <div className="text-blue-400">关于****任务</div>
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
          <RangePicker />
        </Form.Item>
        <Form.Item name="a" label="专家能否查看填报人信息">
          <Switch />
        </Form.Item>
        <Form.Item name="b" label="填报人能否查看专家姓名">
          <Switch />
        </Form.Item>
        <Form.Item name="c" label="填报人能否查看专家评审意见">
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};

export default EvaluateAllocateModal;
