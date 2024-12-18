import axios from 'axios';

/**
 * 配置 request 请求时的默认参数,自动携带cookie
 */

const request = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  },
  baseURL: '/',
  withCredentials: true,
});

if (typeof window !== 'undefined') {
  // @ts-expect-error: request might not be in window
  window.request = request;
}
export default request;
