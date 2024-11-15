import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface CreateSingleFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
singleFillId	int		问卷id
*/
export interface CreateSingleFillResponse {
  singleFillId: number;
}

/**
 * createSingleFill
 * @param params
 * @returns
 */
function createSingleFill(params: CreateSingleFillParamsType) {
  return SurveyService.post<CommonResponseType<CreateSingleFillResponse>>(
    `${baseUrl}/task/createSingleFill`,
    {
      ...params,
    }
  );
}

export default createSingleFill;
