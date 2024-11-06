import { SurveyService } from '@/service';
import { TemplateType, ZeroOrOneType } from '@/types/CommonType';
import { baseUrl } from '../config';

export interface TemplateListParamsType {
  currentSystemId: number;
  templateType: TemplateType;
}

export interface TemplateItemType {
  currentSystemId: number;
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
  return SurveyService.post<TemplateLisResponse>(
    `${baseUrl}/template/listOutline`,
    {
      ...params,
    }
  );
}

export default getTemplateOutlineList;
