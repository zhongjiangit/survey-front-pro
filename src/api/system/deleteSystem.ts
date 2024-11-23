import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

type SystemDeleteParamsType = {
  id: number;
};

/**
 * deleteSystem
 * @param params
 * @returns
 */
function deleteSystem(params: SystemDeleteParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/system/delete`, {
    ...params,
  });
}

export default deleteSystem;
