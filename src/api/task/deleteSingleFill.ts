import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
*/

interface DeleteSingleFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
}

/*

*/
export interface DeleteSingleFillResponse {}

/**
 * deleteSingleFill
 * @param params
 * @returns
 */
function deleteSingleFill(params: DeleteSingleFillParamsType) {
  return SurveyService.post<CommonResponseType<DeleteSingleFillResponse>>(
    `${baseUrl}/task/deleteSingleFill`,
    {
      ...params,
    }
  );
}

export default deleteSingleFill;
