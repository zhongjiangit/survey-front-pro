import { SurveyService } from '@/service';
import { TemplateType } from '@/types/CommonType';
import { baseUrl } from '../config';

export interface TemplateOutlineCreateParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateTitle: string;
  isValid: 0 | 1;
  memo: string;
}

interface TemplateOutlineType {
  id: number;
}

interface TemplateOutlineCreateResponse {
  result: number;
  message?: string;
  data: TemplateOutlineType;
  total: number;
}

export function createTemplateOutline(params: TemplateOutlineCreateParamsType) {
  return SurveyService.post<TemplateOutlineCreateResponse>(
    `${baseUrl}/template/createOutline`,
    {
      ...params,
    }
  );
}

export default createTemplateOutline;
