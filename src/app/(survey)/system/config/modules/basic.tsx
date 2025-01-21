'use client';

import Api from '@/api';
import { SystemListType } from '@/api/system/getSystemListAll';
import CustomTree, {
  CustomTreeDataNode,
} from '@/components/common/custom-tree';
import { useRequest } from 'ahooks';
import { Button, Col, Divider, Drawer, message, Row, Space, Tag } from 'antd';
import { useCallback, useState } from 'react';

interface BasicProps {
  system: SystemListType;
}

const Basic = (props: BasicProps) => {
  const { system } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orgTags, setOrgTags] = useState<CustomTreeDataNode>();
  const [memberTags, setMemberTags] = useState<CustomTreeDataNode>();
  const [expertTags, setExpertTags] = useState<CustomTreeDataNode>();
  const [drawerData, setDrawerData] = useState<{
    type: 1 | 2 | 3;
    title: string;
  }>({ type: 1, title: '单位标签管理' });

  const setTags = useCallback(
    (tags: any) => {
      switch (drawerData?.type) {
        case 1:
          setOrgTags(tags.length ? { ...tags[0], root: true } : tags[0]);
          break;
        case 2:
          setMemberTags(tags.length ? { ...tags[0], root: true } : tags[0]);
          break;
        case 3:
          setExpertTags(tags.length ? { ...tags[0], root: true } : tags[0]);
          break;
        default:
          break;
      }
    },
    [drawerData?.type]
  );

  const { run: getTagList, refresh: refreshTagList } = useRequest(
    type => {
      const tagType = type || 1;
      return Api.getTagList({
        currentSystemId: system.id,
        tagType: tagType,
      });
    },
    {
      onSuccess(response) {
        setTags(response?.data);
      },
    }
  );

  const { run: createTag, loading: createLoading } = useRequest(
    params => {
      return Api.createTag(params);
    },
    {
      manual: true,
      onSuccess(response) {
        setTags([response?.data?.tags]);
      },
      onError(error) {
        refreshTagList();
      },
    }
  );

  const showDrawer = ({ type, title }: { type: 1 | 2 | 3; title: string }) => {
    setDrawerData({
      type,
      title,
    });
    setDrawerOpen(true);
  };

  const onCreate = () => {
    const tags =
      drawerData.type === 1
        ? orgTags
        : drawerData.type === 2
          ? memberTags
          : expertTags;

    // 如果tags存在，递归遍历删除里面的key
    if (tags) {
      const removeKey = (node?: CustomTreeDataNode) => {
        if (node?.children) {
          node.children.forEach(child => {
            removeKey(child);
          });
        }
        // 如果node.key为string类型，删除
        if (typeof node?.key === 'string') {
          // @ts-expect-error: delete
          delete node?.key;
          delete node?.type;
          delete node?.isLeaf;
        } else if (node?.key) {
          delete node?.type;
          delete node?.isLeaf;
        }
      };
      removeKey(tags);
    }

    // 保存到相应的标签中

    if (tags) {
      createTag({
        currentSystemId: system.id,
        tagType: drawerData.type,
        tags: tags,
      });
      setDrawerOpen(false);
    } else {
      messageApi.open({
        type: 'info',
        content: '请先添加标签',
      });
    }
  };

  const onClose = () => {
    setDrawerOpen(false);
    setOrgTags(undefined);
    setMemberTags(undefined);
    setExpertTags(undefined);
  };

  const renderTree = useCallback(
    (type: number) => {
      switch (type) {
        case 1:
          return (
            <CustomTree
              dataSource={orgTags ? [orgTags] : []}
              setDataSource={setTags}
            />
          );
        case 2:
          return (
            <CustomTree
              dataSource={memberTags ? [memberTags] : []}
              setDataSource={setTags}
            />
          );
        case 3:
          return (
            <CustomTree
              dataSource={expertTags ? [expertTags] : []}
              setDataSource={setTags}
            />
          );

        default:
          break;
      }
    },
    [orgTags, setTags, memberTags, expertTags]
  );

  return (
    <div className="flex h-auto gap-3 min-h-[78vh]">
      {contextHolder}
      <div className="flex-1 shadow-md h-[78vh] p-2 overflow-auto">
        <div>
          <Divider orientation="left">系统基本信息</Divider>
          <div className="flex flex-col gap-3">
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    系统名称：
                  </span>
                  <span>{system.systemName}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    创建时间：
                  </span>
                  <span>{system.createDate}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    允许下层级使用：
                  </span>
                  <span>{system.allowSubInitiate ? '是' : '否'}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    有效期限：
                  </span>
                  <span>{system.validDate}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    允许上层查看：
                  </span>
                  <span>{system.allowSupCheck ? '是' : '否'}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">层级：</span>
                  <span>{system.levelCount} 层</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    人员标签：
                  </span>
                  <Tag
                    className="flex items-center gap-1 cursor-pointer hover:scale-105 flex-nowrap"
                    // icon={<TagIcon className="h-3 w-3" />}
                    color="#2db7f5"
                    onClick={() => {
                      getTagList(2);
                      showDrawer({
                        type: 2,
                        title: '人员标签管理',
                      });
                    }}
                  >
                    管理系统人员标签
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-40 text-right font-medium">
                    专家标签：
                  </span>
                  <Tag
                    className="flex items-center gap-1 cursor-pointer hover:scale-105"
                    // icon={<TagIcon className="h-3 w-3" />}
                    color="#87d068"
                    onClick={() => {
                      getTagList(3);
                      showDrawer({
                        type: 3,
                        title: '专家标签管理',
                      });
                    }}
                  >
                    管理系统专家标签
                  </Tag>
                </div>
              </Col>
            </Row>

            <div className="h-8 flex gap-2 items-center">
              <span className="w-40 text-right font-medium">各层级名称：</span>
              <div className="flex gap-2">
                {system.levels.map((level, index) => (
                  <div
                    key={level.levelIndex}
                    className="flex items-center gap-2"
                  >
                    <span>{level.levelName}</span>
                    {index < system.levels.length - 1 ? <span>-</span> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-8 flex gap-2 items-center">
              <span className="w-40 text-right font-medium">各层级标签：</span>
              <div className="flex gap-2">
                <Tag
                  className="flex items-center gap-1 cursor-pointer hover:scale-105"
                  // icon={<TagIcon className="h-3 w-3" />}
                  color="#3b5999"
                  onClick={() => {
                    getTagList(1);
                    showDrawer({
                      type: 1,
                      title: '单位标签管理',
                    });
                  }}
                >
                  {`单位标签`}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        maskClosable={false}
        title={drawerData?.title}
        onClose={onClose}
        open={drawerOpen}
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={onCreate} loading={createLoading} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        {renderTree(drawerData.type)}
        {/* <CustomTree dataSource={tags} setDataSource={setTags} /> */}
      </Drawer>
    </div>
  );
};

export default Basic;
