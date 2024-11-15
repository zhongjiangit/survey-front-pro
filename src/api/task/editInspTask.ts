import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskName	string		任务名称
*/

interface EditInspTaskParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  taskName: string;
}

interface EditInspTaskResponse {}

/**
 * editInspTask
 * @param params
 * @returns
 */
function editInspTask(params: EditInspTaskParamsType) {
  return SurveyService.post<CommonResponseType<EditInspTaskResponse>>(
    `${baseUrl}/task/editInspTask`,
    {
      ...params,
    }
  );
}

export default editInspTask;
