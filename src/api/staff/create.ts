import { SurveyService } from '@/service';
import { StaffType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

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
 * createStaff
 * @param params
 * @returns
 */

function createStaff(params: StaffCreateParamsType) {
  return SurveyService.post<CommonResponseType<StaffCreateResponse>>(
    `${baseUrl}/staff/create`,
    {
      ...params,
    }
  );
}

export default createStaff;
