import { SurveyService } from '@/service';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
templateId	int		模版id
 */
export interface TemplateDeleteParamsType {
  currentSystemId: number;
  templateId: number;
}

export function deleteTemplate(params: TemplateDeleteParamsType) {
  return SurveyService.post(`${baseUrl}/template/delete`, {
    ...params,
  });
}

export default deleteTemplate;
