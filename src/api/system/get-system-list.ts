import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

export type TagType = {
  levelIndex: number;
  levelName: string;
};

export interface SystemListType {
  id: number;
  systemName: string;
  freeTimes: number;
  leftTimes: number;
  allowSubInitiate: 1 | 0;
  allowSupCheck: 1 | 0;
  validDate: string;
  levelCount: number;
  levels: TagType[];
  createDate: string;
}

/**
 * getSystemListAll
 * @returns
 */
function getSystemListAll(params: { currentSystemId?: number }) {
  return SurveyService.post<CommonResponseType<SystemListType[]>>(
    '/api/system/list-all',
    {
      ...params,
    }
  );
}

export default getSystemListAll;
