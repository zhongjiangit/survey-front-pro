import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

export function sendSms(params: any) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/common/sendSms`, {
    ...params,
  });
}
export default sendSms;
