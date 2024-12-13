'use client';

import { Modal } from 'antd';
import { useCallback, useEffect } from 'react';

function CloseWarning() {
  const [modal, contextHolder] = Modal.useModal();

  const countDown = useCallback(() => {
    let secondsToGo = 5;

    const instance = modal.success({
      title: '更新成功',
      content: `信息更新成功，系统 ${secondsToGo} 秒钟后即将退出，请重新登录。`,
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `信息更新成功，系统 ${secondsToGo} 秒钟后即将退出，请重新登录。`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  }, [modal]);

  useEffect(() => {
    countDown();
  }, [countDown]);

  return <>{contextHolder}</>;
}

export default CloseWarning;
