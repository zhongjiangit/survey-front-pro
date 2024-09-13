'use client';

import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { PopconfirmProps, TreeDataNode, TreeProps } from 'antd';
import { Form, Input, message, Modal, Popconfirm, Tree } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import { useState } from 'react';
import { v1 as uuidv4 } from 'uuid';

const mockData: TreeDataNode[] = [
  {
    title: '四川省',
    key: '0-0',
    children: [
      {
        title: '绵阳市',
        key: '0-0-0',
        children: [
          {
            title: '涪城区',
            key: '0-0-0-0',
            children: [
              { title: '绵阳中学', key: '0-0-0-0-0' },
              { title: '南山中学', key: '0-0-0-1-1' },
            ],
          },
          { title: '游仙区', key: '0-0-0-1' },
          { title: '江油市', key: '0-0-0-2' },
        ],
      },
      {
        title: '自贡市',
        key: '0-0-1',
        children: [{ title: '二中', key: '0-0-1-0' }],
      },
      {
        title: '内江市',
        key: '0-0-2',
      },
    ],
  },
];

interface CustomTreeProps {}

interface Values {
  title?: string;
}

function CustomTree(props: CustomTreeProps) {
  const {} = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState(mockData);
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
