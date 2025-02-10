'use client';

import { OperationType, OperationTypeEnum } from '@/types/CommonType';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import { message, Popconfirm, Tree } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import _ from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v1 as uuidv4 } from 'uuid';
import RenderInput from './render-input';

export interface CustomTreeDataNode extends TreeDataNode {
  children?: CustomTreeDataNode[];
  type?: string;
  key: string | number;
  orgName?: string;
  staffCount?: number;
  isLeaf?: boolean;
  root?: boolean;
}

interface CustomTreeProps {
  draggable?: boolean;
  maxDepth?: number;
  setParam?: boolean;
  dataSource: CustomTreeDataNode[];
  setDataSource?: (data: CustomTreeDataNode[]) => void;
  setDataSelected?: (data: React.Key[]) => void;
  onHandleCreate?: (
    tags: CustomTreeDataNode[],
    type: OperationType | undefined,
    key: number | string | undefined
  ) => void;
}

function CustomTree(props: CustomTreeProps) {
  const {
    draggable = false,
    maxDepth = 100,
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
  const [currentNode, setCurrentNode] = useState<{
    key: number | string;
    title: string;
  }>();
  const [editKey, setEditKey] = useState<string | number | null>(null);
  const isNew = useMemo(() => {
    return isNaN(Number(currentNode?.key));
  }, [currentNode]);

  const nodeMap = useMemo(() => {
    const genItem = (
      node: CustomTreeDataNode,
      parent?: CustomTreeDataNode
    ) => ({
      node,
      parent,
    });
    const list = treeData.map(t => genItem(t));
    const map: {
      [key: string]: {
        depth: number;
        node: CustomTreeDataNode;
        parent?: CustomTreeDataNode;
      };
    } = {};
    let depth = 1;
    while (list.length) {
      list.forEach(({ node, parent }) => {
        map[node.key] = { depth, node, parent };
      });
      depth++;
      const length = list.length;
      list.push(
        ...list
          .map(t => (t.node.children || []).map(f => genItem(f, t.node)))
          .flat()
      );
      list.splice(0, length);
    }
    return map;
  }, [treeData]);

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
    (
      data: CustomTreeDataNode[],
      type?: OperationType,
      key?: number | string
    ) => {
      // if (setDataSource) {
      //   setDataSource(data);
      // } else {
      //   setTreeData(data);
      // }

      if (onHandleCreate) {
        onHandleCreate(data, type, key);
      } else {
        setTreeData(data);
      }
    },
    [onHandleCreate]
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

  const selectNode = useCallback(
    (key: string | number) => {
      const node = nodeMap[key]?.node;
      if (node) {
        setSelectedKeys([node.key]);
        setCurrentNode({ key: node.key, title: String(node.title) });
      }
    },
    [nodeMap]
  );

  const delNode = (key: string | number) => {
    const parent = nodeMap[key]?.parent;
    if (parent?.children) {
      // setTreeData(data);
      selectNode(parent.key);
    }

    // 根据key删除节点及子节点
    const del = (data: CustomTreeDataNode[], key: string | number) => {
      return data.filter(item => {
        if (item.key === key) {
          return false;
        }
        if (item.children) {
          item.children = del(item.children, key);
          return true;
        }
        return true;
      });
    };
    const treeDataClone = _.cloneDeep(treeData);
    return del(treeDataClone, key);
  };

  /**
   * 保存节点
   * @param key
   * @param title
   * @returns
   */
  const saveNode = useCallback(
    (key: string, title: string) => {
      setEditKey(null);
      if (!title) {
        if (isNew) {
          const parent = nodeMap[key]?.parent;
          if (parent?.children) {
            parent.children = parent.children?.filter(t => t.key !== key);
            setTreeData([...treeData]);
            selectNode(parent.key);
          }
        }
        return;
      }

      const { node, parent } = nodeMap[key] || {};
      if (node && node.title === title) {
        return;
      }
      if (node) {
        node.title = title;
      }
      let data = [...treeData];
      const type = isNew ? OperationTypeEnum.Add : OperationTypeEnum.Update;
      if (treeData.length === 0) {
        data = [{ key, title }];
      }
      if (isNew && parent) {
        selectNode(parent.key);
      }
      setTreeSourceData(data, type, key);
    },
    [nodeMap, treeData, isNew, setTreeSourceData, selectNode]
  );
  /**
   * 创建节点
   * @returns
   */
  const onCreate = (parentNode: CustomTreeDataNode) => {
    const node = {
      // 生成 uuid 作为 key
      key: uuidv4(),
      type: 'input',
      title: '',
    };

    parentNode.children = (parentNode.children || []).concat([node]);
    // 如果expandedKeys中没有当前节点的key，则添加当前节点的key
    if (!expandedKeys.includes(String(selectedKeys[0]))) {
      setExpandedKeys([...expandedKeys, selectedKeys[0]]);
    }

    setCurrentNode({ key: node.key, title: '' });
    setEditKey(node.key);
    setSelectedKeys([node.key]);
    setTreeData([...treeData]);
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
    if (selectedKeysValue.length > 0) {
      selectNode(selectedKeysValue[0] as string);
    }
  };

  /**
   * 删除节点
   */
  const confirm = (node: CustomTreeDataNode) => {
    setTreeSourceData(
      delNode(node.key),
      OperationTypeEnum.Delete,
      currentNode?.key
    );
    return true;
  };

  /**
   * 进入拖动节点
   * @param info
   */
  const onDragEnter: TreeProps['onDragEnter'] = info => {
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  };

  /**
   * 拖动节点
   * @param info
   */
  const onDrop: TreeProps['onDrop'] = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]); // the drop position relative to the drop node, inside 0, top -1, bottom 1

    const loop = (
      data: CustomTreeDataNode[],
      key: React.Key,
      callback: (
        item: CustomTreeDataNode,
        index: number,
        arr: CustomTreeDataNode[]
      ) => void
    ): void => {
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        if (item.key === key) {
          return callback(item, index, data);
        }
        if (item.children) {
          const result = loop(item.children, key, callback);
          if (result !== undefined) {
            return result;
          }
        }
      }
      return;
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
    // 判断data顶级节点是否只有一个，如果只有一个则不允许拖动
    if (data.length !== 1) {
      messageApi.open({
        type: 'error',
        content: '不允许拖动到根节点',
      });
      return;
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
            <RenderInput
              currentNode={currentNode}
              setCurrentNode={setCurrentNode}
              onSave={(data: any) => {
                saveNode(uuidv4(), data?.title);
              }}
            />
            <Tooltip title="保存节点">
              <SaveOutlined
                className="hover:text-blue-400"
                onClick={() => {
                  // 失去焦点自动保存
                  // saveNode(uuidv4(), currentNode?.title as string);
                }}
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
        draggable={draggable}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        titleRender={nodeData => {
          const { depth } = nodeMap[nodeData.key] || { depth: -1 };
          return (
            <div className="group flex items-center justify-center gap-1">
              {currentNode?.key == nodeData.key && editKey === nodeData.key ? (
                <RenderInput
                  currentNode={currentNode}
                  setCurrentNode={setCurrentNode}
                  onSave={(data: any) => {
                    saveNode(data.key, data.title);
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setEditKey(nodeData.key);
                  }}
                >
                  {nodeData.title as string}
                </span>
              )}
              {nodeData.key == currentNode?.key && (
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  {editKey === nodeData.key ? (
                    <Tooltip title="保存节点">
                      <SaveOutlined
                        className="hover:text-blue-400"
                        onClick={() => {
                          // 失去焦点自动保存
                          // saveNode(
                          //   nodeData.key as string,
                          //   currentNode?.title as string,
                          // );
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <>
                      {maxDepth > depth && (
                        <Tooltip title="新增下级节点">
                          <PlusCircleOutlined
                            className="hover:text-blue-400"
                            onClick={() => onCreate(nodeData)}
                          />
                        </Tooltip>
                      )}
                      <Tooltip title="编辑节点">
                        <EditOutlined
                          className="hover:text-blue-400"
                          onClick={() => {
                            setCurrentNode({
                              key: nodeData.key?.toString() as string | number,
                              title: nodeData.title?.toString() as string,
                            });
                            setEditKey(nodeData.key);
                            // onEdit();
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                  {!nodeData?.root && editKey !== nodeData.key && (
                    <Popconfirm
                      title="删除节点"
                      description="该节点及子级节点将被删除且不可恢复，确认删除？"
                      onConfirm={() => confirm(nodeData)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <div onClick={e => e.stopPropagation()}>
                        <DeleteOutlined className="hover:text-red-500" />
                      </div>
                    </Popconfirm>
                  )}
                </div>
              )}
            </div>
          );
        }}
      />
    </>
  );
}

export default CustomTree;
