import { ResponseObject } from '@/interfaces';
import { ZeroOrOneType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWR from 'swr';

type TagsType = {
  key: number;
  title: string;
};
export interface OrgNodeResponse {
  managerName: string;
  cellphone: string;
  isValid: ZeroOrOneType;
  tags: TagsType[];
}

export default function useOrgGetSWR(params: {
  currentSystemId?: number;
  orgId?: number;
}) {
  return useSWR(['/api/org/get', params], async ([url, params]) =>
    request.post<ResponseObject<OrgNodeResponse>>(url, params)
  );
}
