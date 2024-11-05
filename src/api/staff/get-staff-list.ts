import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

interface StaffListParamsType {
  currentSystemId?: number;
  currentOrgId?: number;
}

export interface StaffListResponse {
  id: number;
  currentOrgId: number;
  currentRoleId: number;
  currentSystemId: number;
  staffName: string;
  cellphone: string;
  staffType: number;
  tags: CustomTreeDataNode[];
}

function getStaffList(params: StaffListParamsType) {
  return SurveyService.post<CommonResponseType<StaffListResponse[]>>(
    `${baseUrl}/staff/list`,
    {
      ...params,
    }
  );
}

export default getStaffList;
