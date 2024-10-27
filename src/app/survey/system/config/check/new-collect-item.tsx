'use client';

import { useRequest } from 'ahooks';
import type { FormProps } from 'antd';
import { Button, Drawer, Form, Input, Select, Switch } from 'antd';
import React, { useEffect } from 'react';
import Api from '@/api';
import { useSearchParams } from 'next/navigation';
import { ZeroOrOneType, ZeroOrOneTypeEnum } from '@/interfaces/CommonType';
import { NewCollectItemType } from './page';

interface Props {
  open: boolean;
  initValues?: NewCollectItemType;
  setOpen: (open: boolean) => void;
  pushItem: (item: any) => void;
}

const NewCollectItem: React.FC<Props> = ({
  open,
  initValues,
  setOpen,
  pushItem,
}: Props) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const systemId = searchParams.get('id');

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({ ...initValues });
    } else {
      form.setFieldsValue({ isRequired: true });
    }
  }, [form, initValues]);

  const { data: widgetList = { data: [] } } = useRequest(() => {
    return Api.getAllWidgetsList({
      currentSystemId: Number(systemId),
    });
  });

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish: FormProps['onFinish'] = values => {
    // isRequired 为switch组件，需要转换为0或1
    values.isRequired = values.isRequired
      ? ZeroOrOneTypeEnum.One
      : ZeroOrOneTypeEnum.Zero;
    const widget = widgetList.data?.find(item => item.id === values.widgetId);
    pushItem({
      ...initValues,
      ...values,
      widgetDetails: widget?.widgetDetails,
      widgetName: widget?.widgetName,
      widgetType: widget?.widgetType,
    });
    onClose();
  };

  const onFinishFailed: FormProps['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Drawer
        title="新增题目"
        onClose={onClose}
        destroyOnClose
        maskClosable={false}
        open={open}
      >
        <Form
          name="item123"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="标题"
            name="itemCaption"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input type="input" placeholder="输入标题" />
          </Form.Item>
          <Form.Item
            label="是否必填"
            name="isRequired"
            rules={[{ required: true, message: '请选择是否必填!' }]}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="选择控件"
            name="widgetId"
            rules={[{ required: true, message: '请选择展示控件' }]}
          >
            <Select
              placeholder="选择控件"
              optionFilterProp="label"
              options={widgetList.data?.map(item => ({
                label: item.widgetName,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="提醒事项"
            name="itemMemo"
            rules={[{ required: false, message: '请输入提醒事项!' }]}
          >
            <Input type="input" placeholder="输入提醒事项" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default NewCollectItem;
