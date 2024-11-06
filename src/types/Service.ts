import { AnyObject } from '@/typings/type';
import {
  AxiosError,
  AxiosAdapter,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type Method = 'get' | 'post' | 'put' | 'delete';

export type DataType = string | number | AnyObject;

export interface ServiceConstructor {
  config?: AnyObject;
  requestConfig?: ServiceReqConfig;
  responseConfig?: ServiceResConfig;
  onReqFulfilled?: ReqFulfilledType;
  onResFulfilled?: ResFulfilledType;
  onResRejected?: ResRejectedType;
}

export interface ServiceReqConfig extends AxiosRequestConfig {
  showMsg?: boolean;
  adapter?: AxiosAdapter;
  startTime?: number;
}

export type ReqFulfilledType = (config: ServiceReqConfig) => ServiceReqConfig;

// @ts-ignore
export interface ServiceResConfig extends AxiosResponse {
  endTime?: number;
  duration?: number;
  config: ServiceReqConfig;
}

export type ResFulfilledType = (
  response: ServiceResConfig
) => ServiceResConfig | ServiceResConfig['data'];

export type ResRejectedType = (error: AxiosError) => void;

export type State<T> = {
  value: T;
  loading: boolean;
  error: Error;
};

export enum ErrorLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
}
