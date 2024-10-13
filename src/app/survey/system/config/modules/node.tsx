'use client';

import CustomTree, {
  CustomTreeDataNode,
} from '@/components/common/custom-tree';
import useOrgListSWR from '@/data/org/useOrgListSWR';
import useOrgSaveMutation from '@/data/org/useOrgSaveMutation';
import useOrgSetMutation, {
  TagCreateParamsType,
} from '@/data/org/useOrgSetMutation';
import { SystemListType } from '@/data/system/useSystemListAllSWR';
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Switch,
  TreeSelect,
} from 'antd';
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
  const [orgTags, setOrgTags] = useState<CustomTreeDataNode[]>();
  const searchParams = useSearchParams();
  const nodeSelected = searchParams.get('node');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const setTags = useCallback((tags: any) => {
    setOrgTags(tags);
  }, []);

  const {
    trigger: createTrigger,
    isMutating: createMutating,
    data: createCallbackData,
  } = useOrgSaveMutation();

  const {
    trigger: setTrigger,
    isMutating: setMutating,
    data: setCallbackData,
  } = useOrgSetMutation();

  const { data: orgsData, mutate: muteTags } = useOrgListSWR({
    currentSystemId: system.id,
  });

  useEffect(() => {
    if (orgsData?.data.data?.orgs) {
      setTags([orgsData?.data.data?.orgs]);
    }
  }, [orgsData, setTags]);

  useEffect(() => {
    if (createCallbackData?.data.data?.orgs) {
      setTags([createCallbackData?.data.data?.orgs]);
    }
  }, [createCallbackData, setTags]);

  const onFinish = (values: any) => {
    const params: TagCreateParamsType = {
      currentSystemId: system.id,
      orgId: Number(nodeSelected),
      // isValid 转换为1或0
      isValid: values.isValid ? 1 : 0,
      // adminName: values.adminName,
      // adminPhone: values.adminPhone,
      tags: [],
    };
    if (!!values.tags) {
      // 装换成key的json数组
      params.tags = values.tags.map((tag: string) => ({
        key: Number(tag),
      }));
    }
    setTrigger(params);
  };

  const onCreate = (tags: CustomTreeDataNode[]) => {
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
          // @ts-ignore
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
      createTrigger({
        currentSystemId: system.id,
        // @ts-ignore
        orgs: orgTags,
      });
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
        <CustomTree
          dataSource={orgTags ? orgTags : []}
          setParam
          setDataSource={setTags}
          onHandleCreate={onCreate}
        />
      </div>
      <div className="flex-1 shadow-md h-[78vh] p-2 overflow-auto">
        <div>
          <Divider orientation="left">单位基本信息</Divider>
          {nodeSelected ? (
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
                name="adminName"
                label="管理员姓名"
                rules={[{ required: true }]}
              >
                <Input type="textarea" />
              </Form.Item>
              <Form.Item
                name="adminPhone"
                label="管理员电话"
                rules={[{ required: true }]}
              >
                <Input type="textarea" />
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
                  treeData={[]}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
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
