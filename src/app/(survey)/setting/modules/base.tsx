'use client';

import Api from '@/api';
import CloseWarning from '@/components/display/close-warning';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { Role_Type } from '@/types/CommonType';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const BaseView: React.FC = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const setCurrentRole = useSurveyCurrentRoleStore(
    state => state.setCurrentRole
  );
  const setCurrentSystem = useSurveySystemStore(
    state => state.setCurrentSystem
  );
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

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

  const { run: changeUserName } = useRequest(
    params => {
      return Api.changeUserName(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          setShowCloseWarning(true);
          setTimeout(() => {
            setShowCloseWarning(false);
            loginOut();
          }, 5000);
        } else {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        }
      },
    }
  );

  const handleFinish = async (values: any) => {
    console.log('values', values);
    if (!currentRole?.key) {
      messageApi.error('当前角色不存在');
      return;
    }
    const params = {
      ...values,
      currentSystemId: currentSystem?.systemId,
      currentOrgId: currentOrg?.orgId,
      currentRoleId: Role_Type[currentRole.key as keyof typeof Role_Type],
    };
    changeUserName(params);
  };
  return (
    <div className="flex pt-3">
      {contextHolder}
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
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="userNameNew"
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
      {showCloseWarning && <CloseWarning />}
    </div>
  );
};
export default BaseView;
