import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { ResponseObject } from '@/interfaces';
import { TagTypeType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

type TagsType = {
  key: number;
  title: string;
  children: TagsType[];
};

type TagCreateParamsType = {
  currentSystemId: number;
  tagType: TagTypeType;
  tags: CustomTreeDataNode;
};

/**
 * useTagCreateMutation
 * @param params
 * @returns
 */

export default function useTagCreateMutation() {
  return useSWRMutation(
    'api/tag/save',
    (
      url,
      { arg: { currentSystemId, tagType, tags } }: { arg: TagCreateParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          currentSystemId,
          tagType,
          tags,
        })
        .catch(e => {
          console.error('useTagCreateMutation error', e);
        })
  );
}
