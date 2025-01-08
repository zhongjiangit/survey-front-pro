'use client';

import { SystemListType } from '@/api/system/getSystemListAll';
import CustomTree, {
  CustomTreeDataNode,
} from '@/components/common/custom-tree';

import Api from '@/api';
import { TagSaveParamsType } from '@/api/org/save-org-tree';
import { OrgDetailParamsType } from '@/api/org/set-detail';
import {
  OperationType,
  OperationTypeEnum,
  TagTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Spin,
  Switch,
  TreeSelect,
} from 'antd';
import { isNaN } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface NodeProps {
  system: SystemListType;
}

const Node = (props: NodeProps) => {
  const { system } = props;
  const [treeSelectData, setTreeSelectData] = useState([]);
  const [orgTags, setOrgTags] = useState<CustomTreeDataNode[]>();
  const searchParams = useSearchParams();
  const nodeSelected = searchParams.get('node');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: tagList, run: getTagList } = useRequest(() => {
    return Api.getTagList({
      currentSystemId: system.id,
      tagType: TagTypeEnum.Org,
    });
  });

  useEffect(() => {
    if (tagList?.data) {
      const tags = tagList.data;
      // 递归遍历增加value字段，用于TreeSelect，value为key
      const addValue = (node: CustomTreeDataNode) => {
        if (node.children) {
          node.children.forEach(child => {
            addValue(child);
          });
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        node.value = node.key;
      };
      tags.forEach(addValue);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setTreeSelectData(tags);
    }
  }, [tagList]);

  const setTags = useCallback((tags: any) => {
    setOrgTags(tags);
  }, []);

  const { run: saveOrgTree } = useRequest(
    params => {
      console.log('params', params);

      return Api.saveOrgTree(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response?.data?.orgs) {
          setTags([response?.data?.orgs]);
        }
      },
    }
  );

  const { run: setOrgDetail, loading: setOrgDetailLoading } = useRequest(
    params => {
      return Api.setOrgDetail(params);
    },
    {
      manual: true,
      onSuccess() {
        messageApi.open({
          type: 'success',
          content: '配置保存成功',
        });
      },
    }
  );

  const { loading: getOrgListLoading } = useRequest(
    () => {
      return Api.getOrgList({
        currentSystemId: system.id,
      });
    },
    {
      refreshDeps: [system.id],
      onSuccess(response) {
        if (response?.data?.orgs) {
          setTags([response?.data?.orgs]);
        }
      },
    }
  );

  useRequest(
    () => {
      if (!system.id || isNaN(Number(nodeSelected))) {
        form.resetFields();
        return Promise.reject('参数不全');
      }
      return Api.getOrgDetails({
        currentSystemId: system.id,
        orgId: Number(nodeSelected),
      });
    },
    {
      refreshDeps: [system.id, nodeSelected],
      onSuccess(response) {
        if (response?.data) {
          // 重新获取标签列表
          getTagList();
          const values = response?.data;
          form.setFieldsValue({
            managerName: values.managerName,
            cellphone: values.cellphone,
            isValid: values.isValid === 1,
            tags: values.tags.map((tag: { key: number }) => tag.key),
          });
        }
      },
    }
  );

  const onFinish = (values: any) => {
    const params: OrgDetailParamsType = {
      currentSystemId: system.id,
      orgId: Number(nodeSelected),
      // isValid 转换为1或0
      isValid: values.isValid ? 1 : 0,
      managerName: values.managerName,
      cellphone: values.cellphone,
      tags: [],
    };
    if (values.tags) {
      // 装换成key的json数组
      params.tags = values.tags.map((tag: string) => ({
        key: Number(tag),
      }));
    }
    setOrgDetail(params);
  };

  const onCreate = (
    tags: CustomTreeDataNode[],
    type?: OperationType,
    tagId?: string | number
  ) => {
    const orgTags = tags && Array.isArray(tags) ? tags[0] : null;
    // 如果tags存在，递归遍历删除里面的key
    if (orgTags) {
      const removeKey = (node?: CustomTreeDataNode) => {
        if (node?.children) {
          node.children.forEach(child => {
            removeKey(child);
          });
        }
        // 如果node.key为string类型，删除
        if (typeof node?.key === 'string') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          delete node?.key;
          delete node?.type;
          delete node?.isLeaf;
        } else if (node?.key) {
          delete node?.type;
          delete node?.isLeaf;
        }
      };
      removeKey(orgTags);
    }

    // 保存到相应的标签中
    if (orgTags) {
      let params: TagSaveParamsType = {
        currentSystemId: system.id,
        // @ts-expect-error: operationType is missing
        orgs: orgTags,
      };
      console.log('tagId', tagId, type);

      if (
        type === OperationTypeEnum.Update ||
        type === OperationTypeEnum.Delete
      ) {
        params = {
          ...params,
          operationType: type,
          // @ts-expect-error: operationOrgId is missing
          operationOrgId: tagId,
        };
      } else if (type === OperationTypeEnum.Add) {
        params = {
          ...params,
          operationType: type,
        };
      }
      saveOrgTree(params);
    } else {
      messageApi.open({
        type: 'info',
        content: '请先添加标签',
      });
    }
  };

  return (
    <div className="flex h-auto gap-3 min-h-[78vh]">
      {contextHolder}
      <div className="shadow-md h-[78vh] p-2 w-auto min-w-48 max-w-72 overflow-auto">
        {getOrgListLoading ? (
          <div className="flex justify-center items-center h-20">
            <Spin />
          </div>
        ) : (
          <CustomTree
            dataSource={orgTags ? orgTags : []}
            setParam
            setDataSource={setTags}
            onHandleCreate={onCreate}
            maxDepth={system.levelCount}
          />
        )}
      </div>
      <div className="flex-1 shadow-md h-[78vh] p-2 overflow-auto">
        <div>
          <Divider orientation="left">单位基本信息</Divider>
          {nodeSelected && !isNaN(Number(nodeSelected)) ? (
            <Form
              {...layout}
              form={form}
              name="control-hooks"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
              initialValues={{
                isValid: true,
              }}
            >
              <Form.Item
                name="managerName"
                label="管理员姓名"
                rules={[{ required: true }]}
              >
                <Input type="input" />
              </Form.Item>
              <Form.Item
                name="cellphone"
                label="管理员电话"
                rules={[{ required: true }]}
              >
                <Input type="input" />
              </Form.Item>
              <Form.Item
                name="isValid"
                label="是否启用"
                rules={[{ required: true }]}
              >
                <Switch />
              </Form.Item>
              <Form.Item name="tags" label="单位标签">
                <TreeSelect
                  showSearch
                  style={{ width: '320px' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择单位标签"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  treeData={treeSelectData}
                  treeCheckable={true}
                  showCheckedStrategy={'SHOW_PARENT'}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={setOrgDetailLoading}
                >
                  保存单位配置
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Empty
              description="请在左侧选择节点进行配置"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Node;
