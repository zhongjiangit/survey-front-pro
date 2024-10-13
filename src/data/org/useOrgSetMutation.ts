import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { ResponseObject } from '@/interfaces';
import { TagTypeType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

type TagsType = {
  key?: number;
  title: string;
  children: TagsType[];
};

export interface TagCreateParamsType {
  currentSystemId: number;
  orgId: number;
  isValid: 1 | 0;
  tags?: number[];
}

/**
 * useTagCreateMutation
 * @param params
 * @returns
 */

export default function useTagCreateMutation() {
  return useSWRMutation(
    'api/org/set',
    (
      url,
      {
        arg: { currentSystemId, orgId, isValid, tags },
      }: { arg: TagCreateParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          currentSystemId,
          orgId,
          isValid,
          tags,
        })
        .catch(e => {
          console.error('useTagCreateMutation error', e);
        })
  );
}
