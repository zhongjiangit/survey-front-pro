'use client';

import { originMenus } from '@/components/common/side-nav/nav-links';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { Button, Result } from 'antd';
import { useMemo } from 'react';

/**
 * 无权限页面
 * @constructor
 */
const Forbidden = () => {
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);

  const firstMenu = useMemo(() => {
    const paths = originMenus.filter(item => {
      if (item.access.includes(currentRole?.key as string)) {
        if (item.children) {
          item.children = item.children.filter(child =>
            child.access.includes(currentRole?.key as string)
          );
        }
        return true;
      }
      return false;
    });
    return paths[0].children ? paths[0].children[0].key : paths[0].key;
  }, [currentRole?.key]);

  return (
    <Result
      title="403"
      status="403"
      subTitle="对不起，你无权访问该页面"
      extra={
        <Button type="primary" href={firstMenu}>
          返回首页
        </Button>
      }
    />
  );
};

export default Forbidden;
