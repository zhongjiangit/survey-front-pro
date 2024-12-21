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

interface ListFillsByTaskPageParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  pageNumber: number;
  pageSize: number;
  orgTags?: { key: number | string }[];
  staffTags?: { key: number | string }[];
}

/*
	[]json		
singleFillId	int		试题id
orgId	int		单位id
orgName	string		单位名称
staffId	int		填报人id
staffName	string		填报人名称
cellphone	string		填报人手机号
fillIndex	int		试题编号
expertCount	int		已分配专家数
*/
export interface ListFillsByTaskPageResponse {
  singleFillId: number;
  orgId: number;
  orgName: string;
  staffId: number;
  staffName: string;
  cellphone: string;
  fillIndex: number;
  expertCount: number;
}

/**
 * listFillsByTaskPage
 * @param params
 * @returns
 */
function listFillsByTaskPage(params: ListFillsByTaskPageParamsType) {
  return SurveyService.post<CommonResponseType<ListFillsByTaskPageResponse[]>>(
    `${baseUrl}/task/listFillsByTaskPage`,
    {
      ...params,
    }
  );
}

export default listFillsByTaskPage;
