import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

// 获取指定单位评审结果

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
fillerStaffId	int		填报人id
*/

interface GetReviewResultStaffParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  fillerStaffId: number;
}

/*
  	[]json		
  fillerAverageScore	int		个人平均分
  singleFills	[]json		试卷
    singleFillId	int		问卷id
    fillIndex	int		试题编号
    averageScore	int		试卷得分
    dimensionScores	[]json		维度评价
      dimensionId	int		维度id
      dimensionName	string		维度名称(指标)
      reviewAverageScore	int		维度平均分
    expertComments	[]json		所有专家点评
      expertName	string		专家名称
      expertComment	string		专家点评
*/
interface GetReviewResultStaffResponse {
  fillerAverageScore: number;
  singleFills: {
    singleFillId: number;
    fillIndex: number;
    averageScore: number;
    dimensionScores: {
      dimensionId: number;
      dimensionName: string;
      reviewAverageScore: number;
    }[];
    expertComments: {
      expertName: string;
      expertComment: string;
    }[];
  }[];
}

/**
 * getReviewResultStaff
 * @param params
 * @returns
 */
function getReviewResultStaff(params: GetReviewResultStaffParamsType) {
  return SurveyService.post<CommonResponseType<GetReviewResultStaffResponse[]>>(
    `${baseUrl}/task/getReviewResultStaff`,
    {
      ...params,
    }
  );
}

export default getReviewResultStaff;
