import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
staffId	int		填报人id
*/

interface ListRejectFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  staffId: number;
}

/*
			[]json		
  rejecterId	int		驳回单位id
  rejecterName	string		驳回单位名称
  rejectComment	string		驳回原因
  rejectTime	string		驳回时间
*/
export interface ListRejectFillResponse {
  rejecterId: number;
  rejecterName: string;
  rejectComment: string;
  rejectTime: string;
}

/**
 * listRejectFill
 * @param params
 * @returns
 */
function listRejectFill(params: ListRejectFillParamsType) {
  return SurveyService.post<CommonResponseType<ListRejectFillResponse[]>>(
    `${baseUrl}/task/listRejectFill`,
    {
      ...params,
    }
  );
}

export default listRejectFill;
