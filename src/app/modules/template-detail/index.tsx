'use client';

import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import RenderFormItem from '@/lib/render-form-item';
import { TemplateType, TemplateTypeEnum } from '@/types/CommonType';
import { AnyObject } from '@/typings/type';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Button, Form } from 'antd';

interface TemplateDetailProps {
  templateId?: number;
  singleFillId?: number;
  templateType?: TemplateType;
}

const TemplateDetail = ({
  templateId,
  templateType,
  singleFillId,
}: TemplateDetailProps) => {
  const [form] = Form.useForm();
  const [currentFillTask] = useLocalStorageState<any>('current-fill-task', {
    defaultValue: {},
  });
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
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

  const { data: singleFillDetailsData } = useRequest(
    values => {
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
      refreshDeps: [
        currentSystem?.systemId,
        currentOrg?.orgId,
        currentFillTask?.taskId,
        singleFillId,
      ],
      onSuccess: data => {
        console.log('getSingleFillDetails', data);
        form.setFieldsValue(
          data?.data?.reduce((acc: AnyObject, cur: any) => {
            acc[cur.templateItemId] = cur.fillContent;
            return acc;
          }, {})
        );
      },
    }
  );

  const { run: saveSingleFillDetails } = useRequest(
    values => {
      return Api.saveSingleFillDetails({
        ...values,
      });
    },
    {
      manual: true,
    }
  );

  const saveSingleFill = () => {
    const formValues = form.getFieldsValue();
    console.log('formValues', formValues);
    const formattedValues = Object.entries(formValues).map(([key, value]) => ({
      templateItemId: Number(key),
      fillContent: value,
    }));
    const fillData = {
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId,
      singleFillId: singleFillId,
      items: formattedValues,
    };

    saveSingleFillDetails(fillData);
  };

  const { data: widgetList = { data: [] } } = useRequest(() => {
    if (!currentSystem) {
      return Promise.reject('currentSystem is not exist');
    }
    return Api.getAllWidgetsList({
      currentSystemId: Number(currentSystem?.systemId),
    });
  });

  console.log();

  return (
    <Form
      form={form}
      className="min-w-96 w-[40vw]"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      name="template_detail"
    >
      {formDetailData?.data?.items?.length &&
        formDetailData?.data?.items.map(
          (item: CollectItemType, index: number) => (
            <div className="flex" key={index}>
              {/* <Form.Item
                className="flex-1"
                label={item.itemCaption}
                name={item.widgetId}
                rules={[
                  {
                    required: item.isRequired === ZeroOrOneTypeEnum.One,
                    message: `${item.itemCaption}为必填项`,
                  },
                ]}
              > */}
              <RenderFormItem
                item={item}
                type={item.widgetType || 'input'}
                option={
                  widgetList.data.find(widget => widget.id === item.widgetId)
                    ?.widgetDetails
                }
              />
              {/* </Form.Item> */}
            </div>
          )
        )}
      <Form.Item className="flex justify-center">
        <Button type="primary" htmlType="submit" onClick={saveSingleFill}>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TemplateDetail;
