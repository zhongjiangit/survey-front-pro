/**
 * 服务端返回状态码
 */
const ResponseCode = {
  SUCCESS: 'success',
} as const;

export interface ResponseObject<T = any> {
  code: (typeof ResponseCode)[keyof typeof ResponseCode];
  message: string;
  data?: T;
  requestId?: string;
}
