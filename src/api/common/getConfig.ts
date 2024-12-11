import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';
const p = SurveyService.post<CommonResponseType>(`${baseUrl}/common/getConfig`);
export function getConfig() {
  return p;
}
export default getConfig;
