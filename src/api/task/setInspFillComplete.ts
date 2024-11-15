import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface SetInspFillCompleteParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*

*/
export interface SetInspFillCompleteResponse {}

/**
 * setInspFillComplete
 * @param params
 * @returns
 */
function setInspFillComplete(params: SetInspFillCompleteParamsType) {
  return SurveyService.post<CommonResponseType<SetInspFillCompleteResponse>>(
    `${baseUrl}/task/setInspFillComplete`,
    {
      ...params,
    }
  );
}

export default setInspFillComplete;
