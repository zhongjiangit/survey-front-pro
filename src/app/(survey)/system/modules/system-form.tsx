'use client';

import Api from '@/api';
import { useRequest } from 'ahooks';
import type { FormItemProps } from 'antd';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const MyFormItemContext = React.createContext<(string | number)[]>([]);

// 各层级名称label枚举
const levelNames = ['一', '二', '三', '四'];

interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
}

function toArr(
  str: string | number | (string | number)[]
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

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
  const router = useRouter();
  const [form] = Form.useForm();
  const { initialValues = { allowSubInitiate: false, allowSupCheck: false } } =
    props;

  const { run: createSystem, loading: createLoading } = useRequest(
    params => {
      return Api.createSystem(params);
    },
    {
      manual: true,
      onSuccess: () => {
        router.push('/system');
        form.resetFields();
      },
    }
  );

  const { run: updateSystem, loading: updateLoading } = useRequest(
    params => {
      return Api.updateSystem(params);
    },
    {
      manual: true,
      onSuccess: () => {
        router.push('/system');
        form.resetFields();
      },
    }
  );

  const onFinish = (values: any) => {
    // 日期格式化
    values.validDate = values.validDate.format('YYYY-MM-DD');
    // switch 转换为 0 ｜ 1
    values.allowSubInitiate = values.allowSubInitiate ? 1 : 0;
    values.allowSupCheck = values.allowSupCheck ? 1 : 0;
    // 各层级名称转换成{levelName: 'name'}格式
    values.levels = values.levels.map((name: string) => ({ levelName: name }));

    if (initialValues.id !== undefined) {
      values.id = initialValues.id;
      const editedValues = { ...initialValues, ...values };
      console.log('editedValues', editedValues);
      updateSystem(editedValues);
    } else {
      createSystem(values);
    }
  };

  useEffect(() => {
    if (initialValues?.id !== undefined) {
      // initialValues中的levels转换为数组
      const levels = initialValues.levels.map(
        (item: { levelName: string }) => item.levelName
      );
      // initialValues中的validDate转换为dayjs对象
      initialValues.validDate = dayjs(initialValues.validDate, 'YYYY-MM-DD');

      // 转换allowSubInitiate和allowSupCheck为boolean
      initialValues.allowSubInitiate = initialValues.allowSubInitiate === 1;
      initialValues.allowSupCheck = initialValues.allowSupCheck === 1;
      // 设置form的初始值
      form.setFieldsValue({
        ...initialValues,
        levels,
      });
    } else {
      form.setFieldsValue({
        allowSubInitiate: false,
        allowSupCheck: false,
      });
    }
  }, [form, initialValues]);

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <Form
        {...layout}
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        // initialValues={initialValues}
      >
        <Form.Item
          name="systemName"
          label="系统名称"
          rules={[{ required: true }]}
        >
          <Input type="input" placeholder="请输入系统名称" />
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
            max={4}
            placeholder="请输入系统最多允许层级"
            className="w-full"
            disabled={initialValues?.id !== undefined}
            onChange={e => {
              if (e) form.setFieldValue('levelNames', e);
            }}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.levelNames !== currentValues.levelNames
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('levels') !== 0 ? (
              <MyFormItemGroup prefix={['levels']}>
                {/* 获取levelCount之后实时遍历生成表单 */}
                {[...Array(getFieldValue('levelCount') || 0)]?.map(
                  (_, index) => (
                    <MyFormItem
                      key={index}
                      name={index}
                      label={`第${levelNames[index]}级名称`}
                      rules={[{ required: true }]}
                    >
                      <Input
                        type="input"
                        disabled={initialValues?.id !== undefined}
                      />
                    </MyFormItem>
                  )
                )}
              </MyFormItemGroup>
            ) : null
          }
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
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
              }}
            >
              <Link href="/system">取消</Link>
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading || updateLoading}
            >
              {`${initialValues.id ? '保存' : '创建'}系统`}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SystemForm;

const MyFormItemGroup: React.FC<
  React.PropsWithChildren<MyFormItemGroupProps>
> = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix]
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};
