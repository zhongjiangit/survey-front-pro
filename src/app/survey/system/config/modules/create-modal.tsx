'use client';

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio, Space } from 'antd';

interface Values {
  name: string;
  isValid: 0 | 1;
  description?: string;
}

interface CreateModalProps {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  initValues?: Values;
}

const CreateModal = ({
  title,
  open,
  setOpen,
  initValues,
}: CreateModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue(initValues);
    }
  }, [initValues]);

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    form.resetFields();
    setOpen(false);
  };

  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      title={`${!!initValues ? '编辑' : '创建'}${title}模版`}
      onCancel={onCancel}
      destroyOnClose
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        name="create-modal"
        initialValues={{ isValid: 1 }}
        onFinish={values => onCreate(values)}
      >
        <Form.Item
          name="name"
          label="模版名称"
          rules={[
            {
              required: true,
              message: '请输入模版名称!',
            },
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="isValid"
          className="collection-create-form_last-form-item"
          label="启用状态"
          rules={[
            {
              required: true,
              message: '请选择启用状态!',
            },
          ]}
        >
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={0}>停用</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="description" label="模版描述">
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 17, span: 7 }}>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
