import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWR from 'swr';

type LoginParams = {
  loginType: number;
  cellphone: string;
  password: string;
};

/**
 * useCollectionLogin
 * @param params
 * @returns
 */

export default function useCollectionLogin(params: LoginParams) {
  return useSWR(
    params != null ? ['/api/collection/login/user-login', params] : null,
    ([url, params]) => request.post<ResponseObject>(url, { params })
  );
}
