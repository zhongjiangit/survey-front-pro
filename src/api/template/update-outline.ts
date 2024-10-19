import { TemplateType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface TemplateOutlineUpdateParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateId: number;
  templateTitle: string;
  isValid?: 0 | 1;
  memo?: string;
}

export function updateTemplateOutline(params: TemplateOutlineUpdateParamsType) {
  return SurveyService.post('/api/template/update-title', {
    ...params,
  });
}

export default updateTemplateOutline;
