import { ResponseObject } from '@/interfaces';
import { ZeroOrOneType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

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
 * useSystemCreateMutation
 * @param params
 * @returns
 */

export default function useSystemCreateMutation() {
  return useSWRMutation(
    'api/system/create',
    (
      url,
      {
        arg: {
          systemName,
          freeTimes,
          allowSubInitiate,
          allowSupCheck,
          validDate,
          levelCount,
          levels,
        },
      }: { arg: SystemCreateParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          systemName,
          freeTimes,
          allowSubInitiate,
          allowSupCheck,
          validDate,
          levelCount,
          levels,
        })
        .catch(e => {
          console.error('useSystemCreateMutation error', e);
        })
  );
}
