'use client';

import Api from '@/api';
import CustomSelect from '@/components/common/custom-select';
import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import type { FormProps } from 'antd';
import { Button, Drawer, Form, Input, Switch } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { NewCollectItemType } from '../check/page';

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
  const [widgetItems, setWidgetItems] = useState<any>([]);
  const [widgetList, setWidgetList] = useState<any>([]);

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue({
        ...initValues,
        widgetId: { componentId: initValues.widgetId },
      });
    } else {
      form.setFieldsValue({ isRequired: true });
    }
  }, [form, initValues]);

  useRequest(
    () => {
      return Api.getAllWidgetsList({
        currentSystemId: Number(systemId),
      });
    },
    {
      refreshDeps: [systemId],
      onSuccess: response => {
        if (response.data) {
          const items = response.data.map((group: any) => {
            return {
              key: group.groupId,
              label: group.groupName,
              title: group.groupName,
              children: group.widgets.map((item: any) => ({
                type: item.widgetType,
                label: item.widgetName,
                value: item.id,
              })),
            };
          });
          // find all widgets and push into widgetsList
          const widgets = response.data.reduce((acc: any, cur: any) => {
            return acc.concat(cur.widgets);
          }, []);
          setWidgetList(widgets);
          setWidgetItems(items);
        }
      },
    }
  );

  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish: FormProps['onFinish'] = values => {
    // isRequired 为switch组件，需要转换为0或1
    values.isRequired = values.isRequired
      ? ZeroOrOneTypeEnum.One
      : ZeroOrOneTypeEnum.Zero;
    const widget = widgetList?.find(
      (item: any) => item.id === values.widgetId.componentId
    );
    pushItem({
      ...initValues,
      ...values,
      widgetId: widget.id,
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
          name="item-check"
          form={form}
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          initialValues={{ isRequired: true }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="标题"
            name="itemCaption"
            layout="horizontal"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input type="input" placeholder="输入标题" />
          </Form.Item>
          <Form.Item
            label="是否必填"
            name="isRequired"
            layout="horizontal"
            rules={[{ required: true, message: '请选择是否必填!' }]}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            label="选择控件"
            name="widgetId"
            // layout="vertical"
            rules={[{ required: true, message: '请选择展示控件' }]}
          >
            <CustomSelect
              source={widgetItems}
              initValue={initValues?.widgetId}
            />
          </Form.Item>
          <Form.Item label="提醒事项：" name="itemMemo">
            <Input.TextArea rows={4} placeholder="输入提醒事项" />
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
