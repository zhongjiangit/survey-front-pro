import { SurveyService } from '@/service';
import { TemplateType, ZeroOrOneType } from '@/types/CommonType';
import { WidgetType } from '../../types/CommonType';
import { baseUrl } from '../config';

export interface TemplateDetailParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateId: number;
}

export interface CollectItemType {
  itemCaption: string; // 标题
  isRequired: ZeroOrOneType; // 是否必填
  widgetId: number; // 控件ID
  widgetType: WidgetType; // 控件类型
  widgetName: string; // 控件名称
  itemMemo: string; // 备注
  templateItemId: number; // 模板项ID
}

export interface TemplateDetailType {
  templateId: number;
  items: CollectItemType[];
  dimensions: {
    dimensionName: string;
    score: number;
    guideline: string;
  }[];
}

interface TemplateDetailResponse {
  result: number;
  message?: string;
  data: TemplateDetailType;
  total: number;
}

export function getTemplateDetails(params: TemplateDetailParamsType) {
  return SurveyService.post<TemplateDetailResponse>(
    `${baseUrl}/template/getDetails`,
    {
      ...params,
    }
  );
}

export default getTemplateDetails;
