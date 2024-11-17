import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统idcurrentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		评审的问卷id
dimensionScores	[]json		维度评价
  dimensionId	int		维度id
  reviewScore	int		维度评分
expertComment	string		专家点评
*/

interface SaveReviewDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
  dimensionScores: {
    dimensionId: number;
    reviewScore: number;
  }[];
  expertComment: string;
}

/*
singleFillId	int		问卷id
*/
export interface SaveReviewDetailsResponse {}

/**
 * saveReviewDetails
 * @param params
 * @returns
 */
function saveReviewDetails(params: SaveReviewDetailsParamsType) {
  return SurveyService.post<CommonResponseType<SaveReviewDetailsResponse>>(
    `${baseUrl}/task/saveReviewDetails`,
    {
      ...params,
    }
  );
}

export default saveReviewDetails;
