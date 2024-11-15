import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface SetCollectionFillCompleteParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*

*/
export interface SetCollectionFillCompleteResponse {}

/**
 * setCollectionFillComplete
 * @param params
 * @returns
 */
function setCollectionFillComplete(
  params: SetCollectionFillCompleteParamsType
) {
  return SurveyService.post<
    CommonResponseType<SetCollectionFillCompleteResponse>
  >(`${baseUrl}/task/setCollectionFillComplete`, {
    ...params,
  });
}

export default setCollectionFillComplete;
