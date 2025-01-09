import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/**
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
orgId	int		要查询的单位id
tags	[]json		标签
  key	int		标签id
 */
interface GetExpertListByTagsParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
  tags: CustomTreeDataNode[];
  showUntagged?: 0 | 1;
}

/**
	[]json		
  id	int		专家id
  expertName	string		专家名称
  cellphone	string		电话号码
  tags	[]json		标签
    key	int		标签id
    title	string		标签名称
 */
export interface GetExpertListByTagsResponse {
  id: number;
  expertName: string;
  cellphone: string;
  tags: CustomTreeDataNode[];
}

/**
 * getExpertListByTags
 * @param params
 * @returns
 */
function getExpertListByTags(params: GetExpertListByTagsParamsType) {
  return SurveyService.post<CommonResponseType<GetExpertListByTagsResponse[]>>(
    `${baseUrl}/expert/listByTags`,
    {
      ...params,
    }
  );
}

export default getExpertListByTags;
