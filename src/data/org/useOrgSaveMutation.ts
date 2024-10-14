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

interface TagCreateParamsType {
  currentSystemId: number;
  orgs: TagsType;
}

interface TagCreateResponse {
  orgs: TagsType;
}

/**
 * useOrgSaveMutation
 * @param params
 * @returns
 */

export default function useOrgSaveMutation() {
  return useSWRMutation(
    'api/org/save',
    (url, { arg: { currentSystemId, orgs } }: { arg: TagCreateParamsType }) =>
      request
        .post<ResponseObject<TagCreateResponse>>(url, {
          currentSystemId,
          orgs,
        })
        .catch(e => {
          console.error('useTagCreateMutation error', e);
        })
  );
}
