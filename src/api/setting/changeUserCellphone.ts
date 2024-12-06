import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
cellphoneOld	string	
verifyCodeForOld	string	
cellphoneNew	string	
verifyCodeForNew	string	
 */
interface ChangeUserCellphoneParamsType {
  cellphoneOld: string;
  verifyCodeForOld: string;
  cellphoneNew: string;
  verifyCodeForNew: string;
}

interface ChangeUserCellphoneResponse {}

/**
 * changeUserCellphone
 * @param params
 * @returns
 */

function changeUserCellphone(params: ChangeUserCellphoneParamsType) {
  return SurveyService.post<CommonResponseType<ChangeUserCellphoneResponse>>(
    `${baseUrl}/setting/changeUserCellphone`,
    {
      ...params,
    }
  );
}

export default changeUserCellphone;
