import { WidgetType } from '@/interfaces/CommonType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

export interface ListAllWidgetsParamsType {
  currentSystemId: number;
}

export interface TemplateListType {
  id: number;
  widgetName: string;
  widgetType: WidgetType;
  widgetDetails: any;
}

interface WidgetLisResponse {
  result: number;
  message?: string;
  data: TemplateListType[];
  total: number;
}

export function getAllWidgetsList(params: ListAllWidgetsParamsType) {
  return SurveyService.post<WidgetLisResponse>(
    `${baseUrl}/template/listAllWidgets`,
    {
      ...params,
    }
  );
}

export default getAllWidgetsList;
