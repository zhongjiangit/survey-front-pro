import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListReviewTaskExpertParamsType {}

/*
	[]json		
  taskId	int		任务id
  systemId	int		系统id
  createOrgId	int		发布单位id
  createOrgName	string		发布单位名称
  staffId	int		发布成员id
  staffName	string		发布成员名称
  taskName	string		任务名称
  beginTimeReviewEstimate	string		预计评审开始时间 yyyy-mm-dd hh:MM:ss
  endTimeReviewEstimate	string		预计评审结束时间 yyyy-mm-dd hh:MM:ss
  templateId	int		模板id
  reviewPassCount	int		评审阶段通过份数
  reviewPassRate	int		评审阶段通过比例，0-100整数值
  reviewRejectCount	int		评审阶段驳回份数
  reviewRejectRate	int		评审阶段驳回比例，0-100整数值
  reviewSubmitCount	int		评审阶段提交份数
  reviewSubmitRate	int		评审阶段提交比例，0-100整数值
  reviewCount	int		评审阶段填报份数
  reviewRate	int		评审阶段填报比例，0-100整数值
  reviewTaskStatus	int		任务状态 0：未开始 1：进行中 2：完成
*/
interface ListReviewTaskExpertResponse {
  taskId: number;
  systemId: number;
  createOrgId: number;
  createOrgName: string;
  staffId: number;
  staffName: string;
  taskName: string;
  beginTimeReviewEstimate: string;
  endTimeReviewEstimate: string;
  templateId: number;
  reviewPassCount: number;
  reviewPassRate: number;
  reviewRejectCount: number;
  reviewRejectRate: number;
  reviewSubmitCount: number;
  reviewSubmitRate: number;
  reviewCount: number;
  reviewRate: number;
  reviewTaskStatus: number;
}

/**
 * listReviewTaskExpert
 * @param params
 * @returns
 */
function listReviewTaskExpert(params: ListReviewTaskExpertParamsType) {
  return SurveyService.post<CommonResponseType<ListReviewTaskExpertResponse[]>>(
    `${baseUrl}/task/listReviewTaskExpert`,
    {
      ...params,
    }
  );
}

export default listReviewTaskExpert;
