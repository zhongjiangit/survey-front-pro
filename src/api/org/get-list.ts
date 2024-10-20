import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

export interface ListParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
}

export interface TagListType {
  orgs: CustomTreeDataNode;
}

function getOrgList(params: ListParamsType) {
  return SurveyService.post<CommonResponseType<TagListType>>('/api/org/list', {
    ...params,
  });
}

export default getOrgList;
