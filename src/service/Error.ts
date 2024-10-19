import { ErrorLevel, ResRejectedType } from '@/interfaces/service';
import { message } from 'antd';
import { AxiosError, AxiosRequestConfig } from 'axios';

const CODE_MESSAGE: Record<number, string> = {
  200: '请求成功',
  401: '会话超时或无效token，请重新登陆',
  403: '非法请求',
  404: '请求地址不存在',
  406: '业务异常',
  500: '系统异常',
  503: '服务不可用',
  504: '网关超时',
  600: '系统开小差，请稍后再试',
};

const DEFAULT_ERROR_STATUS = 600;

const resolveResponseMessageBlob = async (error: AxiosError<any>) => {
  return new Promise<string>(res => {
    const type = error.config.responseType;
    if (type === 'blob') {
      const data = error.response?.data;
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const result = JSON.parse(reader.result as string);
          res(result.message);
        } catch (e) {
          res('未知错误');
        }
      };
      reader.readAsText(data);
    } else {
      res(error.response?.data?.message ?? '');
    }
  });
};

const showErrorTips = async (status: number, error: any) => {
  if (status === 401) {
    return;
  }

  // 如果responseType是blob，需要解析成msg字符串
  const msg: string = await resolveResponseMessageBlob(error);

  const level: ErrorLevel = error.response?.data?.level || ErrorLevel.ERROR;

  const showMsg = (error.config as AxiosRequestConfig & { showMsg?: boolean })
    ?.showMsg;

  if (showMsg) {
    level === ErrorLevel.ERROR && message.error(msg || CODE_MESSAGE[status]);
    level === ErrorLevel.WARN && message.warning(msg || CODE_MESSAGE[status]);
  }
};

const handleErrorEffect = (status: number, error: AxiosError) => {
  switch (status) {
    case 401:
      let timer = 0;
      timer = window.setTimeout(() => {
        window.clearTimeout(timer);
        window.location.href = `/logout?redirectUrl=${window.location.pathname}`;
      }, 3000);
      break;
    default:
      throw error;
  }
};

const defaultResRejected: ResRejectedType = async error => {
  const status = error.response?.status || DEFAULT_ERROR_STATUS;

  // 异常提示处理
  await showErrorTips(status, error);
  // 其他异常副作用处理，业务逻辑相关
  handleErrorEffect(status, error);
};

export default defaultResRejected;
