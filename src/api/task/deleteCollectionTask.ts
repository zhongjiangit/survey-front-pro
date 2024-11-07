import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
verifyCode	string		手机验证码
*/

interface DeleteCollectionTaskParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  verifyCode: string;
}

interface DeleteCollectionTaskResponse {}

/**
 * deleteCollectionTask
 * @param params
 * @returns
 */
function deleteCollectionTask(params: DeleteCollectionTaskParamsType) {
  return SurveyService.post<CommonResponseType<DeleteCollectionTaskResponse>>(
    `${baseUrl}/task/deleteCollectionTask`,
    {
      ...params,
    }
  );
}

export default deleteCollectionTask;
