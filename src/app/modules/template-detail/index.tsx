import { CollectItemType } from '@/api/template/get-details';
import renderFormItem from '@/lib/render-form-item';
import { useRequest } from 'ahooks';
import { Button, Form } from 'antd';
import Api from '@/api';

interface TemplateDetailProps {
  templateId?: number;
}

const TemplateDetail = ({}: TemplateDetailProps) => {
  const [form] = Form.useForm();
  const { data } = useRequest(() => {
    return Api.getTemplateDetails({
      currentSystemId: 5,
      templateId: 1,
      templateType: 1,
    });
  });

  return (
    <Form
      form={form}
      className="min-w-96 w-[40vw]"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
      name="template_detail"
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
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TemplateDetail;
