import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface GetFillPassCountDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
    []json		
  org[n]	json		上层各级单位信息，按从上到下顺序，[n]依次取1，2，3。。。例如 org1,org2,org3。。。
    orgId	int		单位id
    orgName	string		单位名称
  fillPassPeople	int		填报通过人数
  fillPassCount	int		填报通过份数
*/

export interface GetFillPassCountDetailsResponse {
  org: {
    orgId: number;
    orgName: string;
  }[];
  fillPassPeople: number;
  fillPassCount: number;
  orgCount: number;
}

/**
 * getFillPassCountDetails
 * @param params
 * @returns
 */
function getFillPassCountDetails(params: GetFillPassCountDetailsParamsType) {
  return SurveyService.post<
    CommonResponseType<GetFillPassCountDetailsResponse[]>
  >(`${baseUrl}/task/getFillPassCountDetails`, {
    ...params,
  });
}

export default getFillPassCountDetails;
