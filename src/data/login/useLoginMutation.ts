import { ResponseObject } from '@/interfaces';
import { UserType } from '@/interfaces/SystemType';
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
    '/api/login/user-login',
    (
      url,
      { arg: { loginType, cellphone, password } }: { arg: LoginParamsType }
    ) =>
      request
        .post<ResponseObject<UserType>>(url, {
          loginType,
          cellphone,
          password,
        })
        .catch(e => {
          console.error('useLoginMutation error', e);
        })
  );
}
