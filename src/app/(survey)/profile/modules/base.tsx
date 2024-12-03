'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';

const BaseView: React.FC = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };
  return (
    <div className="flex pt-3">
      <div className="flex flex-col gap-4 min-w-56 max-w-96">
        <div>
          <span>现有名称：</span>
          <span>{currentRole?.name}</span>
        </div>
        <ProForm
          layout="horizontal"
          onFinish={handleFinish}
          submitter={{
            searchConfig: {
              submitText: '更新信息',
            },
            render: (_, dom) => dom[1],
          }}
          initialValues={
            {
              // ...currentUser,
            }
          }
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="name"
            label="新名称"
            rules={[
              {
                required: true,
                message: '请输入您的昵称!',
              },
            ]}
          />
        </ProForm>
      </div>
    </div>
  );
};
export default BaseView;
