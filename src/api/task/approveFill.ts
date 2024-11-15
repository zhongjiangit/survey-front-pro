import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
staffId	int		填报人id
*/

interface ApproveFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  staffId: number;
}

/*

*/
export interface ApproveFillResponse {}

/**
 * approveFill
 * @param params
 * @returns
 */
function approveFill(params: ApproveFillParamsType) {
  return SurveyService.post<CommonResponseType<ApproveFillResponse>>(
    `${baseUrl}/task/approveFill`,
    {
      ...params,
    }
  );
}

export default approveFill;
