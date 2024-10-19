import { ResponseObject } from '@/interfaces';
import { TemplateType } from '@/interfaces/CommonType';
import request from '@/lib/request';
import useSWRMutation from 'swr/mutation';

export interface TemplateOutlineCreateParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateTitle: string;
  isValid: 0 | 1;
  memo: string;
}

interface TemplateOutlineCreateResponse {
  id: number;
}

/**
 * useCreateOutlineMutation
 * @param params
 * @returns
 */

export default function useCreateOutlineMutation() {
  return useSWRMutation(
    'api/temp/create-outline',
    (
      url,
      {
        arg: { currentSystemId, templateType, templateTitle, isValid, memo },
      }: { arg: TemplateOutlineCreateParamsType }
    ) =>
      request
        .post<ResponseObject<TemplateOutlineCreateResponse>>(url, {
          currentSystemId,
          templateType,
          templateTitle,
          isValid,
          memo,
        })
        .catch(e => {
          console.error('useTagCreateMutation error', e);
        })
  );
}
