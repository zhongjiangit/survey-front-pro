import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface ListReviewAssignByExpertParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
    []json		
    expertId	int		专家id
    expertName	string		专家名称
    cellphone	string		专家手机号
    assignedFills	[]json		已分配试题
      singleFillId	int		试题id
      fillIndex	int		试题编号
      orgName	string		填报人单位名称
      staffId	int		填报人id
      staffName	string		填报人名称
*/
export interface ListReviewAssignByExpertResponse {
  expertId: number;
  expertName: string;
  cellphone: string;
  assignedFills: {
    singleFillId: number;
    fillIndex: number;
    orgName: string;
    staffId: number;
    staffName: string;
  }[];
}

/**
 * listReviewAssignByExpert
 * @param params
 * @returns
 */
function listReviewAssignByExpert(params: ListReviewAssignByExpertParamsType) {
  return SurveyService.post<
    CommonResponseType<ListReviewAssignByExpertResponse[]>
  >(`${baseUrl}/task/listReviewAssignByExpert`, {
    ...params,
  });
}

export default listReviewAssignByExpert;
