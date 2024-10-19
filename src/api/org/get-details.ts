import { ZeroOrOne } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

export interface DetailParamsType {
  currentSystemId?: number;
  orgId?: number;
}

type TagsType = {
  key: number;
  title: string;
};
export interface DetailType {
  managerName: string;
  cellphone: string;
  isValid: ZeroOrOne;
  tags: TagsType[];
}

function getOrgDetails(params: DetailParamsType) {
  return SurveyService.post<CommonResponseType<DetailType>>('/api/org/get', {
    ...params,
  });
}

export default getOrgDetails;
