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
      if (item.children) {
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
      // return (
      //   <Tree
      //     style={{ width: 400, paddingTop: 4 }}
      //     switcherIcon={
      //       <CaretDownOutlined className="absolute top-[7px] right-[7px]" />
      //     }
      //     checkable
      //     treeData={[option]}
      //   />
      // );
      default:
        break;
    }
  };

  console.log('item', item);

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
