import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

// 一键通过专家评分

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillIds	[]int	○	要通过的问卷id，不传表示所有问卷都通过
*/

interface ApproveReviewBatchParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillIds: number[];
}

/**
 * approveReviewBatch
 * @param params
 * @returns
 */
function approveReviewBatch(params: ApproveReviewBatchParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/approveReviewBatch`,
    {
      ...params,
    }
  );
}

export default approveReviewBatch;
