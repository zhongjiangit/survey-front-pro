import { ZeroOrOneType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

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
  return SurveyService.post<CommonResponseType>('/api/system/create', {
    ...params,
  });
}

export default createSystem;
