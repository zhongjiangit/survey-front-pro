export interface CommonResponseType<T = any> {
  result: number;
  message?: string;
  data: T;
  total: number;
}
