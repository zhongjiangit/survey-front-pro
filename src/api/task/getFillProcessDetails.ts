import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface GetFillProcessDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  pageNumber: number;
  pageSize: number;
}

/*
	[]json		
orgCount	int		上层各级单位数量
org[n]	json		上层各级单位信息，按从上到下顺序，[n]依次取1，2，3。。。直到orgCount字段所标识数量,例如 org1,org2,org3。。。
  orgId	int		单位id
  orgName	string		单位名称
staffId	int		填报人id
staffName	string		填报人名称
fillCount	int		提交份数
processStatus	int		任务处理状态， 10：待分配 20：未提交 50:已提交 60:已通过 70:已驳回 100：数据丢弃
*/
export interface GetFillProcessDetailsResponse {
  levels: { [key: string]: { levelName: string } };
  org: {
    orgId: number;
    orgName: string;
  }[];
  staffId: number;
  staffName: string;
  fillCount: number;
  processStatus: number;
}

/**
 * getFillProcessDetails
 * @param params
 * @returns
 */
function getFillProcessDetails(params: GetFillProcessDetailsParamsType) {
  return SurveyService.post<
    CommonResponseType<GetFillProcessDetailsResponse[]>
  >(`${baseUrl}/task/getFillProcessDetails`, {
    ...params,
  });
}

export default getFillProcessDetails;
