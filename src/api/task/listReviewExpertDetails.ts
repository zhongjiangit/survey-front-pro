import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

// 获取专家评审详情

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
singleFillId	int		问卷id
type	int		1：已通过专家 2：待审核专家 3：待提交专家  4:已驳回专家
*/

interface ListReviewExpertDetailsParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  singleFillId: number;
  type: number;
}

/*
			[]json		
  singleFillId	int		问卷id
  expertId	int		专家id
  expertName	string		专家名称
  cellphone	string		专家电话
  fillerOrgId	int		填报人单位id
  fillerOrgName	string		填报人单位名称
  fillerStaffId	int		填报人id
  fillerStaffName	string		填报人名称
  totalScore	int	○	专家评分，没有该字段不传
  dimensionScores	[]json	○	维度评价，没有该字段不传
    dimensionId	int		维度id
    dimensionName	string		维度名称
    reviewScore	int		维度评分
  expertComment	string	○	专家点评，没有该字段不传
  processStatus	int		"评审状态 
                  10：未填报
                  20：未提交
                  30：待提交专家-数据
                  40：待审核专家-数据
                  50：已提交
                  60：已通过
                  70：已驳回
                  80：已通过专家-数据
                  90：已驳回专家-数据
                  100：数据丢弃"
*/
interface ListReviewExpertDetailsResponse {
  singleFillId: number;
  expertId: number;
  expertName: string;
  cellphone: string;
  fillerOrgId: number;
  fillerOrgName: string;
  fillerStaffId: number;
  fillerStaffName: string;
  totalScore: number;
  dimensionScores: {
    dimensionId: number;
    dimensionName: string;
    reviewScore: number;
  }[];
  expertComment: string;
  processStatus: number;
}

/**
 * listReviewExpertDetails
 * @param params
 * @returns
 */
function listReviewExpertDetails(params: ListReviewExpertDetailsParamsType) {
  return SurveyService.post<
    CommonResponseType<ListReviewExpertDetailsResponse[]>
  >(`${baseUrl}/task/listReviewExpertDetails`, {
    ...params,
  });
}

export default listReviewExpertDetails;
