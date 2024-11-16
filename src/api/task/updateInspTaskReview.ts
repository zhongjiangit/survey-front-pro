import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

/*
taskId	int		任务id
currentSystemId	int		登录用户当前操作的系统id
currentOrgId	int		登录用户当前操作的单位id
beginTimeReviewEstimate	string		预计评审开始时间 yyyy-mm-dd hh:MM:ss
endTimeReviewEstimate	string		预计评审结束时间 yyyy-mm-dd hh:MM:ss
showFiller	int		是否允许专家查看填报人信息  0：不允许  1：允许
showExpertName	int		是否允许填报人查看评分专家姓名 0：不允许  1：允许
showExpertComment	int		是否允许填报人查看评分专家意见 0：不允许  1：允许
*/

interface UpdateInspTaskReviewParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  beginTimeReviewEstimate: string;
  endTimeReviewEstimate: string;
  showFiller: number;
  showExpertName: number;
  showExpertComment: number;
  [key: string]: any;
}

interface UpdateInspTaskReviewResponse {}

/**
 * updateInspTaskReview
 * @param params
 * @returns
 */
function updateInspTaskReview(params: UpdateInspTaskReviewParamsType) {
  return SurveyService.post<CommonResponseType<UpdateInspTaskReviewResponse>>(
    `${baseUrl}/task/updateInspTaskReview`,
    {
      ...params,
    }
  );
}

export default updateInspTaskReview;
