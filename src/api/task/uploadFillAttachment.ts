import { SurveyService } from '@/service';
import { CommonResponseType } from '@/types/ResponseType';
import { baseUrl } from '../config';

interface UploadFillAttachmentParamsType {
  taskId: number;
  currentSystemId: number;
  currentOrgId: number;
  singleFillId: number;
  templateItemId: number;
  attachment: File;
}

interface UploadFillAttachmentResponse {
  attachmentId: number;
  filename: string;
}

/**
 * updateInspTaskReview
 * @param params
 * @returns
 */
function uploadFillAttachment(params: UploadFillAttachmentParamsType) {
  const formData = new FormData();
  formData.append('taskId', params.taskId + '');
  formData.append('currentSystemId', params.currentSystemId + '');
  formData.append('currentOrgId', params.currentOrgId + '');
  formData.append('singleFillId', params.singleFillId + '');
  formData.append('templateItemId', params.templateItemId + '');
  formData.append('attachment', params.attachment);
  return SurveyService.post<CommonResponseType<UploadFillAttachmentResponse>>(
    `${baseUrl}/task/uploadFillAttachment`,
    formData
  );
}

export default uploadFillAttachment;
