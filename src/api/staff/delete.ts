import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';

interface StaffDeleteParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
}

/**
 * useStaffDeleteMutation
 * @param params
 * @returns
 */

function deleteStaff(params: StaffDeleteParamsType) {
  return SurveyService.post<CommonResponseType>('/api/staff/delete', {
    ...params,
  });
}
export default deleteStaff;
