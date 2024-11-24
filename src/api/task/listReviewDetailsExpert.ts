import { SurveyService } from '@/service';
import { ProcessStatusType } from '@/types/CommonType';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
pageNumber	int		要取数据的页码数
pageSize	int		每页展示的数据条数
*/

interface ListReviewDetailsExpertParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
  pageNumber: number;
  pageSize: number;
}

/*
		[]json		
  singleFillId	int		问卷id
  templateId	int		模板id
  showFiller	int		是否允许专家查看填报人信息  0：不允许  1：允许
  showExpertName	int		是否允许填报人查看评分专家姓名 0：不允许  1：允许
  showExpertComment	int		是否允许填报人查看评分专家意见 0：不允许  1：允许
  fillerOrgId	int		填报人单位id
  fillerOrgId	int		填报人单位id
  fillerOrgName	string		填报人单位名称
  fillerStaffId	int		填报人成员id
  fillerStaffName	string		填报人成员名称
  fillIndex	int		试题编号
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
  totalScore	int		评分
  dimensionScores	[]json		维度评价
    dimensionId	int		维度id
    dimensionName	string		维度名称
    reviewScore	int		维度评分
  expertComment	string		专家点评
*/
export interface ListReviewDetailsExpertResponse {
  singleFillId: number;
  templateId: number;
  showFiller: number;
  showExpertName: number;
  showExpertComment: number;
  fillerOrgId: number;
  fillerOrgName: string;
  fillerStaffId: number;
  fillerStaffName: string;
  fillIndex: number;
  processStatus: ProcessStatusType;
  totalScore: number;
  dimensionScores: {
    dimensionId: number;
    dimensionName: string;
    reviewScore: number;
  }[];
  expertComment: string;
}

/**
 * listReviewDetailsExpert
 * @param params
 * @returns
 */
function listReviewDetailsExpert(params: ListReviewDetailsExpertParamsType) {
  return SurveyService.post<
    CommonResponseType<ListReviewDetailsExpertResponse[]>
  >(`${baseUrl}/task/listReviewDetailsExpert`, {
    ...params,
  });
}

export default listReviewDetailsExpert;
