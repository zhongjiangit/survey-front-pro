import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskName	string		任务名称
*/

interface EditReviewTaskParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  taskName: string;
}

interface EditReviewTaskResponse {}

/**
 * editReviewTask
 * @param params
 * @returns
 */
function editReviewTask(params: EditReviewTaskParamsType) {
  return SurveyService.post<CommonResponseType<EditReviewTaskResponse>>(
    `${baseUrl}/task/editReviewTask`,
    {
      ...params,
    }
  );
}

export default editReviewTask;
