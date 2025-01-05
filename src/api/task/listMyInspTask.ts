import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListMyInspTaskParamsType {
  currentSystemId: number;
  currentOrgId: number;
  pageNumber: number;
  pageSize: number;
}

/*
		[]json		
  taskId	int		任务id
  systemId	int		系统id
  createOrgId	int		发布单位id
  createOrgName	string		发布单位名称
  createStaffId	int		发布成员id
  createStaffName	string		发布成员名称
  taskName	string		任务名称
  description	string		任务描述
  beginTimeFillEstimate	string		预计填报开始时间 yyyy-mm-dd hh:MM:ss
  endTimeFillEstimate	string		预计填报结束时间 yyyy-mm-dd hh:MM:ss
  endTimeFillActual	string	○	实际填报结束时间 yyyy-mm-dd hh:MM:ss，未结束不传
  templateId	int		模板id
  maxFillCount	int		最大可提交份数，0表示不限制
  publishType	int		任务发布类型  1：按层级发布   2：指定人员发布
  fillPassPeople	int		征集阶段通过人数
  fillPassCount	int		征集阶段通过份数
  fillPeople	int		征集阶段填报人数
  fillCount	int		征集阶段填报份数
  fillTaskStatus	int		征集阶段任务状态 0：未开始 1：进行中 2：完成
  isReviewSet	int		是否已经设置过评审 0：未设置  1：已设置
  beginTimeReviewEstimate	string	○	预计评审开始时间 yyyy-mm-dd hh:MM:ss，未设置评审不传
  endTimeReviewEstimate	string	○	预计评审结束时间 yyyy-mm-dd hh:MM:ss，未设置评审不传
  endTimeReviewActual	string	○	实际评审结束时间 yyyy-mm-dd hh:MM:ss，未结束为空串
  reviewPassPeople	int	○	评审阶段通过人数，未设置评审不传
  reviewPassCount	int	○	评审阶段通过份数，未设置评审不传
  reviewPassRate	int	○	评审阶段通过比例，0-100整数值，未设置评审不传
  reviewPeople	int	○	评审阶段填报专家人数，未设置评审不传
  reviewCount	int	○	评审阶段填报专家份数，未设置评审不传
  reviewRate	int	○	评审阶段填报比例，0-100整数值，未设置评审不传
  reviewTaskStatus	int	○	评审阶段任务状态 0：未开始 1：进行中 2：完成 9：已取消，未设置评审不传
  hasUncompletedFill	int		是否还有需要处理的填报数据 0：无  1：有
  hasUncompletedReview	int		是否还有需要处理的评审数据 0：无  1：有
*/
export interface ListMyInspTaskResponse {
  taskId: number;
  systemId: number;
  createOrgId: number;
  createOrgName: string;
  createStaffId: number;
  createStaffName: string;
  taskName: string;
  description: string;
  beginTimeFillEstimate: string;
  endTimeFillEstimate: string;
  endTimeFillActual?: string;
  templateId: number;
  maxFillCount: number;
  publishType: number;
  fillPassPeople: number;
  fillPassCount: number;
  fillPeople: number;
  fillCount: number;
  fillTaskStatus: number;
  isReviewSet: number;
  beginTimeReviewEstimate?: string;
  endTimeReviewEstimate?: string;
  endTimeReviewActual?: string;
  reviewPassPeople?: number;
  reviewPassCount?: number;
  reviewPassRate?: number;
  reviewPeople?: number;
  reviewCount?: number;
  reviewRate?: number;
  reviewTaskStatus?: number;
  hasUncompletedFill: number;
  hasUncompletedReview: number;
}

/**
 * listMyInspTask
 * @param params
 * @returns
 */
function listMyInspTask(params: ListMyInspTaskParamsType) {
  return SurveyService.post<CommonResponseType<ListMyInspTaskResponse[]>>(
    `${baseUrl}/task/listMyInspTask`,
    {
      ...params,
    }
  );
}

export default listMyInspTask;
