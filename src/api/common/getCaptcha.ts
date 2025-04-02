import axios from 'axios';
import { baseUrl } from '../config';

let captchaNum = Date.now();
export function getCaptchaUrl() {
  return baseUrl + '/common/getCaptcha?_r=' + (captchaNum += 1);
}
function getCaptcha() {
  return axios.post(getCaptchaUrl(), null, {
    responseType: 'blob',
    withCredentials: true,
  });
}

export default getCaptcha;
