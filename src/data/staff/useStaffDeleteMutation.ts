import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { ResponseObject } from '@/interfaces';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

interface StaffDeleteParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
}

/**
 * useStaffDeleteMutation
 * @param params
 * @returns
 */

export default function useStaffDeleteMutation() {
  return useSWRMutation(
    'api/staff/delete',
    (
      url,
      {
        arg: { id, currentSystemId, currentOrgId },
      }: { arg: StaffDeleteParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          id,
          currentSystemId,
          currentOrgId,
        })
        .catch(e => {
          console.error('useStaffDeleteMutation error', e);
        })
  );
}
