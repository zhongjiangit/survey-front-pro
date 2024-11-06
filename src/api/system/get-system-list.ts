import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
    `${baseUrl}/system/listAll`,
    {
      ...params,
    }
  );
}

export default getSystemListAll;
