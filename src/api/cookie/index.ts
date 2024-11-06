import { SurveyService } from '@/service';
import { UserType } from '@/types/SystemType';

interface userInfoType {
  result: number;
  message?: string;
  data: UserType;
  total: number;
}

export function getCookie() {
  return SurveyService.post<userInfoType>(
    'http://8.137.101.138:19080/login/userLogin',
    {
      cellphone: '13982088460',
      loginType: 1,
      password: '123456',
    }
  );
}

const CookieApi = {
  getCookie,
};

export default CookieApi;
