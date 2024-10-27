import { CaretDownOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input, Radio, Tree, Upload } from 'antd';
const { TextArea } = Input;

interface RenderFormItemProps {
  type: string;
  option: any;
}

const RenderFormItem = (props: RenderFormItemProps) => {
  const { type, option } = props;
  const renderFormItem = (key: string, option: any) => {
    switch (key) {
      case 'input':
        return <Input type="input" />;
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

  return <>{renderFormItem(type, option)}</>;
};

export default RenderFormItem;
