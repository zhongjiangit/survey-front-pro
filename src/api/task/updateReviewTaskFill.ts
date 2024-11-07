import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
beginTimeFillEstimate	string	○	预计填报开始时间 yyyy-mm-dd hh:MM:ss，当前单位非发起者时不传
endTimeFillEstimate	string	○	预计填报结束时间 yyyy-mm-dd hh:MM:ss，当前单位非发起者时不传
orgs	[]json	○	publishType为1，且不为任务层级最下级单位时必传，参与单位
  orgId	int		单位id
staffs	[]json	○	publishType为2，或publishType为1且为最下级单位时必传
  staffId	int		成员id
*/

interface UpdateReviewTaskFillParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  beginTimeFillEstimate: string;
  endTimeFillEstimate: string;
  orgs: {
    orgId: number;
  }[];
  staffs: {
    staffId: number;
  }[];
}

interface UpdateReviewTaskFillResponse {}

/**
 * updateReviewTaskFill
 * @param params
 * @returns
 */
function updateReviewTaskFill(params: UpdateReviewTaskFillParamsType) {
  return SurveyService.post<CommonResponseType<UpdateReviewTaskFillResponse>>(
    `${baseUrl}/task/updateReviewTaskFill`,
    {
      ...params,
    }
  );
}

export default updateReviewTaskFill;
