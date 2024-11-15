import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface FillerSubmitParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*

*/
export interface FillerSubmitResponse {}

/**
 * fillerSubmit
 * @param params
 * @returns
 */
function fillerSubmit(params: FillerSubmitParamsType) {
  return SurveyService.post<CommonResponseType<FillerSubmitResponse>>(
    `${baseUrl}/task/fillerSubmit`,
    {
      ...params,
    }
  );
}

export default fillerSubmit;
