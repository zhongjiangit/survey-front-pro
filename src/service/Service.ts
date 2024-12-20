import {
  DataType,
  ReqFulfilledType,
  ResFulfilledType,
  ServiceConstructor,
  ServiceReqConfig,
} from '@/types/Service';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import merge from 'lodash/merge';
import defaultResRejected from './Error';

const baseURL = '';

const timeout = 10 * 1000;

const withCredentials = true;

const responseType = 'json';

// 请求体处理
const defaultReqFulfilled: ReqFulfilledType = config => {
  return config;
};

// 响应体处理
const defaultResFulfilled: ResFulfilledType = response => {
  if (response.data.result === 101) {
    // 清空localhost缓存
    localStorage.clear();
    // 未登录, 跳转登录页
    window.location.href = '/';
  }
  return response.data;
};

const defaultConfig: ServiceReqConfig = {
  baseURL,
  timeout,
  withCredentials,
  responseType,
  showMsg: true,
};

export default class Service {
  private axios: AxiosInstance;
  constructor({
    onReqFulfilled = defaultReqFulfilled,
    onResFulfilled = defaultResFulfilled,
    onResRejected = defaultResRejected,
  }: ServiceConstructor = {}) {
    this.axios = axios.create(merge({}, defaultConfig));
    // @ts-ignore
    this.axios.interceptors.request.use(onReqFulfilled);
    // @ts-ignore
    this.axios.interceptors.response.use(onResFulfilled, onResRejected);
  }

  get<T, R = T>(url: string, params: DataType = {}) {
    return this.axios.get<T, R>(url, { params });
  }

  post<T, R = T>(url: string, data: DataType = {}) {
    return this.axios.post<T, R>(url, data);
  }

  put<T, R = T>(url: string, data: DataType = {}) {
    return this.axios.put<T, R>(url, data);
  }

  delete<T, R = T>(url: string, data: DataType = {}) {
    return this.axios.delete<T, R>(url, { data });
  }
}
