import type { FormProps } from 'antd';
import { Button, Drawer, Form, Input, Switch } from 'antd';
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
    isRequired?: string;
    standards?: string;
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
        title="新增评分维度"
        onClose={onClose}
        destroyOnClose
        maskClosable={false}
        open={open}
      >
        <Form
          name="checkItem"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ required: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          clearOnDestroy={true}
        >
          <Form.Item<FieldType>
            label="评分指标"
            name="label"
            rules={[{ required: true, message: '请输入指标名称' }]}
          >
            <Input type="input" placeholder="输入指标名称" />
          </Form.Item>
          <Form.Item<FieldType>
            label="是否必填"
            name="isRequired"
            rules={[{ required: true, message: '请选择是否必填!' }]}
          >
            <Switch />
          </Form.Item>
          <Form.Item<FieldType>
            label="评分准则"
            name="standards"
            rules={[{ required: false, message: '请输入评分准则!' }]}
          >
            <Input type="input" placeholder="输入评分准则" />
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
