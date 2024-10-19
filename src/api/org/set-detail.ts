import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

export interface TagCreateParamsType {
  currentSystemId: number;
  orgId: number;
  managerName?: string;
  cellphone?: string;
  isValid: 1 | 0;
  tags?: number[];
}

function setOrgDetail(params: TagCreateParamsType) {
  return SurveyService.post<CommonResponseType>('/api/org/set', {
    ...params,
  });
}

export default setOrgDetail;
