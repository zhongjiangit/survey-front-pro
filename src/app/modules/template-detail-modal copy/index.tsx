import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import renderFormItem from '@/lib/render-form-item';
import { TemplateType } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Button, Empty, Form, Modal } from 'antd';
import { ReactNode, useState } from 'react';

interface TemplateDetailModalProps {
  title?: string;
  showDom?: ReactNode;
  templateId: number;
  TemplateType: TemplateType;
}

const TemplateDetailModal = ({
  title,
  showDom,
  templateId,
  TemplateType,
}: TemplateDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);

  const { data } = useRequest(
    () => {
      return Api.getTemplateDetails({
        currentSystemId: currentSystem?.systemId!,
        templateId: templateId,
        templateType: TemplateType,
      }).then(value => {
        return value;
      });
    },
    {
      refreshDeps: [templateId, open],
    }
  );

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        {showDom || '模板详情'}
      </a>

      <Modal
        width={1400}
        open={open}
        title={title || '模板详情'}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
      >
        <Form
          form={form}
          className="min-w-96 w-[40vw]"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          name="template_detail_modal"
        >
          {!!data?.data?.items?.length ? (
            data?.data?.items.map((item: CollectItemType, index: number) => (
              <div className="flex" key={index}>
                <Form.Item
                  className="flex-1"
                  key={index}
                  label={item.itemCaption}
                  name={item.widgetId}
                  rules={[
                    {
                      required: item.isRequired === 1,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  {renderFormItem({
                    type: item.widgetType || 'input',
                    option: item.widgetDetails,
                  })}
                </Form.Item>
              </div>
            ))
          ) : (
            <Empty />
          )}
          <Form.Item className="flex justify-center">
            <Button disabled type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TemplateDetailModal;