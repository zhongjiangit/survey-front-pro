'use client';

import type { TableProps } from 'antd';
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  TreeSelect,
} from 'antd';
import { FunctionComponent, useState } from 'react';

interface ExpertManageProps {}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },

  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'good') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>删除</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: '专家1',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: '专家2',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['good'],
  },
  {
    key: '3',
    name: '专家3',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
          {
            value: 'leaf2',
            title: 'your leaf',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'sss',
            title: <b style={{ color: '#08c' }}>sss</b>,
          },
        ],
      },
    ],
  },
];

interface Values {
  name?: string;
  phone?: string;
  tags?: string;
}

const ExpertManage: FunctionComponent<
  ExpertManageProps
> = ({}: ExpertManageProps) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Values>();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  console.log(formValues);

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setFormValues(values);
    setOpen(false);
  };
  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          新增专家
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        open={open}
        title="新增专家"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{}}
            clearOnDestroy
            onFinish={values => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入专家姓名!' }]}
        >
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入专家电话号码!' }]}
        >
          <Input type="textarea" addonBefore={'+86'} />
        </Form.Item>
        <Form.Item
          label="标签"
          name="tags"
          className="collection-create-form_last-form-item"
        >
          <TreeSelect
            showSearch
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择节点标签"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default ExpertManage;
