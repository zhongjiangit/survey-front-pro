import { CommonResponseType } from '@/interfaces/ResponseType';
import { SurveyService } from '@/service';
import { baseUrl } from '../config';

interface StaffDeleteParamsType {
  id: number;
  currentSystemId: number;
  currentOrgId: number;
}

/**
 * deleteStaff
 * @param params
 * @returns
 */

function deleteStaff(params: StaffDeleteParamsType) {
  return SurveyService.post<CommonResponseType>(`${baseUrl}/staff/delete`, {
    ...params,
  });
}
export default deleteStaff;
