import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

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
  return SurveyService.post<CommonResponseType>('/api/expert/delete', {
    ...params,
  });
}
export default deleteExpert;
