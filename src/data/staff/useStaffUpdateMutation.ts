import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { ResponseObject } from '@/interfaces';
import { StaffType, TagTypeType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

type TagsType = {
  key: number;
};

interface StaffUpdateParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
  staffName: string;
  cellphone: string;
  staffType: StaffType;
  tags?: TagsType[];
}

/**
 * useStaffUpdateMutation
 * @param params
 * @returns
 */

export default function useStaffUpdateMutation() {
  return useSWRMutation(
    'api/staff/update',
    (
      url,
      {
        arg: {
          id,
          currentSystemId,
          currentOrgId,
          staffName,
          cellphone,
          staffType,
          tags,
        },
      }: { arg: StaffUpdateParamsType }
    ) =>
      request
        .post<ResponseObject>(url, {
          id,
          currentSystemId,
          currentOrgId,
          staffName,
          cellphone,
          staffType,
          tags,
        })
        .catch(e => {
          console.error('useStaffUpdateMutation error', e);
        })
  );
}
