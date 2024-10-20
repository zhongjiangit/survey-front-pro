'use client';
import Breadcrumbs from '@/components/common/breadcrumbs';
import {
  CaretDownOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { TreeDataNode, UploadProps } from 'antd';
import {
  Button,
  Checkbox,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Radio,
  Spin,
  Tree,
  Upload,
} from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import NewCollectItem from './new-collect-item';
import { useLocalStorageState, useRequest } from 'ahooks';
import Api from '@/api';
import { TemplateTypeEnum } from '@/interfaces/CommonType';
import { CollectItemType } from '@/api/template/get-details';
import { cn } from '@/lib/utils';

const { TextArea } = Input;

export type NewCollectItemType = CollectItemType & { id: number };

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
  const [canEdit, setCanEdit] = useState(true);
  const [items, setItems] = useState<any>([]);
  const [currentItem, setCurrentItem] = useState<NewCollectItemType>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [templateDetail, setTemplateDetail] = useLocalStorageState<any>(
    'copied-template-detail',
    {
      defaultValue: { items: [] },
    }
  );

  const { loading, data: responseData } = useRequest(
    () => {
      return Api.getTemplateDetails({
        currentSystemId: Number(systemId),
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
      });
    },
    {
      onSuccess: response => {
        console.log('response', response);
        console.log('templateDetail', templateDetail);

        if (response?.data.items?.length > 0) {
          setItems(response.data.items);
          setCanEdit(false);
        } else {
          if (response?.data.templateId === templateDetail?.newTemplateId) {
            console.log('templateDetail', templateDetail);

            setCanEdit(true);
            setItems(templateDetail?.items);
          }
        }
      },
    }
  );

  const { run: createDetails, loading: createLoading } = useRequest(
    items => {
      // 删除items中的id
      items.forEach((item: any) => {
        delete item.id;
      });
      return Api.createCollectDetails({
        currentSystemId: Number(systemId),
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
        items: items,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        router.push(`/survey/system/config?id=${systemId}&tab=collect`);
        messageApi.open({
          type: 'success',
          content: '保存成功',
        });
      },
    }
  );

  const createItem = () => {
    setOpen(true);
    setCurrentItem(undefined);
  };

  const pushItem = (item: any) => {
    if (item?.id) {
      const newItems = items.map((oldItem: any) => {
        if (oldItem.id === item.id) {
          return item;
        }
        return oldItem;
      });
      setItems(newItems);
    } else {
      const newItem: any = { ...item, id: new Date().getTime() };
      setItems([...items, newItem]);
    }
  };

  const removeItem = (id: number) => {
    const newItems = items.filter((item: any) => item.id !== id);
    setItems(newItems);
  };

  const renderFormItem = (key: string) => {
    switch (key) {
      case 'input':
        return <Input type="textarea" />;
      case 'textarea':
        return <TextArea rows={3} />;
      case 'radio':
        return (
          <Radio.Group>
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <Checkbox.Group
            options={[
              { label: 'Apple', value: 'Apple' },
              { label: 'Pear', value: 'Pear' },
              { label: 'Orange', value: 'Orange' },
            ]}
          />
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
      {contextHolder}
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '系统管理', href: '/survey/system' },
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
      <div className="shadow-md pt-6 h-[83vh] p-2 w-full overflow-auto">
        <div className="flex justify-end px-5">
          {canEdit && (
            <Button type="primary" onClick={createItem}>
              新增题目
            </Button>
          )}
        </div>
        <div className="min-w-[50vw] flex justify-start">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="min-w-96 w-[40vw]"
          >
            {items.length > 0 &&
              items.map((item: NewCollectItemType, index: number) => (
                <div className="flex">
                  <Form.Item
                    className="flex-1"
                    key={index}
                    label={item.itemCaption}
                    name={item.widgetId}
                    rules={[
                      {
                        required: item.isRequired === 1,
                        message: 'Please input your username!',
                      },
                    ]}
                  >
                    {renderFormItem(item.widgetType || 'input')}
                  </Form.Item>
                  <div
                    className={cn(
                      'flex items-start justify-end gap-2 w-10 pt-2',
                      {
                        hidden: !canEdit,
                      }
                    )}
                  >
                    <EditOutlined
                      className="hover:scale-125 cursor-pointer"
                      onClick={() => {
                        setCurrentItem(item);
                        setOpen(true);
                      }}
                    />
                    <DeleteOutlined
                      className="text-red-500 hover:scale-125 cursor-pointer"
                      onClick={() => {
                        removeItem(item.id);
                      }}
                    />
                  </div>
                </div>
              ))}

            {items.length > 0 && (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button disabled htmlType="submit">
                  提交调查
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : items.length === 0 ? (
          <Empty />
        ) : canEdit ? (
          <>
            <Divider orientation="left">配置保存</Divider>
            <div className="flex justify-end px-5">
              <Button
                type="primary"
                onClick={() => {
                  createDetails(items);
                }}
                loading={createLoading}
                disabled={loading || responseData?.data.items.length !== 0}
              >
                保存配置
              </Button>
            </div>
          </>
        ) : null}

        <NewCollectItem
          open={open}
          setOpen={setOpen}
          pushItem={pushItem}
          initValues={currentItem}
        />
      </div>
    </main>
  );
};

export default NewCollectSet;
