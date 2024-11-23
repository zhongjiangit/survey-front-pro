import { SurveyService } from '@/service';
import { ZeroOrOneType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

type SystemUpdateParamsType = {
  id: number;
  systemName: string;
  freeTimes: number;
  allowSubInitiate: ZeroOrOneType;
  allowSupCheck: ZeroOrOneType;
  validDate: string;
};

/**
 * updateSystem
 * @param params
 * @returns
 */
function updateSystem(params: SystemUpdateParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/system/update`, {
    ...params,
  });
}

export default updateSystem;
