'use client';
import Breadcrumbs from '@/components/common/breadcrumbs';
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
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import NewCollectItem from './new-collect-item';
import { useRequest } from 'ahooks';
import Api from '@/api';
import { TemplateTypeEnum } from '@/interfaces/CommonType';

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

const NewCollectSet = () => {
  const searchParams = useSearchParams();
  const systemId = searchParams.get('id');
  const tempId = searchParams.get('tempId');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any>([]);

  const {
    run: getCollectList,
    data: collectList,
    loading,
  } = useRequest(() => {
    return Api.getTemplateDetails({
      currentSystemId: Number(systemId),
      templateType: TemplateTypeEnum.Collect,
      templateId: Number(tempId),
    });
  });

  const { run: getAllWidgetsList, data: widgetList } = useRequest(() => {
    return Api.getAllWidgetsList({
      currentSystemId: Number(systemId),
    });
  });

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
    <main>
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '配置系统',
            href: `/survey/system/config?id=${systemId}&tab=collect`,
            active: true,
          },
          {
            label: '资料收集配置',
            href: `/survey/system/config?id=${systemId}&tab=collect`,
            active: false,
          },
        ]}
      />
      <div className="shadow-md h-[83vh] p-2 w-full overflow-auto">
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
    </main>
  );
};

export default NewCollectSet;
