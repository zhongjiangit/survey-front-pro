import { SurveyService } from '@/service';
import { OperationType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

export interface TagSaveParamsType {
  currentSystemId: number;
  operationType: OperationType; // 操作类型 1:新增 2:删除 3:修改
  operationOrgId?: number;
  orgs: TagsType;
}

type TagsType = {
  key?: number;
  title: string;
  children: TagsType[];
};
interface TagCreateResponse {
  orgs: TagsType;
}

function saveOrgTree(params: TagSaveParamsType) {
  return SurveyService.post<CommonResponseType<TagCreateResponse>>(
    `${baseUrl}/org/save`,
    {
      ...params,
    }
  );
}

export default saveOrgTree;
