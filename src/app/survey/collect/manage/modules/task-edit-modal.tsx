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
  const [formValues, setFormValues] = useState<Values>();

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setOpen(false);
  };

  return (
    <>
      <a className="underline text-blue-500" onClick={() => setOpen(true)}>
        编辑
      </a>
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
            name="form_in_modal"
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
    </>
  );
};

export default TaskEditModal;
