import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
staffId	int		填报人id
rejectComment	string		驳回原因
*/

interface RejectFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  staffId: number;
  rejectComment: string;
}

/**
 * RejectFill
 * @param params
 * @returns
 */
function rejectFill(params: RejectFillParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/task/rejectFill`, {
    ...params,
  });
}

export default rejectFill;
