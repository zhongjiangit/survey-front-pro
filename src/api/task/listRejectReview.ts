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

interface ListRejectReviewParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
  expertId: number;
}

/*
	[]json		
  rejecterId	int		驳回单位id
  rejecterName	string		驳回单位名称
  rejectComment	string		驳回原因
  rejectTime	string		驳回时间
*/
export interface ListRejectReviewResponse {
  rejecterId: number;
  rejecterName: string;
  rejectComment: string;
  rejectTime: string;
}

/**
 * listRejectReview
 * @param params
 * @returns
 */
function listRejectReview(params: ListRejectReviewParamsType) {
  return SurveyService.post<CommonResponseType<ListRejectReviewResponse[]>>(
    `${baseUrl}/task/listRejectReview`,
    {
      ...params,
    }
  );
}

export default listRejectReview;
