import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import RenderFormItem from '@/lib/render-form-item';
import { TemplateType } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Button, Empty, Form, Modal } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import getSingleFillFormData from '../template-fill-detail/getSingleFillFormData';

interface TemplateDetailModalProps {
  title?: string;
  showDom?: ReactNode;
  templateId: number;
  taskId?: number;
  singleFillId?: number;
  TemplateType: TemplateType;
  description?: string;
}

const TemplateDetailModal = ({
  title,
  showDom,
  templateId,
  TemplateType,
  taskId,
  singleFillId,
  description = '',
}: TemplateDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [widgetList, setWidgetList] = useState<any>([]);

  const { data: singleFillDetails } = useRequest(
    () => {
      if (!open || !currentSystem?.systemId || !singleFillId || !taskId) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getSingleFillDetails({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
        singleFillId: singleFillId,
        taskId: taskId,
      });
    },
    {
      refreshDeps: [singleFillId, taskId, open],
    }
  );

  const { data, run: getTemplateDetail } = useRequest(
    () => {
      if (!currentSystem?.systemId) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getTemplateDetails({
        currentSystemId: currentSystem.systemId,
        templateId: templateId,
        templateType: TemplateType,
      }).then(value => {
        return value;
      });
    },
    {
      manual: true,
    }
  );

  const { run: getAllWidgetsList } = useRequest(
    () => {
      if (!currentSystem) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getAllWidgetsList({
        currentSystemId: Number(currentSystem?.systemId),
      });
    },
    {
      manual: true,
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
    if (open) {
      getTemplateDetail();
      getAllWidgetsList();
    }
  }, [getAllWidgetsList, getTemplateDetail, open]);

  useEffect(() => {
    if (!open || !data || !singleFillDetails) {
      return;
    }
    form.setFieldsValue(
      getSingleFillFormData({
        formDetailData: data?.data,
        singleFillDetails: singleFillDetails.data,
        deleteFillAttachment: () => {},
        params: {
          currentSystemId: currentSystem?.systemId!,
          currentOrgId: currentOrg?.orgId!,
          singleFillId: singleFillId!,
          taskId: taskId!,
        },
      })
    );
  }, [singleFillDetails, data, open]);

  return (
    <>
      <a
        className="text-blue-500 flex justify-center max-w-8"
        onClick={() => {
          setOpen(true);
        }}
      >
        {showDom || '模板详情'}
      </a>

      <Modal
        width={1200}
        open={open}
        title={title || '模板详情'}
        onCancel={() => {
          setOpen(false);
        }}
        maskClosable={false}
        footer={null}
      >
        <div className="flex gap-5 justify-between">
          <Form
            form={form}
            disabled
            className="min-w-96 w-[40vw]"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            name="template_detail_modal"
          >
            {data?.data?.items?.length ? (
              data?.data?.items.map((item: CollectItemType, index: number) => (
                <div className="flex" key={index}>
                  <RenderFormItem
                    type={item.widgetType || 'input'}
                    option={
                      widgetList?.find(
                        (widget: any) => widget.id === item.widgetId
                      )?.widgetDetails
                    }
                    item={item}
                  />
                </div>
              ))
            ) : (
              <Empty />
            )}
            {!singleFillDetails && (
              <Form.Item className="flex justify-center">
                <Button disabled type="primary" htmlType="submit">
                  保存
                </Button>
              </Form.Item>
            )}
          </Form>
          <div className="flex flex-col justify-start items-center w-80">
            <h2 className="text-lg font-bold">任务说明</h2>
            <div>{description}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TemplateDetailModal;
