import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListSubCollectionTaskParamsType {
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
  staffId	int		发布成员id
  staffName	string		发布成员名称
  taskName	string		任务名称
  beginTimeFillEstimate	string		预计填报开始时间 yyyy-mm-dd hh:MM:ss
  endTimeFillEstimate	string		预计填报结束时间 yyyy-mm-dd hh:MM:ss
  endTimeFillActual	string		实际填报结束时间 yyyy-mm-dd hh:MM:ss，未结束为空串
  templateId	int		模板id
  maxFillCount	int		最大可提交份数，0表示不限制
  publishType	int		任务发布类型  1：按层级发布   2：指定人员发布
  fillPassPeople	int		征集阶段通过人数
  fillPassCount	int		征集阶段通过份数
  fillPeople	int		征集阶段填报人数
  fillCount	int		征集阶段填报份数
  fillTaskStatus	int		征集阶段任务状态 0：未开始 1：进行中 2：完成
*/

interface ListSubCollectionTaskResponse {
  taskId: number;
  systemId: number;
  createOrgId: number;
  createOrgName: string;
  staffId: number;
  staffName: string;
  taskName: string;
  beginTimeFillEstimate: string;
  endTimeFillEstimate: string;
  endTimeFillActual: string;
  templateId: number;
  maxFillCount: number;
  publishType: number;
  fillPassPeople: number;
  fillPassCount: number;
  fillPeople: number;
  fillCount: number;
  fillTaskStatus: number;
}

/**
 * listSubCollectionTask
 * @param params
 * @returns
 */
function listSubCollectionTask(params: ListSubCollectionTaskParamsType) {
  return SurveyService.post<
    CommonResponseType<ListSubCollectionTaskResponse[]>
  >(`${baseUrl}/task/listSubCollectionTask`, {
    ...params,
  });
}

export default listSubCollectionTask;
