import { SurveyService } from '@/service';
import { UserType } from '@/types/SystemType';
import { baseUrl } from '../config';

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
  return SurveyService.post<userInfoType>(`${baseUrl}/login/userLogin`, {
    ...params,
  });
}

export function logout() {
  // return SurveyService.post<userInfoType>(`${baseUrl}/logout`);
}

const loginApi = {
  login,
  // logout,
};

export default loginApi;
