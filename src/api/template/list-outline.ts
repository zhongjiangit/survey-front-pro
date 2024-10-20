import { TemplateType, ZeroOrOneType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface TemplateListParamsType {
  currentSystemId: number;
  templateType: TemplateType;
}

export interface TemplateItemType {
  templateId: number;
  templateTitle: string;
  isValid: ZeroOrOneType;
  memo: string;
}

interface TemplateLisResponse {
  result: number;
  message?: string;
  data: TemplateItemType[];
  total: number;
}

export function getTemplateOutlineList(params: TemplateListParamsType) {
  return SurveyService.post<TemplateLisResponse>('/api/template/list-outline', {
    ...params,
  });
}

export default getTemplateOutlineList;
