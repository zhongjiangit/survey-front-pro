'use client';

import Api from '@/api';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { SendSmsTypeEnum } from '@/types/CommonType';
import {
  CodepenOutlined,
  LockOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import {
  ProForm,
  ProFormCaptcha,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { message, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import Image from 'next/image';

interface TaskDeleteModalProps {
  taskId: number;
  onRefresh: () => void;
}

const TaskDeleteModal = (props: TaskDeleteModalProps) => {
  const { taskId, onRefresh } = props;
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const user = useSurveyUserStore(state => state.user);

  const [captchaUrl, setCaptchaUrl] = useState('');

  const currentSystem = useSurveySystemStore(state => state.currentSystem);

  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const formRefDeleteTask = useRef<ProFormInstance>();

  const { run: getCaptcha, loading: getCaptchaLoading } = useRequest(
    () => {
      return Api.getCaptcha();
    },
    {
      manual: true,
      onSuccess: response => {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setCaptchaUrl(url);
      },
    }
  );

  const { run: sendSms, loading: sendSmsLoading } = useRequest(
    params => {
      return Api.sendSms({
        ...params,
        eventType: SendSmsTypeEnum.ChangePassword,
      });
    },
    {
      manual: true,
      onSuccess: response => {
        if (response?.message) {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        } else if (response?.result === 0) {
          messageApi.success('验证码发送成功！');
        }
      },
      onError: error => {
        messageApi.open({
          type: 'error',
          content: error.message,
        });
      },
    }
  );

  const handleGetCaptcha = async () => {
    try {
      const values = await formRefDeleteTask.current?.validateFields([
        'cellphone',
        'captcha',
      ]);
      sendSms(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const { run: deleteReviewTask, loading: deleteReviewTaskLoading } =
    useRequest(
      (params: any) => {
        return Api.deleteReviewTask(params);
      },
      {
        manual: true,
        onSuccess: response => {
          if (response?.message) {
            messageApi.open({
              type: 'error',
              content: response.message,
            });
          } else if (response?.result === 0) {
            onRefresh();
          }
        },
      }
    );

  const handleFinish = (values: any) => {
    const params = {
      taskId: taskId,
      verifyCode: values.verifyCode,
      currentSystemId: currentSystem!.systemId,
      currentOrgId: currentOrg!.orgId,
    };
    deleteReviewTask(params);
  };

  useEffect(() => {
    if (open) {
      getCaptcha();
      formRefDeleteTask.current?.resetFields();
      formRefDeleteTask.current?.setFieldsValue({
        cellphone: user?.cellphone,
      });
    }
  }, [getCaptcha, open, user?.cellphone]);

  return (
    <>
      {contextHolder}
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        取消
      </a>
      <Modal
        open={open}
        title="取消资料抽检任务"
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        // destroyOnClose
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <p className="my-4">为了避免您的误操作，请输入验证码!</p>
        <ProForm
          layout="vertical"
          formRef={formRefDeleteTask}
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '确 定',
            },
            submitButtonProps: {
              loading: deleteReviewTaskLoading,
              size: 'large',
              style: {
                float: 'right',
                padding: '0 24px',
              },
            },
            render: (_, dom) => <div className="h-8">{dom[1]}</div>,
          }}
          hideRequiredMark
        >
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined />,
            }}
            disabled
            name="cellphone"
            placeholder={'请输入手机号！'}
            rules={[
              {
                required: true,
                message: '手机号是必填项！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '不合法的手机号！',
              },
            ]}
          />
          <div className="flex gap-2 items-start">
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <CodepenOutlined />,
                style: { width: 360 },
              }}
              name="captcha"
              placeholder={'请输入右侧图形码！'}
              rules={[
                {
                  required: true,
                  message: '请输入图形码！',
                },
              ]}
            />
            {captchaUrl && (
              <div
                onClick={getCaptcha}
                className="overflow-hidden cursor-pointer"
              >
                <Image src={captchaUrl} alt="Captcha" width={120} height={40} />
              </div>
            )}
          </div>

          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            captchaProps={{
              size: 'large',
            }}
            placeholder={'请输入验证码！'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'秒后重新获取'}`;
              }
              return '获取验证码';
            }}
            name="verifyCode"
            rules={[
              {
                required: true,
                message: '验证码是必填项！',
              },
            ]}
            onGetCaptcha={async phone => {
              handleGetCaptcha();
            }}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default TaskDeleteModal;
