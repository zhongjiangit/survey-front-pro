import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

interface ConfigResponse {
  maxUploadFileSize: number;
}

let p: Promise<CommonResponseType<ConfigResponse>>;
export function getConfig() {
  if (!p) {
    p = SurveyService.post<CommonResponseType<ConfigResponse>>(
      `${baseUrl}/common/getConfig`
    );
  }
  return p;
}
export default getConfig;
