import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { CaretDownOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Radio, Tree, Upload } from 'antd';
const { TextArea } = Input;

interface RenderFormItemProps {
  type: string;
  option: any;
  item: any;
}

const RenderFormItem = (props: RenderFormItemProps) => {
  const { type, option, item } = props;

  const renderFormItem = (key: string, option: any) => {
    switch (key) {
      case 'input':
        return (
          // <Form.Item
          //   className="flex-1"
          //   label={item.itemCaption}
          //   name={item.widgetId}
          //   rules={[
          //     {
          //       required: item.isRequired === ZeroOrOneTypeEnum.One,
          //       message: `${item.itemCaption}为必填项`,
          //     },
          //   ]}
          // >
          <Input type="input" />
          // </Form.Item>
        );
      case 'textarea':
        return <TextArea rows={3} />;
      case 'radio':
        return <Radio.Group options={option} />;
      case 'checkbox':
        return <Checkbox.Group options={option} />;
      case 'file':
        return (
          <Upload {...props} type={undefined}>
            <Button icon={<UploadOutlined />}>点击上传文件</Button>
          </Upload>
        );

      case 'tree':
        return (
          <Tree
            style={{ width: 400, paddingTop: 4 }}
            switcherIcon={
              <CaretDownOutlined className="absolute top-[7px] right-[7px]" />
            }
            checkable
            treeData={[option]}
          />
        );
      default:
        break;
    }
  };
  return (
    <Form.Item
      className="flex-1"
      label={item.itemCaption}
      name={item.templateItemId}
      rules={[
        {
          required: item.isRequired === ZeroOrOneTypeEnum.One,
          message: `${item.itemCaption}为必填项`,
        },
      ]}
    >
      {renderFormItem(type, option)}
    </Form.Item>
  );
};

export default RenderFormItem;
