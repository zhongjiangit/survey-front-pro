'use client';
import logo from '@/assets/icons/logo.png';
import {
  CodepenOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm as Form,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import Image from 'next/image';
import { useActionState, useEffect, useState } from 'react';
import { authenticate } from '../../lib/actions';

import { message, Tabs } from 'antd';
import { FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  useEffect(() => {
    messageApi.open({
      type: 'error',
      content: errorMessage,
    });
  }, [errorMessage, messageApi]);

  const [type, setType] = useState<string>('account');

  return (
    <div className="w-96 md:-mt-[16vh] md:py-8 md:w-[28rem] md:shadow-2xl rounded-lg">
      {contextHolder}
      <Form
        contentStyle={{
          minWidth: 280,
          maxWidth: '75vw',
        }}
        logo={<Image alt="logo" src={logo} />}
        title={<Link href="/">试题抽检与征集</Link>}
        subTitle={
          <div className="text-gray-800 dark:text-gray-100">
            教育督导评估信息化平台集群
          </div>
        }
        initialValues={{
          autoLogin: true,
        }}
        onFinish={formAction}
        loading={isPending}
      >
        <Tabs
          activeKey={type}
          onChange={setType}
          centered
          items={[
            {
              key: 'account',
              label: '账户密码登录',
            },
            {
              key: 'mobile',
              label: '手机验证码登录',
            },
          ]}
        />

        {type === 'account' && (
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={'用户名: xxx xxxx xxxx'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={'密码: ******'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
            <div className="mt-6 flex justify-between items-center">
              <a className="flex gap-1 items-center hover:scale-105">
                <span>系统试用</span> <FlaskConical className="w-4" />
              </a>
              <a
                className="float-right my-2 hover:scale-105"
                onClick={() => {
                  setType('mobile');
                }}
              >
                忘记密码 ?
              </a>
            </div>
          </>
        )}

        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined />,
              }}
              name="mobile"
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
                }}
                name="verification"
                placeholder={'请输入右侧图形码！'}
                rules={[
                  {
                    required: true,
                    message: '请输入图形码！',
                  },
                ]}
              />
              {/* <Image
                width={124}
                height={40}
                alt="captcha"
                style={{ cursor: 'pointer', borderRadius: 4 }}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              /> */}
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
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async phone => {
                // const result = await getFakeCaptcha({
                //   phone,
                // });
                // if (!result) {
                //   return;
                // }
                console.log(phone);

                message.success('获取验证码成功！验证码为：1234');
              }}
            />
            <div className="mt-6 mb-2 flex justify-between items-center">
              <a className="flex gap-1 items-center hover:scale-105">
                <span>系统试用</span> <FlaskConical className="w-4" />
              </a>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
