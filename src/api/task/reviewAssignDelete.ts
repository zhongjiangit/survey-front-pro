import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
assigns	[]json		要删除的分配
  singleFillId	int		试题id
  expertId	int		专家id
*/

interface ReviewAssignDeleteParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  assigns: {
    singleFillId: number;
    expertId: number;
  }[];
}

/*

*/
export interface ReviewAssignDeleteResponse {}

/**
 * reviewAssignDelete
 * @param params
 * @returns
 */
function reviewAssignDelete(params: ReviewAssignDeleteParamsType) {
  return SurveyService.post<CommonResponseType<ReviewAssignDeleteResponse>>(
    `${baseUrl}/task/reviewAssignDelete`,
    {
      ...params,
    }
  );
}

export default reviewAssignDelete;
