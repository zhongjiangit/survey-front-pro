import { ArrWidgetTypes, WidgetTypeEnum } from '@/types/CommonType';
import { baseUrl } from '@/api/config';
import { AnyObject } from '@/typings/type';
import { TemplateDetailType } from '@/api/template/get-details';
import { GetSingleFillDetailsResponse } from '@/api/task/getSingleFillDetails';

interface DownloadFileParams {
  currentSystemId: number;
  currentOrgId: number;
  singleFillId: number;
  taskId: number;
}

interface GetSingleFillFormDataParams {
  formDetailData: TemplateDetailType;
  singleFillDetails: GetSingleFillDetailsResponse[];
  deleteFillAttachment: (attachmentId: number, templateItemId: number) => void;
  params: DownloadFileParams;
}

/**
 * 获取单个填报表单数据
 * @param formDetailData
 * @param singleFillDetails
 * @param deleteFillAttachment
 * @param params
 */
export default function getSingleFillFormData({
  formDetailData,
  singleFillDetails,
  deleteFillAttachment,
  params,
}: GetSingleFillFormDataParams) {
  const getFileParams = (attachmentId: number, templateItemId: number) => {
    return Object.entries({ ...params, templateItemId, attachmentId })
      .map(v => v.join('='))
      .join('&');
  };
  const items = formDetailData?.items || [];
  return singleFillDetails?.reduce((acc: AnyObject, cur: any) => {
    acc[cur.templateItemId] = cur.fillContent;
    const widget = items.find(
      (widget: any) => widget.templateItemId === cur.templateItemId
    );
    // 附件转换
    if (widget?.widgetType === WidgetTypeEnum.File && cur.attachments) {
      acc[cur.templateItemId] = cur.attachments?.map((item: any) => ({
        uid: item.attachmentId,
        name: item.filename,
        status: 'done',
        url: `${baseUrl}/task/downloadFillAttachment?${getFileParams(item.attachmentId, cur.templateItemId)}`,
        linkProps: { download: item.filename, target: null },
        remove: () =>
          deleteFillAttachment(item.attachmentId, cur.templateItemId),
      }));
    }
    if (ArrWidgetTypes.includes(widget?.widgetType!)) {
      acc[cur.templateItemId] = JSON.parse(cur.fillContent || '[]');
    }
    return acc;
  }, {});
}
