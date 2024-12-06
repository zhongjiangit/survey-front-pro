import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

type enableSystemParamsType = {
  id: number;
};

/**
 * enableSystem
 * @param params
 * @returns
 */
function enableSystem(params: enableSystemParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/system/enable`, {
    ...params,
  });
}

export default enableSystem;
