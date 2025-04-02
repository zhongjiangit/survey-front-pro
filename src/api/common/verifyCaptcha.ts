import axios from 'axios';
import { baseUrl } from '../config';
import { CommonResponseType } from '@/types/ResponseType';
interface VerifyCaptchaResponse {
  passed: 1 | 0;
}
function verifyCaptcha(captcha: string) {
  return axios.post<CommonResponseType<VerifyCaptchaResponse>>(
    baseUrl + '/common/verifyCaptcha',
    { captcha }
  );
}

export default verifyCaptcha;
