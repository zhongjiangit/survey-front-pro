'use client';

import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { PopconfirmProps, TreeDataNode, TreeProps } from 'antd';
import { Button, Form, Input, message, Modal, Popconfirm, Tree } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import { useState } from 'react';
import { v1 as uuidv4 } from 'uuid';

interface CustomTreeProps {
  dataSource: TreeDataNode[];
}

interface Values {
  title?: string;
}

function CustomTree(props: CustomTreeProps) {
  const { dataSource } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState(dataSource);
  const [open, setOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onCreate = (values: Values) => {
    const node = {
      // 生成 uuid 作为 key
      key: uuidv4(),
      title: values.title,
    };
    if (treeData.length === 0) {
      setTreeData([node]);
      setSelectedKeys([node.key]);
      return;
    }
    // 递归遍历树节点，找到指定节点并添加子节点
    const addNode = (
      treeData: TreeDataNode[],
      key: string,
      node: TreeDataNode
    ) => {
      return treeData.map(item => {
        if (item.key === key) {
          if (item.children) {
            item.children.push(node);
          } else {
            item.children = [node];
          }
        } else if (item.children) {
          addNode(item.children, key, node);
        }
        return item;
      });
    };
    // 如果expandedKeys中没有当前节点的key，则添加当前节点的key
    if (!expandedKeys.includes(String(selectedKeys[0]))) {
      setExpandedKeys([...expandedKeys, selectedKeys[0]]);
    }
    setTreeData(addNode(treeData, String(selectedKeys[0]), node));
    setOpen(false);
  };

  const onExpand: TreeProps['onExpand'] = expandedKeysValue => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect: TreeProps['onSelect'] = selectedKeysValue => {
    setSelectedKeys(selectedKeysValue);
  };

  const confirm: PopconfirmProps['onConfirm'] = () => {
    // 递归遍历树节点，删除指定节点
    const deleteNode = (treeData: TreeDataNode[], key: string) => {
      return treeData.filter(node => {
        if (node.key === key) {
          return false;
        }
        if (node.children) {
          node.children = deleteNode(node.children, key);
        }
        return true;
      });
    };
    setTreeData(deleteNode(treeData, String(selectedKeys[0])));
    messageApi.open({
      type: 'success',
      content: '节点删除成功',
    });
  };

  return (
    <>
      {contextHolder}
      {/* ------- 根节点不存在时显示表单 ------- */}
      {treeData.length === 0 && (
        <Form
          name="form-node"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onCreate}
          autoComplete="on"
        >
          <Form.Item<Values>
            label="根节点名称"
            name="title"
            rules={[{ required: true, message: '请输入根节点名称!' }]}
          >
            <Input type="textarea" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      )}
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        titleRender={nodeData => (
          <div className="group flex gap-1">
            {`${nodeData.title}`}
            {nodeData.key === selectedKeys[0] && (
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <Tooltip title="新增下级节点">
                  <PlusCircleOutlined
                    className="hover:text-blue-400"
                    onClick={() => setOpen(true)}
                  />
                </Tooltip>
                <Tooltip title="删除该节点">
                  <Popconfirm
                    title="删除节点"
                    description="该节点及子级节点将被删除且不可恢复，确认删除？"
                    onConfirm={confirm}
                    okText="确定"
                    cancelText="取消"
                  >
                    <div onClick={e => e.stopPropagation()}>
                      <DeleteOutlined className="hover:text-blue-400" />
                    </div>
                  </Popconfirm>
                </Tooltip>
              </div>
            )}
          </div>
        )}
      />
      <Modal
        open={open}
        title="新增节点"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={dom => (
          <Form
            layout="horizontal"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
            clearOnDestroy
            onFinish={values => onCreate(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="title"
          label="节点名称"
          rules={[
            {
              required: true,
              message: '请输入节点名称!',
            },
          ]}
        >
          <Input type="textarea" />
        </Form.Item>
      </Modal>
    </>
  );
}

export default CustomTree;
