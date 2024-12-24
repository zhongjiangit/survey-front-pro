import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface ListReviewAssignByFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  pageNumber: number;
  pageSize: number;
  orgTags?: { key: number | string }[];
  staffTags?: { key: number | string }[];
}

/*
	[]json		
singleFillId	int		试题id
orgName	string		填报人单位名称
staffId	int		填报人id
staffName	string		填报人名称
fillIndex	int		试题编号
assignedExperts	[]json		已分配专家
  expertId	int		专家id
  expertName	string		专家名称
  cellphone	string		专家手机号
*/
export interface ListReviewAssignByFillResponse {
  singleFillId: number;
  orgName: string;
  staffId: number;
  staffName: string;
  fillIndex: number;
  assignedExperts: {
    expertId: number;
    expertName: string;
    cellphone: string;
  }[];
}

/**
 * listReviewAssignByFill
 * @param params
 * @returns
 */
function listReviewAssignByFill(params: ListReviewAssignByFillParamsType) {
  return SurveyService.post<
    CommonResponseType<ListReviewAssignByFillResponse[]>
  >(`${baseUrl}/task/listReviewAssignByFill`, {
    ...params,
  });
}

export default listReviewAssignByFill;
