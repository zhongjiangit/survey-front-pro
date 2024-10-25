'use client';

import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

interface TaskEditModalProps {}

interface Values {
  taskName?: string;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title="编辑调查"
      okText="确定"
      cancelText="取消"
      okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
      onCancel={() => setOpen(false)}
      modalRender={dom => (
        <Form
          layout="vertical"
          form={form}
          name="form_new_task_modal"
          onFinish={values => onCreate(values)}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        name="taskName"
        label="调查名称"
        rules={[
          {
            required: true,
            message: '调查名称不能为空!',
          },
        ]}
      >
        <Input type="input" />
      </Form.Item>
    </Modal>
  );
};

export default TaskEditModal;
