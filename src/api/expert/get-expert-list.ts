import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

interface ExpertListParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
}

export interface ExpertListResponse {
  id: number;
  currentOrgId: number;
  currentRoleId: number;
  currentSystemId: number;
  expertName: string;
  cellphone: string;
  tags: CustomTreeDataNode[];
}

function getExpertList(params: ExpertListParamsType) {
  return SurveyService.post<CommonResponseType<ExpertListResponse[]>>(
    '/api/expert/list',
    {
      ...params,
    }
  );
}

export default getExpertList;
