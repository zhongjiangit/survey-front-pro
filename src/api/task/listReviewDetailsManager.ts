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

interface ListReviewDetailsManagerParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  pageNumber: number;
  pageSize: number;
}

/*
		[]json		
  singleFillId	int		问卷id
  orgCount	int		各级单位数量
  org[n]	json		各级单位信息，按从上到下顺序，[n]依次取1，2，3。。。直到orgCount字段所标识数量,例如 org1,org2,org3。。。
    orgId	int		单位id
    orgName	string		单位名称
  fillerStaffId	int		填报人成员id
  fillerStaffName	string		填报人成员名称
  fillIndex	int		试题编号
  reviewCompleteRate	int		评审完成度 0-100整数值
  passedExpertCount	int		已通过专家
  needReviewExpertCount	int		待审核专家
  needSubmitExpertCount	int		待提交专家
  rejectedExpertCount	int		已驳回专家
*/

interface ListReviewDetailsManagerResponse {
  singleFillId: number;
  orgCount: number;
  org: {
    orgId: number;
    orgName: string;
  }[];
  fillerStaffId: number;
  fillerStaffName: string;
  fillIndex: number;
  reviewCompleteRate: number;
  passedExpertCount: number;
  needReviewExpertCount: number;
  needSubmitExpertCount: number;
  rejectedExpertCount: number;
}

/**
 * listReviewDetailsManager
 * @param params
 * @returns
 */
function listReviewDetailsManager(params: ListReviewDetailsManagerParamsType) {
  return SurveyService.post<
    CommonResponseType<ListReviewDetailsManagerResponse[]>
  >(`${baseUrl}/task/listReviewDetailsManager`, {
    ...params,
  });
}

export default listReviewDetailsManager;
