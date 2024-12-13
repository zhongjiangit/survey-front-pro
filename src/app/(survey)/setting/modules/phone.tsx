import Api from '@/api';
import CloseWarning from '@/components/display/close-warning';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
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
import { message } from 'antd';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

const Phone: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const user = useSurveyUserStore(state => state.user);

  const [captchaUrlOld, setCaptchaUrlOld] = useState('');

  const [captchaUrlNew, setCaptchaUrlNew] = useState('');

  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const currentSystem = useSurveySystemStore(state => state.currentSystem);

  const setCurrentRole = useSurveyCurrentRoleStore(
    state => state.setCurrentRole
  );

  const setCurrentSystem = useSurveySystemStore(
    state => state.setCurrentSystem
  );

  const formRefPassword = useRef<ProFormInstance>();

  /**
   * 退出登录
   */
  const loginOut = () => {
    setCurrentSystem({
      ...currentSystem,
      systemName: '',
    });
    setCurrentRole({
      id: undefined,
      isActive: false,
      key: '',
      label: '',
      name: undefined,
    });
    // 清空local storage
    localStorage.clear();
    // 跳转到登录页
    router.push('/');
  };

  const { run: getOldCaptcha, loading: getOldCaptchaLoading } = useRequest(
    () => {
      return Api.getCaptcha();
    },
    {
      manual: true,
      onSuccess: response => {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setCaptchaUrlOld(url);
      },
    }
  );

  const { run: getNewCaptcha, loading: getNewCaptchaLoading } = useRequest(
    () => {
      return Api.getCaptcha();
    },
    {
      manual: true,
      onSuccess: response => {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setCaptchaUrlNew(url);
      },
    }
  );

  const { run: sendSms, loading: sendSmsLoading } = useRequest(
    params => {
      return Api.sendSms({
        ...params,
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

  const handleGetCaptcha = async (type: 'new' | 'old') => {
    try {
      if (type === 'old') {
        const values = await formRefPassword.current?.validateFields([
          'captchaOld',
        ]);

        console.log(values);
        const params = {
          captcha: values.captchaOld,
          cellPhone: user?.cellphone,
          eventType: SendSmsTypeEnum.ConfirmOldPhone,
        };
        sendSms(params);
      } else {
        const values = await formRefPassword.current?.validateFields([
          'cellphoneNew',
          'captchaNew',
        ]);
        const params = {
          captcha: values.captchaNew,
          cellPhone: values.cellphoneNew,
          eventType: SendSmsTypeEnum.ConfirmNewPhone,
        };
        sendSms(params);
      }
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
    getNewCaptcha();
    getOldCaptcha();
    formRefPassword.current?.resetFields();
  }, [getNewCaptcha, getOldCaptcha]);

  return (
    <div className="flex pt-3">
      <div className="flex flex-col gap-4 min-w-56 max-w-96">
        <ProForm
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
              }}
              name="captchaOld"
              placeholder={'请输入右侧图形码！'}
              rules={[
                {
                  required: true,
                  message: '请输入图形码！',
                },
              ]}
            />
            {captchaUrlOld && (
              <div
                onClick={getOldCaptcha}
                className="overflow-hidden cursor-pointer"
              >
                <Image
                  src={captchaUrlOld}
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
              handleGetCaptcha('old');
              console.log(phone);
              message.success('获取验证码成功！');
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
            {captchaUrlNew && (
              <div
                onClick={getNewCaptcha}
                className="overflow-hidden cursor-pointer"
              >
                <Image
                  src={captchaUrlNew}
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
              handleGetCaptcha('new');
              message.success('获取验证码成功！验证码为：1234');
            }}
          />
        </ProForm>
      </div>
      {showCloseWarning && <CloseWarning />}
    </div>
  );
};
export default Phone;
