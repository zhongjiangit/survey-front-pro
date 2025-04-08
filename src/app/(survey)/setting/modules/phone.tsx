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
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import useCaptcha from '@/hooks/useCaptcha';

const Phone: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [user, setUser] = useSurveyUserStore(state => [
    state.user,
    state.setUser,
  ]);

  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const formRefPassword = useRef<ProFormInstance>();

  const oldPhoneCaptcha = useCaptcha({
    eventType: SendSmsTypeEnum.ConfirmOldPhone,
    messageApi,
  });
  const newPhoneCaptcha = useCaptcha({
    eventType: SendSmsTypeEnum.ConfirmNewPhone,
    messageApi,
  });
  /**
   * 退出登录
   */
  const loginOut = () => {
    setUser(null);
  };

  const handleGetCaptcha = async () => {
    try {
      const values = await formRefPassword.current?.validateFields([
        'cellphoneNew',
      ]);
      newPhoneCaptcha.sendSms({ cellphone: values.cellphoneNew });
    } catch (errorInfo) {
      // console.log('Failed:', errorInfo);
    }
  };

  const { run: changeUserCellphone, loading: changeUserCellphoneLoading } =
    useRequest(
      (params: any) => {
        return Api.changeUserCellphone(params);
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
      cellphoneOld: user?.cellphone,
      verifyCodeForOld: values.verifyCodeForOld,
      verifyCodeForNew: values.verifyCodeForNew,
      cellphoneNew: values.cellphoneNew,
    };
    changeUserCellphone(params);
  };

  useEffect(() => {
    oldPhoneCaptcha.getCaptcha();
    newPhoneCaptcha.getCaptcha();
    formRefPassword.current?.resetFields();
  }, [oldPhoneCaptcha.getCaptcha, newPhoneCaptcha.getCaptcha]);

  return (
    <div className="flex pt-3">
      {contextHolder}
      <div className="flex flex-col gap-4 min-w-56 max-w-96">
        <ProForm
          formRef={formRefPassword}
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '更新手机号',
            },
            submitButtonProps: {
              loading: changeUserCellphoneLoading,
              size: 'large',
            },
            render: (_, dom) => dom[1],
          }}
          // initialValues={{
          //   ...currentUser,
          // }}
          hideRequiredMark
        >
          <div className="mb-4">现手机号：{user?.cellphone}</div>
          <div className="flex gap-2 items-start">
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <CodepenOutlined />,
                value: oldPhoneCaptcha.captchaCode,
                maxLength: 4,
                onChange: (e: any) => {
                  oldPhoneCaptcha.setCaptchaCode(e.target.value);
                },
              }}
              name="captchaOld"
              placeholder={'请输入右侧图形码！'}
              validateStatus={oldPhoneCaptcha.validateCaptchaRes ? 'error' : ''}
              help={oldPhoneCaptcha.validateCaptchaRes}
            />
            {oldPhoneCaptcha.captchaUrl && (
              <div
                onClick={oldPhoneCaptcha.getCaptcha}
                className="overflow-hidden cursor-pointer"
              >
                <Image
                  src={oldPhoneCaptcha.captchaUrl}
                  alt="CaptchaOld"
                  width={120}
                  height={40}
                />
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
              disabled: !!oldPhoneCaptcha.validateCaptchaRes,
            }}
            placeholder={'请输入旧手机号验证码！'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'秒后重新获取'}`;
              }
              return '获取验证码';
            }}
            name="verifyCodeForOld"
            rules={[
              {
                required: true,
                message: '验证码是必填项！',
              },
            ]}
            onGetCaptcha={async phone => {
              oldPhoneCaptcha.sendSms({ cellphone: user?.cellphone });
            }}
          />
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined />,
            }}
            name="cellphoneNew"
            placeholder={'请输入新手机号！'}
            rules={[
              {
                required: true,
                message: '手机号是必填项！',
              },
              {
                validator: (_, val) => newPhoneCaptcha.validatePhone(val),
                message: '不合法的手机号！',
              },
            ]}
          />
          <div className="flex gap-2 items-start">
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <CodepenOutlined />,
                value: newPhoneCaptcha.captchaCode,
                maxLength: 4,
                onChange: (e: any) => {
                  newPhoneCaptcha.setCaptchaCode(e.target.value);
                },
              }}
              name="captcha"
              placeholder={'请输入右侧图形码！'}
              validateStatus={newPhoneCaptcha.validateCaptchaRes ? 'error' : ''}
              help={newPhoneCaptcha.validateCaptchaRes}
            />
            {newPhoneCaptcha.captchaUrl && (
              <div
                onClick={newPhoneCaptcha.getCaptcha}
                className="overflow-hidden cursor-pointer"
              >
                <Image
                  src={newPhoneCaptcha.captchaUrl}
                  alt="CaptchaNew"
                  width={120}
                  height={40}
                />
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
              disabled:
                !!newPhoneCaptcha.validateCaptchaRes ||
                !newPhoneCaptcha.validatePhoneRes,
            }}
            placeholder={'请输入新手机号验证码！'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'秒后重新获取'}`;
              }
              return '获取验证码';
            }}
            name="verifyCodeForNew"
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
export default Phone;
