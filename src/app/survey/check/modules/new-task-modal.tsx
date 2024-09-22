import { DatePicker, Form, Input, Modal, Select, SelectProps } from 'antd';
import { useState } from 'react';

interface Values {
  title?: string;
  description?: string;
  modifier?: string;
}

interface Props {
  newTaskModalOpen: boolean;
  setNewTaskModalOpen: (newTaskModalOpen: boolean) => void;
}

const { RangePicker } = DatePicker;

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const NewTaskModal = (props: Props) => {
  const { newTaskModalOpen, setNewTaskModalOpen } = props;
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Values>();

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setNewTaskModalOpen(false);
  };

  return (
    <>
      <pre>{JSON.stringify(formValues, null, 2)}</pre>
      <Modal
        open={newTaskModalOpen}
        title="新增调查"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setNewTaskModalOpen(false)}
        destroyOnClose
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={values => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="名称"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="title"
          label="调查时间"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <RangePicker showTime />
        </Form.Item>
        <Form.Item name="description" label="指标体系">
          <Select
            defaultValue="1"
            options={[
              { value: '1', label: '指标1' },
              { value: '2', label: '指标2' },
              { value: '3', label: '指标3' },
            ]}
          />
        </Form.Item>
        <Form.Item name="modifier" label="参与调查区域">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={['a10', 'c12']}
            options={options}
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default NewTaskModal;
