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

interface SaveReviewDetailsBatchParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  reviewDetails: {
    singleFillId: number;
    dimensionScores: {
      dimensionId: number;
      reviewScore: number;
    }[];
    expertComment: string;
  }[];
}

/**
 * saveReviewDetailsBatch
 * @param params
 * @returns
 */
function saveReviewDetailsBatch(params: SaveReviewDetailsBatchParamsType) {
  return SurveyService.post<CommonResponseType>(
    `${baseUrl}/task/saveReviewDetailsBatch`,
    params
  );
}

export default saveReviewDetailsBatch;
