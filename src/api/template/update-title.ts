import { TemplateType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

export interface TemplateOutlineUpdateParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateId: number;
  templateTitle: string;
  isValid?: 0 | 1;
  memo?: string;
}

export function updateTemplateTitle(params: TemplateOutlineUpdateParamsType) {
  return SurveyService.post(`${baseUrl}/template/updateTitle`, {
    ...params,
  });
}

export default updateTemplateTitle;
