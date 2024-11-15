import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface ListSingleFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
		[]json		
  singleFillId	int		问卷id
*/
interface ListSingleFillResponse {
  singleFillId: number;
}

/**
 * listSingleFill
 * @param params
 * @returns
 */
function listSingleFill(params: ListSingleFillParamsType) {
  return SurveyService.post<CommonResponseType<ListSingleFillResponse[]>>(
    `${baseUrl}/task/listSingleFill`,
    {
      ...params,
    }
  );
}

export default listSingleFill;
