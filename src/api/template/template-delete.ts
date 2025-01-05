import { SurveyService } from '@/service';
import { baseUrl } from '../config';

/*
 id	int		模板id
currentSystemId	int		登录用户当前操作的系统id
 */
export interface TemplateDeleteParamsType {
  id: number;
  currentSystemId: number;
}

export function deleteTemplate(params: TemplateDeleteParamsType) {
  return SurveyService.post(`${baseUrl}/template/delete`, {
    ...params,
  });
}

export default deleteTemplate;
