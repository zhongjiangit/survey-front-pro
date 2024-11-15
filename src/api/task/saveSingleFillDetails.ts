import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
singleFillId	int		问卷id
items	[]json		问卷内容
  templateItemId	int		模板题目id
  fillContent	string	○	填报内容，非附件控件填写
  attachments	[]json	○	附件信息，附件控件填写
    attachmentId	int		附件id
*/

interface SaveSingleFillDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  singleFillId: number;
  items: {
    templateItemId: number;
    fillContent?: string;
    attachments?: {
      attachmentId: number;
    }[];
  }[];
}

/*
singleFillId	int		问卷id
*/
export interface SaveSingleFillDetailsResponse {
  singleFillId: number;
}

/**
 * saveSingleFillDetails
 * @param params
 * @returns
 */
function saveSingleFillDetails(params: SaveSingleFillDetailsParamsType) {
  return SurveyService.post<CommonResponseType<SaveSingleFillDetailsResponse>>(
    `${baseUrl}/task/saveSingleFillDetails`,
    {
      ...params,
    }
  );
}

export default saveSingleFillDetails;
