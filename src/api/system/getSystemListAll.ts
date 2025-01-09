import { SurveyService } from '@/service';
import { ZeroOrOneType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
 pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
 */
type getSystemListAllParamsType = {
  currentSystemId?: number | null;
  // pageNumber: number;
  // pageSize: number;
};

export type TagType = {
  levelIndex: number;
  levelName: string;
};

export interface SystemListType {
  id: number;
  systemName: string;
  freeTimes: number;
  leftTimes: number;
  systemStatus: ZeroOrOneType;
  allowSubInitiate: ZeroOrOneType;
  allowSupCheck: ZeroOrOneType;
  validDate: string;
  levelCount: number;
  levels: TagType[];
  createDate: string;
}

/**
 * getSystemListAll
 * @returns
 */
function getSystemListAll(params: getSystemListAllParamsType) {
  return SurveyService.post<CommonResponseType<SystemListType[]>>(
    `${baseUrl}/system/listAll`,
    {
      ...params,
    }
  );
}

export default getSystemListAll;
