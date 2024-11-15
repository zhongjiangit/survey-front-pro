import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
taskId	int		任务id
*/

interface GetInspTaskReviewParamsType {
  currentSystemId: number;
  currentOrgId: number;
  taskId: number;
}

/*
taskId	int		任务id
taskName	string		任务名称
beginTimeReviewEstimate	string		预计评审开始时间 yyyy-mm-dd hh:MM:ss
endTimeReviewEstimate	string		预计评审结束时间 yyyy-mm-dd hh:MM:ss
showFiller	int		是否允许专家查看填报人信息  0：不允许  1：允许
showExpertName	int		是否允许填报人查看评分专家姓名 0：不允许  1：允许
showExpertComment	int		是否允许填报人查看评分专家意见 0：不允许  1：允许
*/
interface GetInspTaskReviewResponse {
  taskId: number;
  taskName: string;
  beginTimeReviewEstimate: string;
  endTimeReviewEstimate: string;
  showFiller: number;
  showExpertName: number;
  showExpertComment: number;
}

/**
 * getInspTaskReview
 * @param params
 * @returns
 */
function getInspTaskReview(params: GetInspTaskReviewParamsType) {
  return SurveyService.post<CommonResponseType<GetInspTaskReviewResponse>>(
    `${baseUrl}/task/getInspTaskReview`,
    {
      ...params,
    }
  );
}

export default getInspTaskReview;
