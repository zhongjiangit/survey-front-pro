import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
verifyCode	string		手机验证码
passwordNew	string		新密码
 */
interface ChangeUserPasswordParamsType {
  verifyCode: string;
  passwordNew: string;
}

interface ChangeUserPasswordResponse {}

/**
 * changeUserPassword
 * @param params
 * @returns
 */

function changeUserPassword(params: ChangeUserPasswordParamsType) {
  return SurveyService.post<CommonResponseType<ChangeUserPasswordResponse>>(
    `${baseUrl}/setting/changeUserPassword`,
    {
      ...params,
    }
  );
}

export default changeUserPassword;
