import { WidgetType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';

export interface ListAllWidgetsParamsType {
  currentSystemId: number;
}

export interface TemplateListType {
  id: number;
  widgetName: string;
  widgetType: WidgetType;
}

interface WidgetLisResponse {
  result: number;
  message?: string;
  data: TemplateListType[];
  total: number;
}

export function getAllWidgetsList(params: ListAllWidgetsParamsType) {
  return SurveyService.post<WidgetLisResponse>(
    '/api/template/list-all-widgets',
    {
      ...params,
    }
  );
}

export default getAllWidgetsList;
