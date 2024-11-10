'use client';

import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useState } from 'react';

interface TaskDeleteModalProps {}

const TaskDeleteModal: React.FC<TaskDeleteModalProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const onClose = () => {
    console.log(1214);

    form.setFieldsValue({
      cellphone: '139820881',
    });
    setOpen(false);
  };

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    console.log(form.getFieldsValue());
    onClose();
  };

  return (
    <>
      <a
        className="underline text-blue-500"
        onClick={() => {
          setOpen(true);
          form.setFieldsValue({
            cellphone: '13982088460',
            pic: '',
            captcha: '',
          });
        }}
      >
        取消
      </a>
      <Modal
        open={open}
        title="取消资料收集"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={onClose}
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
        <p className="my-4">为了避免您的误操作，请输入验证码</p>
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
              <Form.Item name="cellphone" noStyle>
                <Input disabled type="input" placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col span={8}></Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="pic"
          label="图形验证码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item name="pic" noStyle>
                <Input type="input" placeholder="请输入右侧图形码" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button>XIN2</Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name="captcha"
          label="验证码"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item name="captcha" noStyle>
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
