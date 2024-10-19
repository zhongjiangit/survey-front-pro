import { TemplateType, ZeroOrOne } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface TemplateListParamsType {
  currentSystemId: number;
  templateType: TemplateType;
}

export interface TemplateListType {
  templateId: number;
  templateTitle: string;
  isValid: ZeroOrOne;
  memo: string;
}

interface TemplateLisResponse {
  result: number;
  message?: string;
  data: TemplateListType[];
  total: number;
}

export function getTemplateOutlineList(params: TemplateListParamsType) {
  return SurveyService.post<TemplateLisResponse>('/api/template/list-outline', {
    ...params,
  });
}

export default getTemplateOutlineList;
