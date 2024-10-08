import { ResponseObject } from '@/interfaces';
import { TagTypeType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWR from 'swr';

export type TagType = {
  tagId: number;
  tagName: string;
  subTags: TagType[];
};
export interface TagListType {
  tags: TagType;
}

export default function useTagListSWR(params: {
  currentSystemId?: number;
  tagType?: TagTypeType;
}) {
  return useSWR(['/api/tag/list', params], async ([url, params]) =>
    request.post<ResponseObject<TagListType>>(url, params)
  );
}
