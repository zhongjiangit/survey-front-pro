'use client';

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
} from 'antd';
import Link from 'next/link';

interface Props {
  initialValues?: any;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const SystemForm = (props: Props) => {
  const [form] = Form.useForm();
  const { initialValues = { allowSubInitiate: false, allowSupCheck: false } } =
    props;
  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <Form
        {...layout}
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        initialValues={initialValues}
      >
        <Form.Item
          name="systemName"
          label="系统名称"
          rules={[{ required: true }]}
        >
          <Input type="textarea" placeholder="请输入系统名称" />
        </Form.Item>
        <Form.Item
          name="freeTimes"
          label="功能免费次数"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            placeholder="请输入功能免费次数"
            className="w-full"
          />
        </Form.Item>
        <Form.Item
          name="validDate"
          label="账号有效期"
          rules={[{ required: true }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          name="levelCount"
          label="系统层级"
          rules={[{ required: true }]}
        >
          <InputNumber
            min={0}
            placeholder="请输入系统最多允许层级"
            className="w-full"
          />
        </Form.Item>
        <Form.Item name="allowSubInitiate" label="是否允许下层级使用该系统">
          <Switch
            onChange={e => {
              if (!e) form.setFieldValue('allowSupCheck', false);
            }}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.allowSubInitiate !== currentValues.allowSubInitiate
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('allowSubInitiate') === true ? (
              <Form.Item name="allowSupCheck" label="上层是否能查看下层数据">
                <Switch />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button htmlType="button" onClick={onReset}>
              <Link href="/survey/system">取消</Link>
            </Button>
            <Button type="primary" htmlType="submit">
              {`${initialValues.id ? '保存' : '创建'}系统`}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SystemForm;
