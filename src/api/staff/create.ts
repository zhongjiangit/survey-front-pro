import { StaffType } from '@/interfaces/CommonType';
import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

type TagsType = {
  key: number;
};

interface StaffCreateParamsType {
  currentSystemId: number;
  currentOrgId: number;
  staffName: string;
  cellphone: string;
  staffType: StaffType;
  tags?: TagsType[];
}

interface StaffCreateResponse {
  id: number;
}

/**
 * useStaffCreateMutation
 * @param params
 * @returns
 */

function createStaff(params: StaffCreateParamsType) {
  return SurveyService.post<CommonResponseType<StaffCreateResponse>>(
    '/api/staff/create',
    {
      ...params,
    }
  );
}

export default createStaff;
