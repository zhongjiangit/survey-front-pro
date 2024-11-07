import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskName	string		任务名称
*/

interface EditCollectionTaskParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  taskName: string;
}

interface EditCollectionTaskResponse {}

/**
 * editCollectionTask
 * @param params
 * @returns
 */
function editCollectionTask(params: EditCollectionTaskParamsType) {
  return SurveyService.post<CommonResponseType<EditCollectionTaskResponse>>(
    `${baseUrl}/task/editCollectionTask`,
    {
      ...params,
    }
  );
}

export default editCollectionTask;
