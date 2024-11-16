'use client';
import { SystemListType } from '@/api/system/getSystemListAll';
import { CaretDownOutlined, UploadOutlined } from '@ant-design/icons';
import type { TreeDataNode, UploadProps } from 'antd';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Radio,
  Tree,
  Upload,
} from 'antd';
import { FunctionComponent, useState } from 'react';
import NewCollectItem from './new-collect-item';

const props: UploadProps = {
  name: 'file',
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: <span style={{ color: '#1677ff' }}>sss</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

interface CollectProps {
  system: SystemListType;
}

const NewCollectSet: FunctionComponent<CollectProps> = props => {
  const { system } = props;
  console.log('system', system);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any>([]);

  const showDrawer = () => {
    setOpen(true);
  };

  const pushItem = (item: any) => {
    const newItem: any = { ...item, id: new Date().getTime() };
    setItems([...items, newItem]);
  };

  const renderFormItem = (key: string) => {
    switch (key) {
      case 'input':
        return <Input type="input" />;
      case 'radio':
        return (
          <Radio.Group>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Radio.Group>
        );

      case 'file':
        return (
          <Upload {...props}>
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
            treeData={treeData}
          />
        );
      default:
        break;
    }
  };
  return (
    <div className="shadow-md h-[78vh] p-2 w-full overflow-auto">
      <div className="flex justify-end px-5">
        <Button onClick={showDrawer}>新增题目</Button>
      </div>
      <div className="min-w-[50vh] flex justify-center">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-96"
        >
          {items.length > 0 ? (
            items.map((item: any) => (
              <Form.Item
                key={item.id}
                label={item.label}
                name={item.label}
                rules={[
                  {
                    required: item.required,
                    message: 'Please input your username!',
                  },
                ]}
              >
                {renderFormItem(item.widget)}
              </Form.Item>
            ))
          ) : (
            <Empty />
          )}

          {items.length > 0 && (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button disabled htmlType="submit">
                提交调查
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>

      {items.length > 0 && (
        <>
          <Divider orientation="left">配置保存</Divider>
          <div className="flex justify-end px-5">
            <Button type="primary">保存配置</Button>
          </div>
        </>
      )}

      <NewCollectItem open={open} setOpen={setOpen} pushItem={pushItem} />
    </div>
  );
};

export default NewCollectSet;
