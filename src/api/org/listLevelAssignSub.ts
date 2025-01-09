import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/**
 currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
levelIndex	int		下级单位所在层级序号
tags	[]json		标签
  tagId	int		标签id
 */
export interface ListLevelAssignSubParamsType {
  currentSystemId: number;
  currentOrgId: number;
  levelIndex: number;
  tags?: {
    key: number;
  }[];
  staffTags?: {
    key: number;
  }[];
  showUntagged?: 0 | 1;
}

/**
  	[]json		单位数组
  orgId	int		单位id
  orgName	string		单位名称
 */
export interface ListLevelAssignSubResponse {
  orgId: number;
  orgName: string;
}

/**
 * listLevelAssignSub
 * @param params
 * @returns
 */
function listLevelAssignSub(params: ListLevelAssignSubParamsType) {
  return SurveyService.post<CommonResponseType<ListLevelAssignSubResponse[]>>(
    `${baseUrl}/org/listLevelAssignSub`,
    {
      ...params,
    }
  );
}

export default listLevelAssignSub;
