import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface GetInspTaskFillParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
taskId	int		任务id
taskName	string		任务名称
createOrgId	int		发布单位id
beginTimeFillEstimate	string		预计填报开始时间 yyyy-mm-dd hh:MM:ss
endTimeFillEstimate	string		预计填报结束时间 yyyy-mm-dd hh:MM:ss
templateId	int		模板id
publishType	int		任务发布类型  1：按层级发布   2：指定人员发布
maxFillCount	int		最大可提交份数，0表示不限制
levels	[]json	○	publishType为1时必传，任务分配路径
  levelIndex	int		层级序号
orgs	[]json	○	publishType为1时必传，任务指定的直接下层级参与单位
  orgId	int		单位id
staffs	[]json	○	publishType为2时必传
  staffId	int		成员id
*/
interface GetInspTaskFillResponse {
  taskId: number;
  taskName: string;
  createOrgId: number;
  beginTimeFillEstimate: string;
  endTimeFillEstimate: string;
  templateId: number;
  publishType: number;
  maxFillCount: number;
  levels?: {
    levelIndex: number;
  }[];
  orgs?: {
    orgId: number;
  }[];
  staffs?: {
    staffId: number;
  }[];
}

/**
 * getInspTaskFill
 * @param params
 * @returns
 */
function getInspTaskFill(params: GetInspTaskFillParamsType) {
  return SurveyService.post<CommonResponseType<GetInspTaskFillResponse>>(
    `${baseUrl}/task/getInspTaskFill`,
    {
      ...params,
    }
  );
}

export default getInspTaskFill;
