import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface ShowReviewResultParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
 	[]json		
  orgCount	int		各级单位数量
  org[n]	json		各级单位信息，按从上到下顺序，[n]依次取1，2，3。。。直到orgCount字段所标识数量,例如 org1,org2,org3。。。
    orgId	int		单位id
    orgName	string		单位名称
    averageScore	int		平均分
  fillerStaffId	int		填报人成员id
  fillerStaffName	string		填报人成员名称
  fillerCellphone	string		填报人手机号
  fillerAverageScore	int		个人平均分
  singleFills	[]json		试卷
    singleFillId	int		问卷id
    fillIndex	int		试题编号
    score	int		试卷得分
 */
interface ShowReviewResultResponse {
  orgCount: number;
  org: {
    orgId: number;
    orgName: string;
    averageScore: number;
  }[];
  fillerStaffId: number;
  fillerStaffName: string;
  fillerCellphone: string;
  fillerAverageScore: number;
  singleFills: {
    singleFillId: number;
    fillIndex: number;
    score: number;
  }[];
}

/**
 * showReviewResult
 * @param params
 * @returns
 */
function showReviewResult(params: ShowReviewResultParamsType) {
  return SurveyService.post<CommonResponseType<ShowReviewResultResponse[]>>(
    `${baseUrl}/task/showReviewResult`,
    {
      ...params,
    }
  );
}

export default showReviewResult;
