import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
    `${baseUrl}/expert/list`,
    {
      ...params,
    }
  );
}

export default getExpertList;
