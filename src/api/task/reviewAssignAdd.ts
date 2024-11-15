import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
assignedFills	[]json		要分配的试题
  singleFillId	int		试题id
assignedExperts	[]json		要分配的专家
  expertId	int		专家id
*/

interface ReviewAssignAddParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  assignedFills: {
    singleFillId: number;
  }[];
  assignedExperts: {
    expertId: number;
  }[];
}

/*

*/
export interface ReviewAssignAddResponse {}

/**
 * reviewAssignAdd
 * @param params
 * @returns
 */
function reviewAssignAdd(params: ReviewAssignAddParamsType) {
  return SurveyService.post<CommonResponseType<ReviewAssignAddResponse>>(
    `${baseUrl}/task/reviewAssignAdd`,
    {
      ...params,
    }
  );
}

export default reviewAssignAdd;
