import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

interface ExpertDeleteParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
}

/**
 * deleteExpert
 * @param params
 * @returns
 */

function deleteExpert(params: ExpertDeleteParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/expert/delete`, {
    ...params,
  });
}
export default deleteExpert;
