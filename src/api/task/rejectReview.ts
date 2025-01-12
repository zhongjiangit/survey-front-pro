import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
expertId	int		评审专家id
rejectComment	string		驳回原因
*/

interface rejectReviewParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
  expertId: number;
  rejectComment: string;
}

/**
 * rejectReview
 * @param params
 * @returns
 */
function rejectReview(params: rejectReviewParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/rejectReview`,
    {
      ...params,
    }
  );
}

export default rejectReview;
