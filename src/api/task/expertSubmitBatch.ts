import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
*/

interface ExpertSubmitBatchParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillIds: number[];
}

/**
 * expertSubmit
 * @param params
 * @returns
 */
function expertSubmitBatch(params: ExpertSubmitBatchParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/expertSubmitBatch`,
    params
  );
}

export default expertSubmitBatch;
