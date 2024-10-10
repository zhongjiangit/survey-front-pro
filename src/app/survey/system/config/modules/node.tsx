'use client';

import CustomTree from '@/components/common/custom-tree';
import { SystemListType } from '@/data/system/useSystemListAllSWR';
import {
  Button,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  Space,
  Switch,
  TreeSelect,
} from 'antd';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
  console.log('system', system);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [drawerName, setDrawerName] = useState('');
  const searchParams = useSearchParams();
  const nodeSelected = searchParams.get('node');
  const [value, setValue] = useState<string>();
  const [form] = Form.useForm();

  const onClose = () => {
    setDrawerOpen(false);
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <div className="flex h-auto gap-3 min-h-[78vh]">
      <div className="shadow-md h-[78vh] p-2 w-auto min-w-48 max-w-72 overflow-auto">
        <CustomTree dataSource={[]} setParam />
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
                active: true,
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
                name="active"
                label="是否启用"
                rules={[{ required: true }]}
              >
                <Switch />
              </Form.Item>
              <Form.Item name="tags" label="单位标签">
                <TreeSelect
                  showSearch
                  style={{ width: '320px' }}
                  value={value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择单位标签"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  treeData={[]}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary">保存单位配置</Button>
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
      <Drawer
        maskClosable={false}
        title={drawerName}
        onClose={onClose}
        open={drawerOpen}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={onClose} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        <CustomTree dataSource={tags} />
      </Drawer>
    </div>
  );
};

export default Node;
