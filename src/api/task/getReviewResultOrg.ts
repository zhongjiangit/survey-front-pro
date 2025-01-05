import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

// 获取指定单位评审结果

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
orgId	int		要查看的单位id
*/

interface GetReviewResultOrgParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  orgId: number;
}

/*
  averageScore	int		单位平均分
  dimensionScores	[]json		维度评价
    dimensionId	int		维度id
    dimensionName	string		维度名称(指标)
    guideline	string		评分准则
    reviewAverageScore	int		维度平均分
*/
interface GetReviewResultOrgResponse {
  averageScore: number;
  dimensionScores: {
    dimensionId: number;
    dimensionName: string;
    guideline: string;
    reviewAverageScore: number;
  }[];
}

/**
 * getReviewResultOrg
 * @param params
 * @returns
 */
function getReviewResultOrg(params: GetReviewResultOrgParamsType) {
  return SurveyService.post<CommonResponseType<GetReviewResultOrgResponse[]>>(
    `${baseUrl}/task/getReviewResultOrg`,
    {
      ...params,
    }
  );
}

export default getReviewResultOrg;
