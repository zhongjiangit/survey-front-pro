import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
verifyCode	string		手机验证码
*/

interface DeleteReviewTaskParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  verifyCode: string;
}

interface DeleteReviewTaskResponse {}

/**
 * deleteReviewTask
 * @param params
 * @returns
 */
function deleteReviewTask(params: DeleteReviewTaskParamsType) {
  return SurveyService.post<CommonResponseType<DeleteReviewTaskResponse>>(
    `${baseUrl}/task/deleteReviewTask`,
    {
      ...params,
    }
  );
}

export default deleteReviewTask;
