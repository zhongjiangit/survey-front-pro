'use client';

import Api from '@/api';
import { TemplateOutlineCreateParamsType } from '@/api/template/create-outline';
import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, Radio, Space } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface Values {
  currentSystemId?: number;
  templateType?: number;
  templateTitle: string;
  isValid: 0 | 1;
  memo: string;
}

interface CreateModalProps {
  type: 'check' | 'collect';
  open: boolean;
  setOpen: (open: boolean) => void;
  refreshList: () => void;
  initValues?: any;
  selectedId?: string | null;
  selectedTab?: string | null;
}

// 创建枚举 check | collect
enum TemplateType {
  check = '试题抽检',
  collect = '资料收集',
}

const CreateModal = ({
  type,
  open,
  setOpen,
  refreshList,
  initValues,
  selectedId,
  selectedTab,
}: CreateModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const systemId = searchParams.get('id');
  const router = useRouter();

  const { run: createOutline, loading: submitLoading } = useRequest(
    params => {
      return Api.createTemplateOutline(params);
    },
    {
      manual: true,
      onSuccess: response => {
        messageApi.success('创建成功');
        form.resetFields();
        setOpen(false);
        refreshList();
        router.push(
          `/system/config/check?id=${selectedId}&tab=${selectedTab}&tempId=${response.data.id}`
        );
      },
    }
  );

  const { run: updateOutline, loading: updateLoading } = useRequest(
    params => {
      return Api.updateTemplateTitle(params);
    },
    {
      manual: true,
      onSuccess: () => {
        messageApi.success('更新成功');
        form.resetFields();
        setOpen(false);
        refreshList();
      },
    }
  );

  useEffect(() => {
    if (initValues) {
      form.setFieldsValue(initValues);
    }
  }, [form, initValues]);

  const onCreate = (values: Values) => {
    const params: TemplateOutlineCreateParamsType = {
      ...values,
      currentSystemId: Number(systemId),
      templateType: type === 'collect' ? 1 : 2,
    };
    if (!!initValues) {
      updateOutline({ ...params, templateId: initValues.templateId });
    } else {
      createOutline(params);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`${!!initValues ? '编辑' : '创建'}${TemplateType[type]}模版`}
        onCancel={onCancel}
        destroyOnClose
        footer={null}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          form={form}
          name="create-modal"
          initialValues={{ isValid: 1 }}
          onFinish={values => onCreate(values)}
        >
          <Form.Item
            name="templateTitle"
            label="模版名称"
            rules={[
              {
                required: true,
                message: '请输入模版名称!',
              },
            ]}
          >
            <Input type="input" />
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
              <Radio value={ZeroOrOneTypeEnum.One}>启用</Radio>
              <Radio value={ZeroOrOneTypeEnum.Zero}>停用</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="memo"
            label="模版描述"
            rules={[
              {
                required: true,
                message: '请输入模板描述!',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 17, span: 7 }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading || updateLoading}
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;
