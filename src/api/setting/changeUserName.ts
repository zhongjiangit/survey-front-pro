import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
currentRoleId	int		"登录用户当前操作的角色id
                    平台管理员：10
                    系统管理员：20
                    单位管理员：30
                    普通管理员：40
                    普通成员：50
                    专家：60"
userNameNew	string		新用户名
 
 */
interface ChangeUserNameParamsType {
  currentSystemId: number;
  currentOrgId: number;
  currentRoleId: number;
  userNameNew: string;
}

interface ChangeUserNameResponse {}

/**
 * changeUserName
 * @param params
 * @returns
 */

function changeUserName(params: ChangeUserNameParamsType) {
  return SurveyService.post<CommonResponseType<ChangeUserNameResponse>>(
    `${baseUrl}/setting/changeUserName`,
    {
      ...params,
    }
  );
}

export default changeUserName;
