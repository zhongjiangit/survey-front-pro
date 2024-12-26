import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Radio,
  TreeSelect,
  Upload,
} from 'antd';
import { useRequest } from 'ahooks';
import getConfig from '@/api/common/getConfig';
import FormItemWrap, {
  RenderChildren,
} from '@/components/common/form-item-wrap';
const { TextArea } = Input;

interface RenderFormItemProps {
  type: string;
  option: any;
  item: any;
}

const RenderFormItem = (props: RenderFormItemProps) => {
  const { type, option, item } = props;
  const { data: sysConfig } = useRequest(() =>
    getConfig().then(res => res.data)
  );
  const [messageApi, contextHolder] = message.useMessage();
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
        // eslint-disable-next-line no-case-declarations
        const renderChildren: RenderChildren = ({
          id,
          ref,
          value,
          disabled,
          onChange,
        }) => (
          <Upload
            id={id}
            ref={ref}
            fileList={value}
            disabled={disabled}
            beforeUpload={(file, fileList) => {
              if (
                sysConfig?.maxUploadFileSize &&
                sysConfig?.maxUploadFileSize < file.size
              ) {
                messageApi.error(
                  `${file.name} 文件超限,请选择小于 ${sysConfig.maxUploadFileSize / 1024 / 1024}M 的文件!`,
                  3
                );
              } else {
                onChange?.((value || []).concat(file));
              }
              return false;
            }}
            onRemove={file => {
              onChange?.(value.filter((t: any) => t.uid !== file.uid));
            }}
          >
            <Button icon={<UploadOutlined />}>点击上传文件</Button>
          </Upload>
        );

        return <FormItemWrap renderChildren={renderChildren} />;
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
    <>
      {contextHolder}
      <Form.Item
        className="flex-1"
        label={item.itemCaption}
        name={item.templateItemId}
        extra={false && <span className="text-red-500">{item?.itemMemo}</span>}
        rules={[
          {
            required: item.isRequired === ZeroOrOneTypeEnum.One,
            message: `${item.itemCaption}为必填项`,
          },
        ]}
      >
        {renderFormItem(type, option)}
      </Form.Item>
    </>
  );
};

export default RenderFormItem;
