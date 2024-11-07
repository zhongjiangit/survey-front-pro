import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListFillCollectionTaskParamsType {
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
  templateId	int		模板id
  maxFillCount	int		最大可提交份数，0表示不限制
  fillTaskStatus	int		征集阶段任务状态 0：未开始 1：进行中 2：完成
  processStatus	int		任务处理状态 20：未提交 50:已提交 60:已通过 70:已驳回 100：数据丢弃
*/
interface ListFillCollectionTaskResponse {
  taskId: number;
  systemId: number;
  createOrgId: number;
  createOrgName: string;
  staffId: number;
  staffName: string;
  taskName: string;
  beginTimeFillEstimate: string;
  endTimeFillEstimate: string;
  templateId: number;
  maxFillCount: number;
  fillTaskStatus: number;
  processStatus: number;
}

/**
 * listFillCollectionTask
 * @param params
 * @returns
 */
function listFillCollectionTask(params: ListFillCollectionTaskParamsType) {
  return SurveyService.post<CommonResponseType<ListFillCollectionTaskResponse[]>>(
    `${baseUrl}/task/listFillCollectionTask`,
    {
      ...params,
    }
  );
}

export default listFillCollectionTask;
