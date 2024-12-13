'use client';

import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import RenderFormItem from '@/lib/render-form-item';
import {
  ArrWidgetTypes,
  TemplateType,
  TemplateTypeEnum,
  WidgetTypeEnum,
} from '@/types/CommonType';
import { AnyObject } from '@/typings/type';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Button, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { baseUrl } from '@/api/config';

interface TemplateDetailProps {
  templateId?: number;
  singleFillId?: number;
  taskId?: number;
  templateType?: TemplateType;
}

const TemplateDetail = ({
  templateId,
  templateType,
  singleFillId,
  taskId,
}: TemplateDetailProps) => {
  const [form] = Form.useForm();
  const [currentFillTask] = useLocalStorageState<any>('current-fill-task', {
    defaultValue: {},
  });
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [widgetList, setWidgetList] = useState<any>([]);
  const oldFormData = useRef<any>({});

  const { data: formDetailData } = useRequest(() => {
    if (!currentSystem?.systemId) {
      return Promise.reject('currentSystem is not exist');
    }
    return Api.getTemplateDetails({
      currentSystemId: currentSystem.systemId,
      templateId: templateId ?? 1,
      templateType: templateType ?? TemplateTypeEnum.Collect,
    });
  });

  const { data: singleFillDetails, run: getSingleFillDetails } = useRequest(
    () => {
      if (
        !currentSystem?.systemId ||
        !currentOrg?.orgId ||
        !singleFillId ||
        !currentFillTask
      ) {
        return Promise.reject('参数补全');
      }
      return Api.getSingleFillDetails({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        singleFillId: singleFillId,
        taskId: currentFillTask.taskId,
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    getSingleFillDetails();
  }, [
    currentSystem?.systemId,
    currentOrg?.orgId,
    currentFillTask?.taskId,
    singleFillId,
  ]);

  const { run: saveSingleFillDetails } = useRequest(
    values => {
      return Api.saveSingleFillDetails({
        ...values,
      }).then(res => {
        getSingleFillDetails();
        return res;
      });
    },
    {
      manual: true,
    }
  );
  const { run: deleteFillAttachment } = useRequest(
    (attachmentId: number, templateItemId: number) => {
      return Api.deleteFillAttachment({
        taskId: taskId!,
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
        singleFillId: singleFillId!,
        templateItemId,
        attachmentId,
      });
    },
    {
      manual: true,
    }
  );

  const saveSingleFill = async () => {
    if (
      !currentSystem?.systemId ||
      !currentOrg?.orgId ||
      !singleFillId ||
      !currentFillTask
    ) {
      return Promise.reject('参数补全');
    }
    const formItems = formDetailData?.data?.items || [];
    const formValues = await form.validateFields();
    for (const item of formItems) {
      if (
        item.widgetType === WidgetTypeEnum.File &&
        formValues[item.templateItemId]
      ) {
        const fieldList = formValues[item.templateItemId] || [];
        const files = [];
        const oldFiles = oldFormData.current[item.templateItemId] || [];
        for (const file of fieldList) {
          if (!(file instanceof File)) {
            const idx = oldFiles.findIndex((f: any) => f.uid === file.uid);
            if (idx !== -1) {
              oldFiles.splice(idx, 1);
            }
            continue;
          }
          // 上传文件
          const res = await Api.uploadFillAttachment({
            taskId: taskId!,
            currentSystemId: currentSystem.systemId!,
            currentOrgId: currentOrg.orgId!,
            singleFillId: singleFillId!,
            templateItemId: item.templateItemId,
            attachment: file,
          });
          files.push(res.data);
        }
        // 删除已删除的文件
        for (const file of oldFiles) {
          await file.remove();
        }
        formValues[item.templateItemId] = files;
      }
    }

    const formattedValues = Object.entries(formValues).map(([key, value]) => {
      const item: any = {
        templateItemId: Number(key),
      };
      const widgetType = formItems.find(
        t => item.templateItemId === t.templateItemId
      )?.widgetType;
      if (widgetType === WidgetTypeEnum.File) {
        item.attachments = value;
      } else if (ArrWidgetTypes.includes(widgetType!)) {
        item.fillContent = value ? JSON.stringify(value) : value;
      } else {
        item.fillContent = value;
      }
      return item;
    });
    const fillData = {
      currentSystemId: currentSystem.systemId,
      currentOrgId: currentOrg?.orgId,
      singleFillId: singleFillId,
      taskId: currentFillTask.taskId,
      items: formattedValues,
    };

    saveSingleFillDetails(fillData);
  };

  useRequest(
    () => {
      if (!currentSystem) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getAllWidgetsList({
        currentSystemId: Number(currentSystem?.systemId),
      });
    },
    {
      onSuccess: response => {
        if (response.data) {
          const widgets = response.data.reduce((acc: any, cur: any) => {
            return acc.concat(cur.widgets);
          }, []);
          setWidgetList(widgets);
        }
      },
    }
  );

  useEffect(() => {
    if (!formDetailData && !singleFillDetails) {
      return;
    }
    const data = singleFillDetails;
    const params = {
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId,
      singleFillId: singleFillId,
      taskId: currentFillTask.taskId,
    };
    const getFileParams = (attachmentId: number, templateItemId: number) => {
      return Object.entries({ ...params, templateItemId, attachmentId })
        .map(v => v.join('='))
        .join('&');
    };
    form.setFieldsValue(
      data?.data?.reduce(
        (acc: AnyObject, cur: any) => {
          acc[cur.templateItemId] = cur.fillContent;
          const widget = formDetailData?.data?.items.find(
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
        },
        (oldFormData.current = {})
      )
    );
  }, [formDetailData, singleFillDetails]);

  return (
    <Form
      form={form}
      className="fillCollect-form min-w-96 w-[40vw]"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      name="template_detail"
    >
      {formDetailData?.data?.items?.length &&
        formDetailData?.data?.items.map(
          (item: CollectItemType, index: number) => (
            <div className="flex" key={index}>
              <RenderFormItem
                item={item}
                type={item.widgetType || 'input'}
                option={
                  widgetList?.find((widget: any) => widget.id === item.widgetId)
                    ?.widgetDetails
                }
              />
            </div>
          )
        )}
      <Form.Item className="fillCollect-form-action flex justify-center">
        <Button type="primary" htmlType="submit" onClick={saveSingleFill}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TemplateDetail;
