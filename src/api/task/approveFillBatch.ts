import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
    currentSystemId	int		登录用户当前操作的系统id
    currentOrgId	int		登录用户当前操作的单位id
    taskId	        int		任务id
    staffIds	    int[]		填报人id, 不传表示通过当前单位待审核的所有数据
*/

interface ApproveFillBatchParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  staffIds?: number[];
}

/**
 * approveFillBatchBatch
 * @param params
 * @returns
 */
function approveFillBatch(params: ApproveFillBatchParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/approveFillBatch`,
    {
      ...params,
    }
  );
}

export default approveFillBatch;
