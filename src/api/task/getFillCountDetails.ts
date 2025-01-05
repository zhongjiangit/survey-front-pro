import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface GetFillCountDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
				
    []json		
  orgCount  int		上层各级单位数量
  org[n]	json		上层各级单位信息，按从上到下顺序，[n]依次取1，2，3。。。例如 org1,org2,org3。。。
    orgId	int		单位id
    orgName	string		单位名称
  fillPeople	int		填报人数
  fillCount	int		填报份数

*/
export interface GetFillCountDetailsResponse {
  org: {
    orgId: number;
    orgName: string;
  }[];
  orgCount: number;
  fillPeople: number;
  fillCount: number;
}

/**
 * getFillCountDetails
 * @param params
 * @returns
 */
function getFillCountDetails(params: GetFillCountDetailsParamsType) {
  return SurveyService.post<CommonResponseType<GetFillCountDetailsResponse[]>>(
    `${baseUrl}/task/getFillCountDetails`,
    {
      ...params,
    }
  );
}

export default getFillCountDetails;
