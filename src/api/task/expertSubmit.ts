import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
*/

interface ExpertSubmitParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
}

/*

*/
export interface ExpertSubmitResponse {}

/**
 * expertSubmit
 * @param params
 * @returns
 */
function expertSubmit(params: ExpertSubmitParamsType) {
  return SurveyService.post<CommonResponseType<ExpertSubmitResponse>>(
    `${baseUrl}/task/expertSubmit`,
    {
      ...params,
    }
  );
}

export default expertSubmit;
