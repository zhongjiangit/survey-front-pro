import { ResponseObject } from '@/interfaces';
import { StaffType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

type TagsType = {
  key: number;
};

interface StaffCreateParamsType {
  currentSystemId: number;
  currentOrgId: number;
  staffName: string;
  cellphone: string;
  staffType: StaffType;
  tags?: TagsType[];
}

interface StaffCreateResponse {
  id: number;
}

/**
 * useStaffCreateMutation
 * @param params
 * @returns
 */

export default function useStaffCreateMutation() {
  return useSWRMutation(
    'api/staff/create',
    (
      url,
      {
        arg: {
          currentSystemId,
          currentOrgId,
          staffName,
          cellphone,
          staffType,
          tags,
        },
      }: { arg: StaffCreateParamsType }
    ) =>
      request
        .post<ResponseObject<StaffCreateResponse>>(url, {
          currentSystemId,
          currentOrgId,
          staffName,
          cellphone,
          staffType,
          tags,
        })
        .catch(e => {
          console.error('useStaffCreateMutation error', e);
        })
  );
}
