import { TemplateType, ZeroOrOne } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface TemplateDetailParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateId: number;
}

export interface TemplateDetailType {
  templateId: number;
  items: {
    itemCaption: string; // 标题
    isRequired: ZeroOrOne; // 是否必填
    widgetId: number; // 控件ID
    widgetName: string; // 控件名称
    itemMemo: string; // 备注
  }[];
  dimensions: {
    dimensionName: string;
    score: number;
    guideline: string;
  }[];
}

interface TemplateDetailResponse {
  result: number;
  message?: string;
  data: TemplateDetailType[];
  total: number;
}

export function getTemplateDetails(params: TemplateDetailParamsType) {
  return SurveyService.post<TemplateDetailResponse>(
    '/api/template/get-details',
    {
      ...params,
    }
  );
}

export default getTemplateDetails;
