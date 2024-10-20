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
  managerName?: string;
  cellphone?: string;
  isValid: 1 | 0;
  tags?: number[];
}

/**
 * useOrgSetMutation
 * @param params
 * @returns
 */

export default function useOrgSetMutation() {
  return useSWRMutation(
    'api/org/set',
    (
      url,
      {
        arg: { currentSystemId, orgId, managerName, cellphone, isValid, tags },
      }: { arg: TagCreateParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          currentSystemId,
          orgId,
          managerName,
          cellphone,
          isValid,
          tags,
        })
        .catch(e => {})
  );
}
