'use client';
import {
  ProForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { ShieldCheck } from 'lucide-react';
import React from 'react';

const SecurityView: React.FC = () => {
  const handleFinish = async () => {
    message.success('更新密码成功');
  };
  return (
    <div className="flex pt-3">
      <div className="flex flex-col gap-4 min-w-56 max-w-96">
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '更新密码',
            },
            render: (_, dom) => dom[1],
          }}
          // initialValues={{
          //   ...currentUser,
          // }}
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="password"
            label="新密码"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: (
                <span className="text-gray-500">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              ),
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
              console.log(phone);
              // const result = await getFakeCaptcha({
              //   phone,
              // });
              // if (!result) {
              //   return;
              // }
              message.success('获取验证码成功！验证码为：1234');
            }}
          />
        </ProForm>
      </div>
    </div>
  );
};
export default SecurityView;
