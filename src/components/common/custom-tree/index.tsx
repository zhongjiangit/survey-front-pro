'use client';

import {
  DeleteOutlined,
  DownOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { PopconfirmProps, TreeDataNode, TreeProps } from 'antd';
import { Input, message, Popconfirm, Tree } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { v1 as uuidv4 } from 'uuid';

export interface CustomTreeDataNode extends TreeDataNode {
  type?: string;
}

interface CustomTreeProps {
  setParam?: boolean;
  dataSource: CustomTreeDataNode[];
  setDataSource?: (data: CustomTreeDataNode[]) => void;
  setDataSelected?: (data: React.Key[]) => void;
  onHandleCreate?: (tags: CustomTreeDataNode[]) => void;
}

function CustomTree(props: CustomTreeProps) {
  const {
    dataSource,
    setParam = false,
    setDataSource,
    setDataSelected,
    onHandleCreate,
  } = props;

  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [treeData, setTreeData] = useState(dataSource);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [nodeTitle, setNodeTitle] = useState('');

  /**
   * 初始化数据
   */
  useEffect(() => {
    if (dataSource) {
      setTreeData(dataSource);
    }
  }, [dataSource]);

  /**
   * 设置dataSource, 用于外部控制
   */
  const setTreeSourceData = useCallback(
    (data: CustomTreeDataNode[]) => {
      setTreeData(data);
      if (setDataSource) {
        setDataSource(data);
      }
      if (onHandleCreate) {
        onHandleCreate(data);
      }
    },
    [setDataSource, onHandleCreate]
  );

  /**
   * 设置selectedKeys, 用于外部控制
   */

  const setSelectedKeysData = useCallback(
    (data: React.Key[]) => {
      setSelectedKeys(data);
      if (setDataSelected) {
        setDataSelected(data);
      }
    },
    [setDataSelected]
  );

  /**
   * 监听是否需要设置url参数
   */
  useEffect(() => {
    if (!setParam || treeData.length === 0 || selectedKeys.length === 0) {
      setUrlParams();
      return;
    }
    if (selectedKeys.length === 0) {
      setUrlParams();
    } else {
      setUrlParams(selectedKeys[0] as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, setParam]);

  /**
   * 设置url参数
   */
  const setUrlParams = useCallback(
    (key?: string) => {
      const params = new URLSearchParams(searchParams);
      if (key) {
        params.set('node', key);
      } else {
        params.delete('node');
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, replace, pathname]
  );

  /**
   * 检查是否存在input类型节点  存在则不允许新增
   * @param treeData
   * @returns
   */
  const checkNode = (treeData: CustomTreeDataNode[]): boolean => {
    return treeData.some(node => {
      if (node.type === 'input') {
        messageApi.open({
          type: 'error',
          content: '请先保存编辑中节点',
        });
        return true;
      }
      if (node.children) {
        return checkNode(node.children);
      }
      return false;
    });
  };

  /**
   * 创建节点
   * @returns
   */
  const onCreate = () => {
    // 递归遍历树节点，如果树节点中已经有input类型节点，则不允许新增
    if (checkNode(treeData)) {
      return;
    }
    const node = {
      // 生成 uuid 作为 key
      key: uuidv4(),
      type: 'input',
      isLeaf: false,
      title: (
        <Input
          type="input"
          size="small"
          placeholder="请输入节点名称"
          onChange={e => {
            setNodeTitle(e.target.value);
          }}
        />
      ),
    };
    // 递归遍历树节点，找到指定节点并添加子节点
    const addNode = (
      treeData: CustomTreeDataNode[],
      key: string,
      node: CustomTreeDataNode
    ) => {
      return treeData.map(item => {
        if (item.key == key) {
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
    const newTreeData = addNode(treeData, String(selectedKeys[0]), node);
    setTreeData(newTreeData);
  };

  /**
   * 保存节点
   * @param key
   * @param title
   * @returns
   */
  const saveNode = (key: string, title: string) => {
    if (!title) {
      messageApi.open({
        type: 'error',
        content: '请输入节点名称',
      });
      return;
    }
    if (treeData.length === 0) {
      setTreeSourceData([{ key, title }]);
      setSelectedKeysData([key]);
      // messageApi.open({
      //   type: 'success',
      //   content: '节点保存成功',
      // });
      return;
    }
    // 递归遍历树节点，找到指定节点并更新节点名称
    const saveNode = (
      treeData: CustomTreeDataNode[],
      key: string,
      title: string
    ) => {
      return treeData.map(node => {
        if (node.key == key) {
          node.title = nodeTitle;
          node.type = 'text';
        } else if (node.children) {
          saveNode(node.children, key, title);
        }
        return node;
      });
    };
    setTreeSourceData(saveNode(treeData, key, title));
    setNodeTitle('');
    // messageApi.open({
    //   type: 'success',
    //   content: '节点保存成功',
    // });
  };

  /**
   * 打开/关闭节点
   * @param expandedKeysValue
   */
  const onExpand: TreeProps['onExpand'] = expandedKeysValue => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  /**
   * 选择节点
   * @param selectedKeysValue
   */
  const onSelect: TreeProps['onSelect'] = selectedKeysValue => {
    setSelectedKeysData(selectedKeysValue);
  };

  /**
   * 删除节点
   */
  const confirm: PopconfirmProps['onConfirm'] = () => {
    // 递归遍历树节点，删除指定节点
    const deleteNode = (treeData: CustomTreeDataNode[], key: string) => {
      return treeData.filter(node => {
        if (node.key == key) {
          if (selectedKeys.length > 0 && key === selectedKeys[0]) {
            setSelectedKeysData([]);
          }
          return false;
        }
        if (node.children) {
          node.children = deleteNode(node.children, key);
        }
        return true;
      });
    };
    setTreeSourceData(deleteNode(treeData, String(selectedKeys[0])));
    // messageApi.open({
    //   type: 'success',
    //   content: '节点删除成功',
    // });
  };

  /**
   * 进入拖动节点
   * @param info
   */
  const onDragEnter: TreeProps['onDragEnter'] = info => {
    console.log(info);
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  /**
   * 拖动节点
   * @param info
   */
  const onDrop: TreeProps['onDrop'] = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

    const loop = (
      data: CustomTreeDataNode[],
      key: React.Key,
      callback: (
        node: CustomTreeDataNode,
        i: number,
        data: CustomTreeDataNode[]
      ) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key == key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: CustomTreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj);
      });
    } else {
      let ar: CustomTreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        // Drop on the top of the drop node
        ar.splice(i!, 0, dragObj!);
      } else {
        // Drop on the bottom of the drop node
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeSourceData(data);
  };

  return (
    <>
      {contextHolder}
      {/* ------- 根节点不存在时显示表单 ------- */}
      <div className="flex justify-start items-start">
        {treeData.length === 0 && (
          <div className="flex gap-3 items-center">
            <Input
              type="input"
              size="small"
              placeholder="请输入根节点名称"
              onChange={e => {
                setNodeTitle(e.target.value);
              }}
            />
            <Tooltip title="保存节点">
              <SaveOutlined
                className="hover:text-blue-400"
                onClick={() => saveNode(uuidv4(), nodeTitle)}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {/* ----------- 树展示 ---------------- */}
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        switcherIcon={
          <DownOutlined className="absolute top-[7px] right-[7px]" />
        }
        showLine
        draggable
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        titleRender={nodeData => (
          <div className="group flex items-center justify-center gap-1">
            {typeof nodeData.title === 'function'
              ? nodeData.title(nodeData)
              : nodeData.title}
            {nodeData.key == selectedKeys[0] && (
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                {nodeData.type === 'input' ? (
                  <Tooltip title="保存节点">
                    <SaveOutlined
                      className="hover:text-blue-400"
                      onClick={() =>
                        saveNode(nodeData.key as string, nodeTitle)
                      }
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="新增下级节点">
                    <PlusCircleOutlined
                      className="hover:text-blue-400"
                      onClick={() => onCreate()}
                    />
                  </Tooltip>
                )}
                <Popconfirm
                  title="删除节点"
                  description="该节点及子级节点将被删除且不可恢复，确认删除？"
                  onConfirm={confirm}
                  okText="确定"
                  cancelText="取消"
                >
                  <div onClick={e => e.stopPropagation()}>
                    <DeleteOutlined className="hover:text-red-500" />
                  </div>
                </Popconfirm>
              </div>
            )}
          </div>
        )}
      />
    </>
  );
}

export default CustomTree;
