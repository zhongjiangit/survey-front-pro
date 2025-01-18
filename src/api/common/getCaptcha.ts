import axios from 'axios';
import { baseUrl } from '../config';

function getCaptcha() {
  return axios.post(`${baseUrl}/common/getCaptcha`, null, {
    responseType: 'blob',
    withCredentials: true,
  });
}

export default getCaptcha;
