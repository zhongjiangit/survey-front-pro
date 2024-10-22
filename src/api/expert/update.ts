import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

type TagsType = {
  key: number;
};

interface ExpertUpdateParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
  expertName: string;
  cellphone: string;
  tags?: TagsType[];
}

/**
 * updateExpert
 * @param params
 * @returns
 */

function updateExpert(params: ExpertUpdateParamsType) {
  return SurveyService.post<CommonResponseType>('/api/expert/update', {
    ...params,
  });
}
export default updateExpert;
