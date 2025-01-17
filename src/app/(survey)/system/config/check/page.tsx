'use client';
import Api from '@/api';
import { CollectItemType } from '@/api/template/get-details';
import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import RenderFormItem from '@/lib/render-form-item';
import { cn } from '@/lib/utils';
import { TemplateTypeEnum } from '@/types/CommonType';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useLocalStorageState, useRequest } from 'ahooks';
import type { UploadProps } from 'antd';
import { Button, Divider, Empty, Form, message, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import NewCollectItem from '../modules/new-collect-item';
import ScoreTable from './score-table';

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

export default function Page() {
  const searchParams = useSearchParams();
  const systemId = searchParams.get('id');
  const tempId = searchParams.get('tempId');
  const [open, setOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [items, setItems] = useState<any>([]);
  const [dimensions, setDimensions] = useState<any>([]);
  const [currentItem, setCurrentItem] = useState<NewCollectItemType>();
  const [messageApi, contextHolder] = message.useMessage();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const router = useRouter();
  const [widgetList, setWidgetList] = useState<any>([]);
  const [templateDetail, setTemplateDetail] = useLocalStorageState<any>(
    'copied-template-detail',
    {
      defaultValue: { items: [] },
    }
  );

  const { loading, data: responseData } = useRequest(
    () => {
      if (!systemId || !tempId) {
        return Promise.reject('systemId or tempId is not exist');
      }
      return Api.getTemplateDetails({
        currentSystemId: Number(systemId),
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
      });
    },
    {
      manual: true,
      onSuccess: response => {
        if (
          response?.data.items?.length > 0 ||
          response?.data.dimensions?.length > 0
        ) {
          setItems(response.data.items);
          // 为response.data.dimensions添加id
          response.data.dimensions.forEach((item: any, index) => {
            item.id = new Date().getTime() - index;
          });
          setDimensions(response.data.dimensions);
          setCanEdit(false);
        } else {
          if (response?.data.templateId === templateDetail?.newTemplateId) {
            setCanEdit(true);
            // 为templateDetail.items添加id
            templateDetail.items.forEach((item: any, index: number) => {
              item.id = new Date().getTime() - index;
            });
            // 为templateDetail.dimensions添加id
            templateDetail.dimensions.forEach((item: any, index: number) => {
              item.id = new Date().getTime() - index;
            });

            setItems(templateDetail?.items);
            setDimensions(templateDetail?.dimensions);
          }
        }
      },
    }
  );

  const { run: createDetails, loading: createLoading } = useRequest(
    (items, dimensions) => {
      if (items && items?.length === 0) {
        messageApi.open({
          type: 'error',
          content: '请添加题目',
        });
        return Promise.reject('请添加题目');
      }
      if (dimensions && dimensions?.length === 0) {
        messageApi.open({
          type: 'error',
          content: '请添加评分维度',
        });
        return Promise.reject('请添加评分维度');
      }
      // 删除items中的id
      items.forEach((item: any) => {
        delete item.id;
      });
      // 删除dimensions中的id
      dimensions.forEach((item: any) => {
        delete item.id;
      });
      return Api.createCollectDetails({
        currentSystemId: Number(systemId),
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
        items: items,
        dimensions: dimensions,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        router.push(`/system/config?id=${systemId}&tab=check`);
        messageApi.open({
          type: 'success',
          content: '保存成功',
        });
      },
    }
  );

  useRequest(
    () => {
      if (!currentSystem) {
        return Promise.reject('currentSystem is not exist');
      }
      return Api.getAllWidgetsList({
        currentSystemId: Number(currentSystem?.systemId),
      });
    },
    {
      onSuccess: response => {
        if (response.data) {
          const widgets = response.data.reduce((acc: any, cur: any) => {
            return acc.concat(cur.widgets);
          }, []);
          setWidgetList(widgets);
        }
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

  return (
    <main>
      {contextHolder}
      <Breadcrumbs
        className="mb-2"
        breadcrumbs={[
          { label: '系统管理', href: '/system' },
          {
            label: '配置系统',
            href: `/system/config?id=${systemId}&tab=check`,
            active: true,
          },
          {
            label: '试题抽检配置',
            href: `/system/config?id=${systemId}&tab=check`,
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
        {items.length !== 0 ? (
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
                items.map((item: NewCollectItemType, index: number) => {
                  return (
                    <div className="flex" key={index}>
                      <RenderFormItem
                        type={item.widgetType || 'input'}
                        option={
                          widgetList?.find(
                            (widget: any) => widget.id === item.widgetId
                          )?.widgetDetails
                        }
                        item={item}
                      />
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
                  );
                })}

              {/* {items.length > 0 && (
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button disabled htmlType="submit">
                    提交调查
                  </Button>
                </Form.Item>
              )} */}
            </Form>
          </div>
        ) : (
          <Empty />
        )}
        <div
          className={cn({
            hidden: loading,
          })}
        >
          <Divider orientation="left">评分维度</Divider>
          <ScoreTable
            canEdit={canEdit}
            dataSource={dimensions}
            setDimensions={setDimensions}
          />
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <Spin size="large" />
          </div>
        ) : canEdit ? (
          <>
            <Divider orientation="left">配置保存</Divider>
            <div className="flex justify-end px-5">
              <Button
                type="primary"
                onClick={() => {
                  createDetails(items, dimensions);
                }}
                loading={createLoading}
                disabled={
                  loading ||
                  responseData?.data.items.length !== 0 ||
                  responseData?.data.dimensions.length !== 0
                }
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
}
