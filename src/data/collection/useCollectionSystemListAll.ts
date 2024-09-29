import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWR from 'swr';

/**
 * useCollectionSystemListAll
 * @returns
 */

export default function useCollectionSystemListAll() {
  return useSWR('/api/collection/system/list-all', url =>
    request.post<ResponseObject>(url)
  );
}
