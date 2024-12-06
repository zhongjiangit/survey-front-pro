import { SurveyService } from '@/service';
import { WidgetType } from '@/types/CommonType';
import { baseUrl } from '../config';

export interface ListAllWidgetsParamsType {
  currentSystemId: number;
}

/*
 	[]json		
  groupId	int		控件组id
  groupName	string		控件组名称
  widgets	[]json		控件
    id	int		控件id
    widgetName	int		控件名称
    widgetType	string		控件类型 'input'  | 'radio' | 'checkbox'  | 'textarea' | 'file' | 'tree'
    widgetDetails	json或[]json	○	"控件类型为radio，checkbox时，结构为[{ label: 'xxx', value: 'xxx' }]
    控件类型为tree时，结构为
    {key:1,title:'xxx',childre:[{key:2,title:'xxx',children:...}]}
    其余类型，此字段为空"
 */

export interface WidgetItemType {
  id: number;
  widgetName: string;
  widgetType: WidgetType;
  widgetDetails: any;
}
export interface TemplateListType {
  groupId: number;
  groupName: string;
  widgets: WidgetItemType[];
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
