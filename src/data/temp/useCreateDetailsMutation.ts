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
  tagType: TagTypeType;
  tags: TagsType;
}

interface TagCreateResponse {
  tags: TagsType;
}

/**
 * useCreateDetailsMutation
 * @param params
 * @returns
 */

export default function useCreateDetailsMutation() {
  return useSWRMutation(
    'api/temp/save',
    (
      url,
      { arg: { currentSystemId, tagType, tags } }: { arg: TagCreateParamsType }
    ) =>
      request
        .post<ResponseObject<TagCreateResponse>>(url, {
          currentSystemId,
          tagType,
          tags,
        })
        .catch(e => {
          console.error('useTagCreateMutation error', e);
        })
  );
}
