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
interface GetStaffListByTagsParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
  orgId?: number;
  tags: CustomTreeDataNode[] | { key: number }[];
}

/**
 	[]json		成员数组
  id	int		成员id
  staffName	string		成员名称
  cellphone	string		电话号码
 */
export interface GetStaffListByTagsResponse {
  id: number;
  staffName: string;
  cellphone: string;
}

/**
 * getStaffListByTags
 * @param params
 * @returns
 */
function getStaffListByTags(params: GetStaffListByTagsParamsType) {
  return SurveyService.post<CommonResponseType<GetStaffListByTagsResponse[]>>(
    `${baseUrl}/staff/listByTags`,
    {
      ...params,
    }
  );
}

export default getStaffListByTags;
