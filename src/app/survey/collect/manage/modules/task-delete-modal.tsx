'use client';

import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useState } from 'react';

interface TaskDeleteModalProps {}

interface Values {
  taskName?: string;
}

const TaskDeleteModal: React.FC<TaskDeleteModalProps> = ({}) => {
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
        删除
      </a>
      <Modal
        open={open}
        title="删除调查确认"
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
        <p className="my-4">为了避免你的误删除，删除操作需要验证你的手机号</p>
        <Form.Item
          name="cellphone"
          label="手机号"
          rules={[
            {
              required: true,
              message: '手机号不能为空!',
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Input type="input" placeholder="请输入手机号" />
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="图形验证码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '图形码不能为空!',
                  },
                ]}
              >
                <Input type="input" placeholder="请输入右侧图形码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button>XIGN12</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="验证码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请输入手机验证码!',
                  },
                ]}
              >
                <Input type="input" placeholder="请输入手机验证码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button>获取验证码</Button>
            </Col>
          </Row>
        </Form.Item>
      </Modal>
    </>
  );
};

export default TaskDeleteModal;
