import { ResponseObject } from '@/interfaces';
import { TemplateType, ZeroOrOne } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWR from 'swr';

export interface TemplateListResponse {
  templateId: number;
  templateTitle: string;
  isValid: ZeroOrOne;
  memo: string;
}

export default function useListOutlineSWR(params: {
  currentSystemId: number;
  templateType: TemplateType;
}) {
  return useSWR(
    ['/api/temp/list-outline', params],
    async ([url, params]) =>
      request.post<ResponseObject<TemplateListResponse[]>>(url, params),
    {
      refreshInterval: 0,
    }
  );
}
