import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWR from 'swr';

export interface TagListType {
  orgs: CustomTreeDataNode;
}

export default function useOrgListSWR(params: {
  currentSystemId?: number;
  currentOrgId?: number;
}) {
  return useSWR(
    ['/api/org/list', params],
    async ([url, params]) =>
      request.post<ResponseObject<TagListType>>(url, params),
    {
      refreshInterval: 0,
    }
  );
}
