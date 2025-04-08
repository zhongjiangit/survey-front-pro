'use client';
import Api from '@/api';
import CloseWarning from '@/components/display/close-warning';
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
import { message } from 'antd';
import { Key } from 'lucide-react';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useCaptcha from '@/hooks/useCaptcha';

const SecurityView: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [user, setUser] = useSurveyUserStore(state => [
    state.user,
    state.setUser,
  ]);

  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const formRefPassword = useRef<ProFormInstance>();

  const {
    captchaUrl,
    captchaCode,
    setCaptchaCode,
    getCaptcha,
    sendSms,
    validateCaptchaRes,
  } = useCaptcha({ eventType: SendSmsTypeEnum.ChangePassword, messageApi });
  /**
   * 退出登录
   */
  const loginOut = () => {
    setUser(null);
  };

  const handleGetCaptcha = async () => {
    try {
      const values = await formRefPassword.current?.validateFields([
        'cellphone',
        'captcha',
      ]);
      sendSms(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const { run: changeUserPassword, loading: changeUserPasswordLoading } =
    useRequest(
      (params: any) => {
        return Api.changeUserPassword(params);
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
            setShowCloseWarning(true);
            setTimeout(() => {
              setShowCloseWarning(false);
              loginOut();
            }, 1500);
          }
        },
      }
    );

  const handleFinish = (values: any) => {
    const params = {
      verifyCode: values.verifyCode,
      passwordNew: values.passwordNew,
    };
    changeUserPassword(params);
  };

  useEffect(() => {
    getCaptcha();
    formRefPassword.current?.resetFields();
    formRefPassword.current?.setFieldsValue({
      cellphone: user?.cellphone,
    });
  }, [getCaptcha, user?.cellphone]);

  return (
    <div className="flex pt-3">
      {contextHolder}
      <div className="flex flex-col gap-4 min-w-56 max-w-96">
        <ProForm
          layout="vertical"
          formRef={formRefPassword}
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '更新密码',
            },
            submitButtonProps: {
              loading: changeUserPasswordLoading,
              size: 'large',
            },
            render: (_, dom) => dom[1],
          }}
          hideRequiredMark
        >
          <ProFormText
            name="passwordNew"
            placeholder={'请输入新密码'}
            fieldProps={{
              size: 'large',
              prefix: <Key className="w-4 h-4" />,
            }}
            rules={[
              {
                required: true,
                message: '请输入您的新密码!',
              },
            ]}
          />
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
                value: captchaCode,
                maxLength: 4,
                onChange: (e: any) => {
                  setCaptchaCode(e.target.value);
                },
              }}
              name="captcha"
              placeholder={'请输入右侧图形码！'}
              validateStatus={validateCaptchaRes ? 'error' : ''}
              help={validateCaptchaRes}
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
              disabled: !!validateCaptchaRes,
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
      </div>
      {showCloseWarning && <CloseWarning />}
    </div>
  );
};
export default SecurityView;
