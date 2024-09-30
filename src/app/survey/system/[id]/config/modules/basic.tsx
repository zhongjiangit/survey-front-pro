'use client';

import CustomTree from '@/components/common/custom-tree';
import { Button } from '@/components/ui/button';
import { Col, Divider, Drawer, Row, Space, Tag } from 'antd';
import { TagIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface BasicProps {}

const Basic = (props: BasicProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [drawerName, setDrawerName] = useState('');
  const searchParams = useSearchParams();
  const nodeSelected = searchParams.get('node');
  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  };

  const showDrawer = (type: string) => {
    setDrawerName(type);
    setTags([]);
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="flex h-auto gap-3 min-h-[78vh]">
      <div className="flex-1 shadow-md h-[78vh] p-2 overflow-auto">
        <div>
          <Divider orientation="left">系统基本信息</Divider>
          <div className="flex flex-col gap-3">
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">
                    系统名称：
                  </span>
                  <span>系统1</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">层级：</span>
                  <span>3 层</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">
                    人员标签：
                  </span>
                  <Tag
                    className="flex items-center gap-1 cursor-pointer hover:scale-105"
                    icon={<TagIcon className="h-3 w-3" />}
                    color="#2db7f5"
                    onClick={() => {
                      showDrawer('人员标签管理');
                    }}
                  >
                    管理系统人员标签
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">
                    专家标签：
                  </span>
                  <Tag
                    className="flex items-center gap-1 cursor-pointer hover:scale-105"
                    icon={<TagIcon className="h-3 w-3" />}
                    color="#87d068"
                    onClick={() => {
                      showDrawer('专家标签管理');
                    }}
                  >
                    管理系统专家标签
                  </Tag>
                </div>
              </Col>
            </Row>

            <div className="h-8 flex gap-2 items-center">
              <span className="w-24 text-right font-medium">各层级名称：</span>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{`层级${index + 1}名称`}</span>
                    {index < 3 - 1 ? <span>-</span> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="h-8 flex gap-2 items-center">
              <span className="w-24 text-right font-medium">各层级标签：</span>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Tag
                      className="flex items-center gap-1 cursor-pointer hover:scale-105"
                      icon={<TagIcon className="h-3 w-3" />}
                      color="#3b5999"
                      onClick={() => {
                        showDrawer(`第${index + 1}级标签管理`);
                      }}
                    >
                      {`管理第${index + 1}级标签`}{' '}
                    </Tag>
                    {index < 3 - 1 ? <span>-</span> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end px-5">
              <Button size="sm">保存基本信息</Button>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        maskClosable={false}
        title={drawerName}
        onClose={onClose}
        open={drawerOpen}
        extra={
          <Space>
            <Button onClick={onClose} size="sm" variant="outline">
              取消
            </Button>
            <Button onClick={onClose} size="sm">
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

export default Basic;
