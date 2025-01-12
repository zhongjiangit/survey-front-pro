import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
expertId	int		评审专家id
*/

interface ApproveReviewParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
  expertId: number;
}

/**
 * approveReview
 * @param params
 * @returns
 */
function approveReview(params: ApproveReviewParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/approveReview`,
    {
      ...params,
    }
  );
}

export default approveReview;
