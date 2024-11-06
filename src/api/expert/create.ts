import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

type TagsType = {
  key: number;
};

interface ExpertCreateParamsType {
  currentSystemId: number;
  currentOrgId: number;
  expertName: string;
  cellphone: string;
  tags?: TagsType[];
}

interface ExpertCreateResponse {
  id: number;
}

/**
 * createExpert
 * @param params
 * @returns
 */

function createExpert(params: ExpertCreateParamsType) {
  return SurveyService.post<CommonResponseType<ExpertCreateResponse>>(
    `${baseUrl}/expert/create`,
    {
      ...params,
    }
  );
}

export default createExpert;
