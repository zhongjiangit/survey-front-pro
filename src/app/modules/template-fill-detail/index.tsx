'use client';

import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import getSingleFillFormData from '@/app/modules/template-fill-detail/getSingleFillFormData';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import RenderFormItem from '@/lib/render-form-item';
import {
  ArrWidgetTypes,
  DetailShowType,
  DetailShowTypeEnum,
  TemplateType,
  TemplateTypeEnum,
  WidgetTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Button, Form, message } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface TemplateDetailProps {
  templateId?: number;
  singleFillId?: number;
  taskId: number;
  templateType?: TemplateType;
  showType?: DetailShowType;
}

const TemplateFillDetail = ({
  templateId,
  templateType,
  singleFillId,
  taskId,
  showType = DetailShowTypeEnum.Fill,
}: TemplateDetailProps) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

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
      if (!currentSystem?.systemId || !currentOrg?.orgId || !singleFillId) {
        return Promise.reject('参数补全');
      }
      return Api.getSingleFillDetails({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        singleFillId: singleFillId,
        taskId: taskId,
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
    taskId,
    singleFillId,
    getSingleFillDetails,
  ]);

  const { runAsync: saveSingleFillDetails, loading: submitLoading } =
    useRequest(
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
    if (!currentSystem?.systemId || !currentOrg?.orgId || !singleFillId) {
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
      taskId: taskId,
      items: formattedValues,
    };

    await saveSingleFillDetails(fillData);
    messageApi.success('保存成功!');
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
    const values = getSingleFillFormData({
      formDetailData: formDetailData?.data!,
      singleFillDetails: singleFillDetails?.data!,
      deleteFillAttachment,
      params: {
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
        singleFillId: singleFillId!,
        taskId: taskId,
      },
    });
    oldFormData.current = values;
    form.setFieldsValue(values);
  }, [
    currentOrg?.orgId,
    currentSystem?.systemId,
    deleteFillAttachment,
    form,
    formDetailData,
    singleFillDetails,
    singleFillId,
    taskId,
  ]);

  return (
    <>
      <Form
        form={form}
        disabled={showType === DetailShowTypeEnum.Check}
        className="fillCollect-form min-w-96 w-[40vw] flex justify-center"
        autoComplete="off"
        name="template_detail"
        layout="vertical"
      >
        <div className="w-96">
          {formDetailData?.data?.items?.length &&
            formDetailData?.data?.items.map(
              (item: CollectItemType, index: number) => (
                <div className="flex" key={index}>
                  <RenderFormItem
                    item={item}
                    type={item.widgetType || 'input'}
                    option={
                      widgetList?.find(
                        (widget: any) => widget.id === item.widgetId
                      )?.widgetDetails
                    }
                  />
                </div>
              )
            )}
          {showType !== DetailShowTypeEnum.Check && (
            <Form.Item className="fillCollect-form-action flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                onClick={saveSingleFill}
              >
                保存
              </Button>
            </Form.Item>
          )}
        </div>
      </Form>
      {contextHolder}
    </>
  );
};

export default TemplateFillDetail;
