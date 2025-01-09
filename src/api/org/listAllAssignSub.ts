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
    key: number;
  }[];
  staffTags?: { key: number }[];
  showUntagged?: 0 | 1;
}

/**
  		[]json		层级数组
  levelIndex	int		下级单位所在层级序号
  levelName	string		层级名称
  orgs	[]json		单位数组
    orgId	int		单位id
    orgName	string		单位名称
    staffCount  int		单位人数

 */
export interface ListAllAssignSubResponse {
  levelIndex: number;
  levelName: string;
  orgs: {
    orgId: number;
    orgName: string;
    staffCount: number;
  }[];
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
