import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

type LoginParamsType = {
  loginType: number;
  cellphone: string;
  password: string;
};

/**
 * useLoginMutation
 * @param params
 * @returns
 */

export default function useLoginMutation() {
  return useSWRMutation(
    'http://8.137.101.138:19080/login/userLogin',
    (
      url,
      { arg: { loginType, cellphone, password } }: { arg: LoginParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          loginType,
          cellphone,
          password,
        })
        .catch(e => {
          console.error('useLoginMutation error', e);
        })
  );
}
