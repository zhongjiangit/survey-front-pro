'use client';

import { OperationType, OperationTypeEnum } from '@/types/CommonType';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { PopconfirmProps, TreeDataNode, TreeProps } from 'antd';
import { message, Popconfirm, Tree } from 'antd';
import Tooltip from 'antd/lib/tooltip';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { v1 as uuidv4 } from 'uuid';
import RenderInput from './render-input';

export interface CustomTreeDataNode extends TreeDataNode {
  children?: CustomTreeDataNode[];
  type?: string;
  key: string | number;
  orgName?: string;
  staffCount?: number;
  isLeaf?: boolean;
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
      setTreeData(data);
      if (setDataSource) {
        setDataSource(data);
      }
      if (onHandleCreate) {
        onHandleCreate(data, type, key);
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
  const checkNode = useCallback(
    (
      treeData: CustomTreeDataNode[],
      nodeData?: CustomTreeDataNode
    ): boolean => {
      return treeData.some(node => {
        if (node.type === 'input') {
          if (nodeData && nodeData?.type !== 'input') {
            messageApi.open({
              type: 'error',
              content: '请先保存编辑中节点',
            });
          }
          return true;
        }
        if (node.children) {
          return checkNode(node.children);
        }
        return false;
      });
    },
    [messageApi]
  );

  /**
   * 保存节点
   * @param key
   * @param title
   * @returns
   */
  const saveNode = useCallback(
    (key: string, title: string) => {
      if (!title) {
        messageApi.open({
          type: 'error',
          content: '请输入节点名称',
        });
        return;
      }
      if (treeData.length === 0) {
        setTreeSourceData([{ key, title }], OperationTypeEnum.Add, key);
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
            node.title = currentNode?.title;
            node.type = 'text';
          } else if (node.children) {
            saveNode(node.children, key, title);
          }
          return node;
        });
      };
      console.log('currentNode', currentNode);

      const type = isNaN(Number(currentNode?.key))
        ? OperationTypeEnum.Add
        : OperationTypeEnum.Update;
      setTreeSourceData(saveNode(treeData, key, title), type, currentNode?.key);
      setCurrentNode(undefined);
      // messageApi.open({
      //   type: 'success',
      //   content: '节点保存成功',
      // });
    },
    [treeData, currentNode, setTreeSourceData, messageApi, setSelectedKeysData]
  );
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
      title: '',
    };
    setCurrentNode({ key: node.key, title: '' });
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
   * 编辑节点
   */
  const onEdit = useCallback(() => {
    // 递归遍历树节点，如果树节点中已经有input类型节点，则不允许编辑
    if (checkNode(treeData)) {
      return;
    }
    // 递归遍历树节点，找到指定节点并更新节点名称
    const editNode = (treeData: CustomTreeDataNode[], key: string) => {
      return treeData.map(node => {
        if (node.key == key) {
          node.type = 'input';
        } else if (node.children) {
          editNode(node.children, key);
        }
        return node;
      });
    };
    setTreeData(editNode(treeData, String(selectedKeys[0])));
  }, [checkNode, selectedKeys, treeData]);

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
      setSelectedKeysData(selectedKeysValue);
    }
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
    setTreeSourceData(
      deleteNode(treeData, String(currentNode?.key)),
      OperationTypeEnum.Delete,
      currentNode?.key
    );
    setCurrentNode(undefined);
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

  // 找到当前nodeData是treeData下第几层级的数据,同级节点的深度是一样的
  const findDepth = (
    treeData: CustomTreeDataNode[],
    key: React.Key,
    currentDepth: number = 1
  ): number => {
    for (const node of treeData) {
      if (node.key === key) {
        return currentDepth;
      }
      if (node.children) {
        const depth = findDepth(node.children, key, currentDepth + 1);
        if (depth !== -1) {
          return depth;
        }
      }
    }
    return -1; // 如果未找到节点，返回 -1
  };

  useEffect(() => {
    setSelectedKeys([]);
  }, []);

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
              onSave={() => {
                saveNode(uuidv4(), currentNode?.title as string);
              }}
            ></RenderInput>
            <Tooltip title="保存节点">
              <SaveOutlined
                className="hover:text-blue-400"
                onClick={() => saveNode(uuidv4(), currentNode?.title as string)}
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
          const depth = findDepth(treeData, nodeData.key as string);
          return (
            <div
              className="group flex items-center justify-center gap-1"
              onClick={() => {
                if (!checkNode(treeData, nodeData)) {
                  setCurrentNode({
                    key: nodeData.key as string,
                    title: nodeData.title as string,
                  });
                }
              }}
            >
              {nodeData.type === 'input' && (
                <RenderInput
                  currentNode={currentNode}
                  setCurrentNode={setCurrentNode}
                  onSave={() => {
                    saveNode(
                      currentNode?.key as string,
                      currentNode?.title as string
                    );
                  }}
                ></RenderInput>
              )}
              {nodeData.type !== 'input' && (nodeData.title as string)}
              {nodeData.key == currentNode?.key && (
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  {nodeData.type === 'input' ? (
                    <Tooltip title="保存节点">
                      <SaveOutlined
                        className="hover:text-blue-400"
                        onClick={() =>
                          saveNode(
                            nodeData.key as string,
                            currentNode?.title as string
                          )
                        }
                      />
                    </Tooltip>
                  ) : (
                    <>
                      {maxDepth > depth && (
                        <Tooltip title="新增下级节点">
                          <PlusCircleOutlined
                            className="hover:text-blue-400"
                            onClick={() => onCreate()}
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
                            onEdit();
                          }}
                        />
                      </Tooltip>
                    </>
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
          );
        }}
      />
    </>
  );
}

export default CustomTree;
