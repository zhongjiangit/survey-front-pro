'use client';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useMedia } from 'react-use';
import BaseView from './components/base';
import Phone from './components/phone';
import Recharge from './components/recharge';
import SecurityView from './components/security';

type SettingsStateKeys = 'base' | 'security' | 'notification' | 'recharge';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Profile: React.FC = () => {
  const isDesktop = useMedia('(min-width: 1024px)', false);
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    security: '安全设置',
    notification: '手机更换',
    recharge: '充值/续费',
  };
  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });

  useEffect(() => {
    setInitConfig({
      ...initConfig,
      mode: isDesktop ? 'inline' : 'horizontal',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  const getMenu = () => {
    return Object.keys(menuMap).map(item => ({
      key: item,
      label: menuMap[item],
    }));
  };

  const renderChildren = () => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView />;
      case 'security':
        return <SecurityView />;
      case 'notification':
        return <Phone />;
      case 'recharge':
        return <Recharge />;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col lg:flex-row w-full h-[76vh] overflow-auto py-4 rounded-lg">
      <div className="w-full lg:w-56 border-r-0 lg:border-r border-gray-200 dark:border-gray-800">
        <Menu
          mode={initConfig.mode}
          selectedKeys={[initConfig.selectKey]}
          onClick={({ key }) => {
            console.log(key);

            setInitConfig({
              ...initConfig,
              selectKey: key as SettingsStateKeys,
            });
          }}
          items={getMenu()}
        />
      </div>
      <div className="flex-1 py-2 px-0 md:px-10">
        <div className="hidden md:block mb-3 font-medium text-xl leading-7">
          {menuMap[initConfig.selectKey]}
        </div>
        {renderChildren()}
      </div>
    </div>
  );
};
export default Profile;
