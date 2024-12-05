import { SurveyService } from '@/service';
import { ZeroOrOneType } from '@/types/CommonType';
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
function getSystemListAll(params: { currentSystemId?: number | null }) {
  return SurveyService.post<CommonResponseType<SystemListType[]>>(
    `${baseUrl}/system/listAll`,
    {
      ...params,
    }
  );
}

export default getSystemListAll;
