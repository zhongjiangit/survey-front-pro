import { CollectItemType } from '@/api/template/get-details';
import renderFormItem from '@/lib/render-form-item';
import { EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Form, Modal } from 'antd';
import { ReactNode, useState } from 'react';
import Api from '@/api';

interface TemplateDetailModalProps {
  showDom?: ReactNode;
  templateId?: number;
}

const TemplateDetailModal = ({ showDom }: TemplateDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const { data } = useRequest(() => {
    return Api.getTemplateDetails({
      currentSystemId: 5,
      templateId: 1,
      templateType: 1,
    });
  });

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
        width={'70vw'}
        open={open}
        title="模板详情"
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
          {data?.data?.items?.length &&
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
            ))}
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
