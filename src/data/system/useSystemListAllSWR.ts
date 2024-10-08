import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWR from 'swr';

export type TagType = {
  levelIndex: number;
  levelName: string;
};

export interface SystemListType {
  id: number;
  systemName: string;
  freeTimes: number;
  leftTimes: number;
  allowSubInitiate: 1 | 0;
  allowSupCheck: 1 | 0;
  validDate: string;
  levelCount: number;
  levels: TagType[];
  createDate: string;
}

/**
 * useSystemListAllSWR
 * @returns
 */

export default function useSystemListAllSWR(params: {
  currentSystemId?: number;
}) {
  return useSWR(['/api/system/list-all', params], async ([url, params]) =>
    request.post<ResponseObject<SystemListType[]>>(url, params)
  );
}
