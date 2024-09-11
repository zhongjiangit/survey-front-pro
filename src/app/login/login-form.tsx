'use client';

import logo from '@/src/assets/icons/logo.png';
import business from '@/src/assets/images/business.svg';
import computer from '@/src/assets/images/computer.svg';
import magnifying from '@/src/assets/images/magnifying.svg';
import person from '@/src/assets/images/person.svg';
import road from '@/src/assets/images/road.svg';
import Footer from '@/src/components/footer';

import {
  CodepenOutlined,
  FormOutlined,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Tabs } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');

  const handleSubmit = async () => {
    console.log(111);
  };
  return (
    <div
      style={{
        backgroundImage:
          "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
        backgroundSize: '100% 100%',
      }}
      className="flex flex-col h-lvh overflow-auto"
    >
      <div className="flex justify-center items-center h-full">
        <div className="text-center w-1/2 pl-20">
          <Image src={business} alt="business" className="p-4" />
          <div className="flex gap-2 m-4">
            <Card
              onClick={() => {
                window.open('https://dxjy.online/', '_blank');
              }}
              bordered={false}
              hoverable
              style={{ width: '50%', backgroundColor: '#e6f4ff' }}
            >
              <div className="flex gap-2 justify-center font-extrabold text-[#595959]">
                <Image src={computer} width={24} alt="img" />
                平台服务
              </div>
              <div className="mt-1 text-xs text-[#8c8c8c]">
                打造智慧督导创新平台
              </div>
            </Card>
            <Card
              onClick={() => {
                window.open('https://dxjy.online/', '_blank');
              }}
              bordered={false}
              hoverable
              style={{ width: '50%', backgroundColor: '#e6f4ff' }}
            >
              <div className="flex gap-2 justify-center font-extrabold text-[#595959]">
                <Image src={magnifying} width={24} alt="img" />
                数据采集与挖掘
              </div>
              <div className="mt-1 text-xs text-[#8c8c8c]">
                你身边的教育数据治理专家
              </div>
            </Card>
          </div>
          <div style={{ display: 'flex', gap: '8px', margin: '16px' }}>
            <Card
              onClick={() => {
                window.open('https://dxjy.online/', '_blank');
              }}
              bordered={false}
              hoverable
              style={{ width: '50%', backgroundColor: '#e6f4ff' }}
            >
              <div className="flex gap-2 justify-center font-extrabold text-[#595959]">
                <Image src={road} width={24} alt="img" />
                学校发展咨询
              </div>
              <div className="mt-1 text-xs text-[#8c8c8c]">
                学校特色发展的指导师
              </div>
            </Card>
            <Card
              onClick={() => {
                window.open('https://dxjy.online/', '_blank');
              }}
              bordered={false}
              hoverable
              style={{ width: '50%', backgroundColor: '#e6f4ff' }}
            >
              <div className="flex gap-2 justify-center font-extrabold text-[#595959]">
                <Image src={person} width={24} alt="img" />
                教育决策咨询
              </div>
              <div className="mt-1 text-xs text-[#8c8c8c]">
                区域教育发展的智囊团
              </div>
            </Card>
          </div>
        </div>
        <div className="flex justify-center items-center flex-1 w-1/2">
          <div className="w-[28rem] py-8 rounded-md shadow-xl">
            <LoginForm
              contentStyle={{
                minWidth: 280,
                maxWidth: '75vw',
              }}
              logo={<Image alt="logo" src={logo} />}
              title="试题抽检与征集"
              subTitle={'教育督导评估信息化平台集群'}
              initialValues={{
                autoLogin: true,
              }}
              actions={
                <a className="text-gray-500 text-sm flex gap-1">
                  <div>系统试用</div>
                  <FormOutlined />
                </a>
              }
              onFinish={async values => {
                // @ts-ignore
                await handleSubmit(values as API.LoginParams);
              }}
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
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={'用户名: admin or user'}
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
                    placeholder={'密码: ant.design'}
                    rules={[
                      {
                        required: true,
                        message: '密码是必填项！',
                      },
                    ]}
                  />
                  <div className="mb-6">
                    <a
                      className="float-right mb-2"
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
                      placeholder={'请输入图形码！'}
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
                      alt="img"
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
                      return;
                    }}
                  />
                </>
              )}
            </LoginForm>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
