import axios from 'axios';
import { baseUrl } from '../config';

function getExpertList() {
  return axios.post(`${baseUrl}/common/getCaptcha`, null, {
    responseType: 'blob',
    withCredentials: true,
  });
}

export default getExpertList;
