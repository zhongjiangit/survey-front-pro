import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
orgId	int		要查询可见层级的单位id
*/
export interface ListVisibleLevelsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  orgId: number;
}

/**
 	[]json		各层级信息
  levelIndex	int		层级序号，从1开始，升序排列，数字越小表示层级越高。
  levelName	string		层级名称
 */
export interface ListVisibleLevelsResponse {
  levelIndex: number;
  levelName: string;
}

/**
 * listVisibleLevels
 * @returns
 */
function listVisibleLevels(params: ListVisibleLevelsParamsType) {
  return SurveyService.post<CommonResponseType<ListVisibleLevelsResponse[]>>(
    `${baseUrl}/system/listVisibleLevels`,
    {
      ...params,
    }
  );
}

export default listVisibleLevels;
