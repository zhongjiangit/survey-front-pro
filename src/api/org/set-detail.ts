import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

export interface TagCreateParamsType {
  currentSystemId: number;
  orgId: number;
  managerName?: string;
  cellphone?: string;
  isValid: 1 | 0;
  tags?: number[];
}

function setOrgDetail(params: TagCreateParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/org/set`, {
    ...params,
  });
}

export default setOrgDetail;
