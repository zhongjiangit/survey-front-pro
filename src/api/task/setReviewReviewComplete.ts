import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface SetReviewReviewCompleteParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*

*/
export interface SetReviewReviewCompleteResponse {}

/**
 * setReviewReviewComplete
 * @param params
 * @returns
 */
function setReviewReviewComplete(params: SetReviewReviewCompleteParamsType) {
  return SurveyService.post<
    CommonResponseType<SetReviewReviewCompleteResponse>
  >(`${baseUrl}/task/setReviewReviewComplete`, {
    ...params,
  });
}

export default setReviewReviewComplete;
