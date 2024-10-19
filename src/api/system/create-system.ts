import { ZeroOrOne } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

type SystemCreateParamsType = {
  systemName: string;
  freeTimes: number;
  allowSubInitiate: ZeroOrOne;
  allowSupCheck: ZeroOrOne;
  validDate: string;
  levelCount: number;
  levels: string[];
};

/**
 * useSystemCreateMutation
 * @param params
 * @returns
 */
function createSystem(params: SystemCreateParamsType) {
  return SurveyService.post<CommonResponseType>('api/system/create', {
    ...params,
  });
}

export default createSystem;
