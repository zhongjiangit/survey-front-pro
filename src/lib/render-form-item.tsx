import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Radio, TreeSelect, Upload } from 'antd';
const { TextArea } = Input;

interface RenderFormItemProps {
  type: string;
  option: any;
  item: any;
}

const RenderFormItem = (props: RenderFormItemProps) => {
  const { type, option, item } = props;
  const formatTreeData = (data: any) => {
    return data.map((item: any) => {
      if (item?.children?.length > 0) {
        return {
          title: item.title,
          value: item.key,
          key: item.key,
          children: formatTreeData(item.children),
        };
      }
      return {
        title: item.title,
        value: item.key,
        key: item.key,
      };
    });
  };

  const renderFormItem = (key: string, option: any) => {
    switch (key) {
      case 'input':
        return <Input type="input" />;
      case 'textarea':
        return <TextArea rows={3} />;
      case 'radio':
        if (option?.length > 0) {
          return <Radio.Group options={option} />;
        }
        return null;
      case 'checkbox':
        if (option?.length > 0) {
          return <Checkbox.Group options={option} />;
        }
        return null;
      case 'file':
        return (
          <Upload {...props} type={undefined}>
            <Button icon={<UploadOutlined />}>点击上传文件</Button>
          </Upload>
        );
      case 'tree':
        if (option) {
          return (
            <TreeSelect
              treeData={formatTreeData([option])}
              treeCheckable={true}
              showCheckedStrategy={'SHOW_PARENT'}
              placeholder={'请选择'}
              style={{
                width: '100%',
              }}
            />
          );
        }
        return null;

      default:
        break;
    }
  };

  return (
    <Form.Item
      className="flex-1"
      label={item.itemCaption}
      name={item.templateItemId}
      extra={<span className="text-red-500">{item?.itemMemo}</span>}
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
