'use client';

import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { getFirstMenu } from '@/lib/get-first-menu';
import { Button, Result } from 'antd';

/**
 * 无权限页面
 * @constructor
 */
const Forbidden = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  return (
    <Result
      title="403"
      status="403"
      subTitle="对不起，你无权访问该页面"
      extra={
        <Button type="primary" href={getFirstMenu(currentRole)}>
          返回首页
        </Button>
      }
    />
  );
};

export default Forbidden;
