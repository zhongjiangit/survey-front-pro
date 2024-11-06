import { SurveyService } from '@/service';
import { ZeroOrOneType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

type SystemCreateParamsType = {
  systemName: string;
  freeTimes: number;
  allowSubInitiate: ZeroOrOneType;
  allowSupCheck: ZeroOrOneType;
  validDate: string;
  levelCount: number;
  levels: string[];
};

/**
 * createSystem
 * @param params
 * @returns
 */
function createSystem(params: SystemCreateParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/system/create`, {
    ...params,
  });
}

export default createSystem;
