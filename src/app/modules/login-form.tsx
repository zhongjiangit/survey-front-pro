'use client';

import Api from '@/api';
import logo from '@/assets/icons/logo.png';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
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
import { useRequest } from 'ahooks';
import { message, Tabs } from 'antd';
import { FlaskConical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const setUser = useSurveyUserStore(state => state.setUser);
  const setCurrentSystem = useSurveySystemStore(
    state => state.setCurrentSystem
  );
  const setCurrentOrg = useSurveyOrgStore(state => state.setCurrentOrg);

  const { run, loading } = useRequest(
    params => {
      return Api.login(params);
    },
    {
      manual: true,
      onSuccess: response => {
        if (response?.message) {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        } else if (response?.data) {
          setUser(response.data);
          setCurrentSystem(response.data.systems[0]);
          setCurrentOrg(response.data.systems[0].orgs[0]);
          router.push('/system');
        }
      },
    }
  );

  const [type, setType] = useState<string>('account');

  return (
    <div className="w-96 md:shadow-2xl rounded-lg">
      {contextHolder}
      <Form
        contentStyle={{
          minWidth: 280,
          width: 320,
          maxWidth: '75vw',
        }}
        className="overflow-hidden"
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
        onFinish={values => {
          run({
            loginType: type === 'account' ? 1 : 2,
            cellphone: values.cellphone,
            password: values.password,
          });
        }}
        loading={loading}
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
          <div>
            <ProFormText
              name="cellphone"
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
          </div>
        )}

        {type === 'mobile' && (
          <div>
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
          </div>
        )}
      </Form>
    </div>
  );
}
