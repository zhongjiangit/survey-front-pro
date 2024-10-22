import type { FormProps } from 'antd';
import { Button, Drawer, Form, Input, Select, Switch } from 'antd';
import React from 'react';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  pushItem: (item: any) => void;
}

const NewCollectItem: React.FC<Props> = ({
  open,
  setOpen,
  pushItem,
}: Props) => {
  // const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  type FieldType = {
    label?: string;
    required?: string;
    remember?: string;
    widget?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    console.log('Success:', values);
    pushItem(values);
    onClose();
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Drawer
        title="新增题目"
        onClose={onClose}
        destroyOnClose
        maskClosable={false}
        open={open}
      >
        <Form
          name="item"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ required: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          clearOnDestroy={true}
        >
          <Form.Item<FieldType>
            label="标题"
            name="label"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input type="input" placeholder="输入标题" />
          </Form.Item>
          <Form.Item<FieldType>
            label="是否必填"
            name="required"
            rules={[{ required: true, message: '请选择是否必填!' }]}
          >
            <Switch />
          </Form.Item>
          <Form.Item<FieldType>
            label="选择控件"
            name="widget"
            rules={[{ required: true, message: '请选择展示控件' }]}
          >
            <Select
              placeholder="选择控件"
              optionFilterProp="label"
              options={[
                {
                  label: '输入框',
                  value: 'input',
                },
                {
                  label: '附件',
                  value: 'file',
                },
                {
                  label: '单选（题型）',
                  value: 'radio',
                },
                {
                  label: '内容素养（树状结构）',
                  value: 'tree',
                },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="提醒事项"
            name="remember"
            rules={[{ required: false, message: '请输入提醒事项!' }]}
          >
            <Input type="input" placeholder="输入提醒事项" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default NewCollectItem;
