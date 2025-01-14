import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListFillInspTaskParamsType {
  currentSystemId: number;
  currentOrgId: number;
  pageNumber: number;
  pageSize: number;
}

/*
	[]json		
  taskId	int		任务id
  systemId	int		系统id
  staffId	int		成员id // 待后台添加
  createOrgId	int		发布单位id
  createOrgName	string		发布单位名称
  createStaffId	int		发布成员id
  createStaffName	string		发布成员名称
  taskName	string		任务名称
  description  string		任务描述
  beginTimeFillEstimate	string		预计填报开始时间 yyyy-mm-dd hh:MM:ss
  endTimeFillEstimate	string		预计填报结束时间 yyyy-mm-dd hh:MM:ss
  templateId	int		模板id
  maxFillCount	int		最大可提交份数，0表示不限制
  fillTaskStatus	int		征集阶段任务状态 0：未开始 1：进行中 2：完成
  fil1Count  int  填报份数
  processStatus	int		"评审状态 
                      10：未填报
                      20：未提交
                      30：待提交专家-数据
                      40：待审核专家-数据
                      50：已提交
                      60：已通过
                      70：已驳回
                      80：已通过专家-数据
                      90：已驳回专家-数据
                      100：数据丢弃"
*/
interface ListFillInspTaskResponse {
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
  templateId: number;
  maxFillCount: number;
  fillTaskStatus: number;
  fillCount: number;
  processStatus: number;
}

/**
 * listFillInspTask
 * @param params
 * @returns
 */
function listFillInspTask(params: ListFillInspTaskParamsType) {
  return SurveyService.post<CommonResponseType<ListFillInspTaskResponse[]>>(
    `${baseUrl}/task/listFillInspTask`,
    {
      ...params,
    }
  );
}

export default listFillInspTask;
