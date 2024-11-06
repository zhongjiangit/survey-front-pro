import { SurveyService } from '@/service';
import { ZeroOrOneType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
  isValid: ZeroOrOneType;
  tags: TagsType[];
}

function getOrgDetails(params: DetailParamsType) {
  return SurveyService.post<CommonResponseType<DetailType>>(
    `${baseUrl}/org/get`,
    {
      ...params,
    }
  );
}

export default getOrgDetails;
