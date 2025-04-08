import { useState } from 'react';
import { useRequest } from 'ahooks';
import Api from '@/api';
import { SendSmsTypeEnum } from '@/types/CommonType';
import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

export default function useCaptcha({
  eventType = SendSmsTypeEnum.Login,
  messageApi,
}: {
  eventType?: SendSmsTypeEnum;
  messageApi?: MessageInstance;
}) {
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaCode, _setCaptchaCode] = useState('');

  // 验证码校验
  const { runAsync: validateCaptcha, data: validateCaptchaRes } = useRequest(
    async (text: string = '') => {
      if (!text.trim()) {
        return '请输入图形码';
      }
      if (text.trim().length < 4) {
        return ' ';
      }
      const res = await Api.verifyCaptcha(text);
      return res.data.data.passed === 1
        ? ''
        : '验证码输入错误或已过期,请刷新！';
    }
  );
  const setCaptchaCode = (code: string) => {
    _setCaptchaCode(code);
    validateCaptcha(code);
  };

  const { run: getCaptcha, loading: getCaptchaLoading } = useRequest(
    () => {
      setCaptchaCode('');
      return Api.getCaptcha();
    },
    {
      manual: true,
      onSuccess: response => {
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        setCaptchaUrl(url);
      },
    }
  );

  const { run: sendSms, loading: sendSmsLoading } = useRequest(
    async params => {
      if (!(await validateCaptcha(captchaCode))) {
        return Api.sendSms({
          ...params,
          captcha: captchaCode,
          eventType: eventType,
        });
      }
      return Promise.reject('');
    },
    {
      manual: true,
      onSuccess: response => {
        (messageApi || message).success('验证码发送成功！');
      },
    }
  );

  // 验证码校验
  const { runAsync: validatePhone, data: validatePhoneRes } = useRequest(
    async (phone: string = '') => {
      return /^1\d{10}$/.test(phone);
    }
  );

  return {
    captchaUrl,
    captchaCode,
    setCaptchaCode,
    getCaptcha,
    getCaptchaLoading,
    sendSms,
    sendSmsLoading,
    validateCaptcha,
    validateCaptchaRes,
    validatePhone,
    validatePhoneRes,
  };
}
