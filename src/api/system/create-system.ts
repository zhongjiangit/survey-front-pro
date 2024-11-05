import { ZeroOrOneType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
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
