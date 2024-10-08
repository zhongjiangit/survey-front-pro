'use client';

import { UploadOutlined } from '@ant-design/icons';
import type { TreeDataNode, UploadProps } from 'antd';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Tree,
  Upload,
} from 'antd';
import { FunctionComponent, useState } from 'react';
import NewCheckItem from './new-check-item';
import NewCollectItem from './new-collect-item';
import React from 'react';
import { SystemListType } from '@/data/system/useSystemListAllSWR';

interface CheckProps {
  system: SystemListType;
}

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

const SpotCheck: FunctionComponent<CheckProps> = props => {
  const { system } = props;
  console.log('system', system);

  const [newCollectItemDrawerOpen, setNewCollectItemDrawerOpen] =
    useState(false);
  const [newCheckItemOpen, setNewCheckItemOpen] = useState(false);
  const [collectItems, setCollectItems] = useState<any>([]);
  const [checkItems, setCheckItems] = useState<any>([]);

  const showDrawer = () => {
    setNewCollectItemDrawerOpen(true);
  };

  const pushCollectItem = (item: any) => {
    const newItem: any = { ...item, id: new Date().getTime() };
    setCollectItems([...collectItems, newItem]);
  };

  const pushCheckItem = (item: any) => {
    const newItem: any = { ...item, id: new Date().getTime() };
    setCheckItems([...checkItems, newItem]);
  };

  const renderFormItem = (key: string) => {
    switch (key) {
      case 'input':
        return <Input type="textarea" />;
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
        return <Tree checkable treeData={treeData} />;
      default:
        break;
    }
  };

  return (
    <div className="shadow-md h-[78vh] p-2 w-full overflow-auto">
      <div
        style={{
          display: 'flex',
          height: '40px',
          gap: '24px',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={() => {
            setNewCheckItemOpen(true);
          }}
        >
          调查配置
        </Button>
        <Button onClick={showDrawer} type="primary">
          新增题目
        </Button>
      </div>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Divider orientation="left">新增题目</Divider>

        {collectItems.length > 0 ? (
          collectItems.map((item: any) => (
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

        <Divider orientation="left">评分维度</Divider>
        {checkItems.length > 0 ? (
          checkItems.map((item: any) => (
            <Form.Item
              key={item.id}
              label={item.label}
              name={item.label}
              tooltip={item.standards}
              rules={[
                {
                  required: item.required,
                  message: 'Please input your username!',
                },
              ]}
            >
              <InputNumber width={320} min={1} max={10} defaultValue={1} />
            </Form.Item>
          ))
        ) : (
          <Empty />
        )}
      </Form>

      {(collectItems.length > 0 || checkItems.length > 0) && (
        <>
          <Divider orientation="left">配置保存</Divider>
          <div className="flex justify-end px-5">
            <Button type="primary">保存配置</Button>
          </div>
        </>
      )}

      <NewCollectItem
        open={newCollectItemDrawerOpen}
        setOpen={setNewCollectItemDrawerOpen}
        pushItem={pushCollectItem}
      />
      <NewCheckItem
        open={newCheckItemOpen}
        setOpen={setNewCheckItemOpen}
        pushItem={pushCheckItem}
      />
    </div>
  );
};

export default SpotCheck;
