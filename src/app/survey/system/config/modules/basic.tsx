'use client';

import CustomTree from '@/components/common/custom-tree';
import { SystemListType } from '@/data/system/useSystemListAllSWR';
import useTagCreateMutation from '@/data/tag/useTagCreateMutation';
import useTagListSWR, { TagType } from '@/data/tag/useTagListSWR';
import { SystemType } from '@/interfaces/SystemType';
import { Button, Col, Divider, Drawer, Row, Space, Tag } from 'antd';
import { TagIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface BasicProps {
  system: SystemListType;
}

const Basic = (props: BasicProps) => {
  const { system } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orgTags, setOrgTags] = useState<TagType[]>([]);
  const [memberTags, setMemberTags] = useState<TagType[]>([]);
  const [expertTags, setExpertTags] = useState<TagType[]>([]);
  const [drawerData, setDrawerData] = useState<{
    type: 1 | 2 | 3;
    title: string;
  }>({ type: 1, title: '单位标签管理' });

  const { data: tagsData } = useTagListSWR({
    currentSystemId: system.id,
    tagType: drawerData?.type,
  });

  const {
    trigger: createTrigger,
    isMutating: createMutating,
    data: createCallbackData,
  } = useTagCreateMutation();

  useEffect(() => {
    // 如果tagsData.data.data存在，存放到相应的标签中
    if (tagsData?.data.data?.tags) {
      switch (drawerData?.type) {
        case 1:
          setOrgTags(tagsData.data.data?.tags);
          break;
        case 2:
          setMemberTags(tagsData.data.data?.tags);
          break;
        case 3:
          setExpertTags(tagsData.data.data?.tags);
          break;
        default:
          break;
      }
    }
  }, [tagsData]);

  const showDrawer = ({ type, title }: { type: 1 | 2 | 3; title: string }) => {
    setDrawerData({
      type,
      title,
    });
    setDrawerOpen(true);
  };

  console.log('tagsData', tagsData);

  const onCreate = () => {
    console.log(
      'create',
      drawerData.type === 1
        ? orgTags
        : drawerData.type === 2
        ? memberTags
        : expertTags
    );
    // 保存到相应的标签中
    createTrigger({
      currentSystemId: system.id,
      tagType: drawerData.type,
      tags:
        drawerData.type === 1
          ? orgTags
          : drawerData.type === 2
          ? memberTags
          : expertTags,
    });

    setDrawerOpen(false);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const tags = useMemo(() => {
    switch (drawerData?.type) {
      case 1:
        return orgTags;
      case 2:
        return memberTags;
      case 3:
        return expertTags;
      default:
        return [];
    }
  }, [drawerData?.type]);

  const setTags = useCallback(() => {
    (tags: any) => {
      switch (drawerData?.type) {
        case 1:
          setOrgTags(tags);
          break;
        case 2:
          setMemberTags(tags);
          break;
        case 3:
          setExpertTags(tags);
          break;
        default:
          break;
      }
    };
  }, [drawerData?.type]);

  return (
    <div className="flex h-auto gap-3 min-h-[78vh]">
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
                    className="flex items-center gap-1 cursor-pointer hover:scale-105"
                    icon={<TagIcon className="h-3 w-3" />}
                    color="#2db7f5"
                    onClick={() => {
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
                    icon={<TagIcon className="h-3 w-3" />}
                    color="#87d068"
                    onClick={() => {
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
                  icon={<TagIcon className="h-3 w-3" />}
                  color="#3b5999"
                  onClick={() => {
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
            <Button onClick={onCreate} loading={createMutating} type="primary">
              保存
            </Button>
          </Space>
        }
      >
        <CustomTree dataSource={tags} setDataSource={setTags} />
      </Drawer>
    </div>
  );
};

export default Basic;
