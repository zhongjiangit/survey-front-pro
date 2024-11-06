import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
  return SurveyService.post<CommonResponseType>(`${baseUrl}/expert/update`, {
    ...params,
  });
}
export default updateExpert;
