import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

export interface ListParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
}

export interface OrgListType {
  orgs: CustomTreeDataNode;
}

function getOrgList(params: ListParamsType) {
  return SurveyService.post<CommonResponseType<OrgListType>>(
    `${baseUrl}/org/list`,
    {
      ...params,
    }
  );
}

export default getOrgList;
