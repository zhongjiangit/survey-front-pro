import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

interface DeleteFillAttachmentParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  singleFillId: number;
  templateItemId: number;
  attachmentId: number;
}

interface DeleteFillAttachmentResponse {}

/**
 * 删除填报的附件
 * @param params
 * @returns
 */
function deleteFillAttachment(params: DeleteFillAttachmentParamsType) {
  return SurveyService.post<CommonResponseType<DeleteFillAttachmentResponse>>(
    `${baseUrl}/task/deleteFillAttachment`,
    params
  );
}

export default deleteFillAttachment;
