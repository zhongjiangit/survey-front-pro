'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import type { TableProps } from 'antd';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  TreeSelect,
} from 'antd';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface ExpertManageProps {
  canEdit: boolean;
  orgId: React.Key | undefined;
  expertTags: any;
}

interface TableFormDateType {
  id: number | string;
  currentOrgId?: number;
  currentRoleId?: number;
  CurrentSystemId?: number;
  expertName?: string;
  cellphone?: string;
  tags?: { key: number; title: string }[];
}

interface Values {
  expertName: string;
  cellphone: string;
  tags?: string;
}

const ExpertManage: FunctionComponent<ExpertManageProps> = ({
  canEdit,
  orgId,
  expertTags,
}: ExpertManageProps) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<TableFormDateType[]>([]);
  const [currentExpert, setCurrentExpert] = useState({} as TableFormDateType);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (currentExpert.id) {
      form.setFieldsValue(currentExpert);
      setOpen(true);
    }
  }, [currentExpert, form]);

  const closeModal = useCallback(() => {
    form.resetFields();
    setCurrentExpert({} as TableFormDateType);
    setOpen(false);
  }, [form]);

  const { run: getExpertList, loading: getListLoading } = useRequest(
    () => {
      return Api.getExpertList({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: Number(orgId),
      });
    },
    {
      refreshDeps: [orgId, currentSystem?.systemId],
      onSuccess(response) {
        if (Array.isArray(response?.data)) {
          // @ts-ignore
          setDataSource(response.data);
        }
      },
    }
  );

  const { run: createExpert, loading: createLoading } = useRequest(
    params => {
      return Api.createExpert(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          closeModal();
          getExpertList();
          messageApi.success('新增成功');
        } else {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        }
      },
    }
  );

  const { run: updateExpert, loading: updateLoading } = useRequest(
    params => {
      return Api.updateExpert(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          closeModal();
          getExpertList();
          messageApi.success('更新成功');
        } else {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        }
      },
    }
  );

  const { run: deleteExpert, loading: deleteLoading } = useRequest(
    params => {
      return Api.deleteExpert(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          getExpertList();
          messageApi.success('删除成功');
        } else {
          messageApi.open({
            type: 'error',
            content: response.message,
          });
        }
      },
    }
  );

  const onSave = useCallback(
    (values: any) => {
      // 将tags转成对象数组
      values.tags = values.tags?.map((tag: number) => ({ key: tag }));

      if (currentSystem?.systemId && currentOrg?.orgId) {
        if (!!currentExpert.id) {
          updateExpert({
            id: currentExpert.id,
            currentSystemId: currentSystem?.systemId,
            currentOrgId: currentOrg?.orgId,
            expertName: values.expertName,
            cellphone: values.cellphone,
            tags: values?.tags || [],
          });
        } else {
          createExpert({
            currentSystemId: currentSystem?.systemId,
            currentOrgId: currentOrg?.orgId,
            expertName: values.expertName,
            cellphone: values.cellphone,
            tags: values?.tags || [],
          });
        }
      }
    },
    [
      currentExpert,
      currentSystem?.systemId,
      currentOrg?.orgId,
      updateExpert,
      createExpert,
    ]
  );

  const onDelete = useCallback(
    (id: number) => {
      if (currentSystem?.systemId && currentOrg?.orgId) {
        deleteExpert({
          id,
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
        });
      }
    },
    [currentSystem, currentOrg, deleteExpert]
  );

  const columns: TableProps<TableFormDateType>['columns'] = useMemo(
    () => [
      {
        title: '专家姓名',
        dataIndex: 'expertName',
        key: 'expertName',
        render: text => <a>{text}</a>,
      },

      {
        title: '电话',
        dataIndex: 'cellphone',
        key: 'cellphone',
      },
      {
        title: '标签',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
          <>
            {tags?.map(tag => {
              return (
                <Tag color={'geekblue'} key={tag.key}>
                  {tag.title}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => {
          if (canEdit) {
            return (
              <Space size="small">
                <Popconfirm
                  key="delete"
                  title="删除此项"
                  onConfirm={() => {
                    onDelete(Number(record.id));
                  }}
                >
                  <a className="hover:text-red-500">删除</a>
                </Popconfirm>
                <a
                  onClick={() => {
                    setCurrentExpert(record);
                  }}
                >
                  编辑
                </a>
              </Space>
            );
          } else {
            return <span>-</span>;
          }
        },
      },
    ],
    [canEdit, onDelete]
  );

  return (
    <div>
      {contextHolder}
      <div className="flex justify-end mb-3">
        <Button
          type="primary"
          disabled={!canEdit}
          onClick={() => {
            form.resetFields();
            setOpen(true);
          }}
        >
          新增专家
        </Button>
      </div>
      <Table
        loading={getListLoading}
        columns={columns}
        dataSource={dataSource}
      />
      <Modal
        open={open}
        title={`${1 ? '编辑' : '新增'}专家`}
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={closeModal}
        destroyOnClose
        confirmLoading={createLoading || updateLoading}
        modalRender={dom => (
          <Form
            layout="vertical"
            form={form}
            name="expert_form_in_modal"
            onFinish={values => onSave(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="expertName"
          label="专家姓名"
          rules={[{ required: true, message: '请输入专家姓名!' }]}
        >
          <Input type="input" />
        </Form.Item>
        <Form.Item
          name="cellphone"
          label="电话"
          rules={[{ required: true, message: '请输入专家电话号码!' }]}
        >
          <Input type="input" addonBefore={'+86'} />
        </Form.Item>
        <Form.Item
          label="标签"
          name="tags"
          className="collection-create-form_last-form-item"
        >
          <TreeSelect
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择节点标签"
            allowClear
            multiple
            treeDefaultExpandAll
            treeData={[]}
            treeCheckable={true}
            showCheckedStrategy={'SHOW_PARENT'}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default ExpertManage;
