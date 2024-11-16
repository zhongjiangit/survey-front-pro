import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/**
 currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
tags	[]json		标签
  tagId	int		标签id
 */
export interface ListAllAssignSubParamsType {
  currentSystemId: number;
  currentOrgId: number;
  tags?: {
    tagId: number;
  }[];
}

/**
  	[]json		单位数组
  orgId	int		单位id
  orgName	string		单位名称
 */
export interface ListAllAssignSubResponse {
  orgId: number;
  orgName: string;
}

/**
 * listAllAssignSub
 * @param params
 * @returns
 */
function listAllAssignSub(params: ListAllAssignSubParamsType) {
  return SurveyService.post<CommonResponseType<ListAllAssignSubResponse[]>>(
    `${baseUrl}/org/listAllAssignSub`,
    {
      ...params,
    }
  );
}

export default listAllAssignSub;
