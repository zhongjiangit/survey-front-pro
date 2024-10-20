import { TemplateType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

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
    '/api/template/create-outline',
    {
      ...params,
    }
  );
}

export default createTemplateOutline;