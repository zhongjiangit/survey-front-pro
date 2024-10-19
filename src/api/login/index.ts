import { UserType } from '@/interfaces/SystemType';
import { SurveyService } from '@/service';
import { message } from 'antd';

interface LoginParamsType {
  loginType: number;
  cellphone: string;
  password: string;
}

interface userInfoType {
  result: number;
  message?: string;
  data: UserType;
  total: number;
}

export function login(params: LoginParamsType) {
  return SurveyService.post<userInfoType>('/api/login/user-login', {
    ...params,
  });
}

export function logout() {
  // return SurveyService.post<userInfoType>('/api/logout');
}

const loginApi = {
  login,
  // logout,
};

export default loginApi;
