import { StaffType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

type TagsType = {
  key: number;
};

interface StaffUpdateParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
  staffName: string;
  cellphone: string;
  staffType: StaffType;
  tags?: TagsType[];
}

/**
 * updateStaff
 * @param params
 * @returns
 */

function updateStaff(params: StaffUpdateParamsType) {
  return SurveyService.post<CommonResponseType>('/api/staff/update', {
    ...params,
  });
}
export default updateStaff;
