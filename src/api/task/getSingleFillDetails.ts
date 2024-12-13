import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		上报的问卷id
*/

interface GetSingleFillDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
}

/*
			[]json		
  templateItemId	int		模板题目id
  fillContent	string	○	填报内容，非附件控件时才有
  attachments	[]json	○	附件信息，附件控件时才有
    attachmentId	int		附件id
    attachmentFilename	string		附件文件名
*/
export interface GetSingleFillDetailsResponse {
  templateItemId: number;
  fillContent?: string;
  attachments?: {
    attachmentId: number;
    attachmentFilename: string;
  }[];
}

/**
 * getSingleFillDetails
 * @param params
 * @returns
 */
function getSingleFillDetails(params: GetSingleFillDetailsParamsType) {
  return SurveyService.post<CommonResponseType<GetSingleFillDetailsResponse[]>>(
    `${baseUrl}/task/getSingleFillDetails`,
    {
      ...params,
    }
  );
}

export default getSingleFillDetails;
