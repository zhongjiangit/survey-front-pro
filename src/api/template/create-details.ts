import { TemplateType, ZeroOrOneType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface CollectItemType {
  itemCaption: string;
  isRequired: ZeroOrOneType;
  widgetId: number;
  itemMemo?: string;
}

export interface DimensionsType {
  dimensionName: string;
  score: number;
  guideline: string;
}

export interface CollectParamsType {
  currentSystemId: number;
  templateType: TemplateType;
  templateId: number;
  items: CollectItemType[];
  dimensions?: DimensionsType[];
}

export function createCollectDetails(params: CollectParamsType) {
  return SurveyService.post('/api/template/create-details', {
    ...params,
  });
}

export default createCollectDetails;
