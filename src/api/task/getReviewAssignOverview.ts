import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/
interface ReviewAssignOverviewParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
totalExpertCount	int		专家总数
assignedExpertCount	int		已分配专家数
unassignedExpertCount	int		未分配专家数
totalSingleFillCount	int		试题总数
assignedSingleFillCount	int		已分配试题数
unassignedSingleFillCount	int		未分配试题数
*/
export interface ReviewAssignOverviewResponse {
  totalExpertCount: number;
  assignedExpertCount: number;
  unassignedExpertCount: number;
  totalSingleFillCount: number;
  assignedSingleFillCount: number;
  unassignedSingleFillCount: number;
}

/**
 * listFillsByTaskPage
 * @param params
 * @returns
 */
function getReviewAssignOverview(params: ReviewAssignOverviewParamsType) {
  return SurveyService.post<CommonResponseType<ReviewAssignOverviewResponse>>(
    `${baseUrl}/task/getReviewAssignOverview`,
    {
      ...params,
    }
  );
}

export default getReviewAssignOverview;
