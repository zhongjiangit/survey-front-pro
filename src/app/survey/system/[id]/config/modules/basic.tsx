'use client';

import CustomTree from '@/components/common/custom-tree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Col,
  Divider,
  Drawer,
  Empty,
  Row,
  Space,
  Switch,
  Tag,
  TreeSelect,
} from 'antd';
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
      <div className="shadow-md h-[78vh] p-2 w-auto min-w-48 max-w-72 overflow-auto">
        <CustomTree dataSource={[]} setParam />
      </div>
      <div className="flex-1 shadow-md h-[78vh] p-2 overflow-auto">
        <div>
          <Divider orientation="left">系统基本信息</Divider>
          <div className="flex flex-col gap-3">
            <Row>
              <Col span={8}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">
                    系统名称：
                  </span>
                  <span>系统1</span>
                </div>
              </Col>
              <Col span={16}>
                <div className="h-8 flex gap-2 items-center">
                  <span className="w-24 text-right font-medium">层级：</span>
                  <span>3 层</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
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
              <Col span={16}>
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
                    <Input
                      type="text"
                      className="h-8 w-32"
                      placeholder={`第${index + 1}层级名称`}
                    />
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
          <Divider orientation="left">节点基本信息</Divider>
          {nodeSelected ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center">
                <span className="w-24 text-right font-medium">节点启用：</span>
                <Switch />
              </div>
              <div className="flex items-center">
                <span className="w-24 text-right font-medium">节点标签：</span>
                <TreeSelect
                  showSearch
                  style={{ width: '320px' }}
                  value={value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择节点标签"
                  allowClear
                  multiple
                  treeDefaultExpandAll
                  onChange={onChange}
                  treeData={[]}
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="w-24 text-right font-medium">成员管理：</span>
                {/* <Tag
                  className="flex items-center gap-1 cursor-pointer hover:scale-105"
                  icon={<TeamOutlined className="h-3 w-3" />}
                  color="#f50"
                >
                  管理节点所属成员
                </Tag> */}
                <div className="flex flex-col gap-2 py-3 px-10">
                  <span className="font-medium">单位管理员</span>
                  <div className="flex gap-5">
                    <div>
                      姓名：<span>张三</span>
                    </div>
                    <div>
                      电话：<span>1xxx</span>
                    </div>
                  </div>

                  <span className="font-medium">其他用户</span>
                </div>
              </div>
              <div className="flex justify-end px-5">
                <Button size="sm">保存节点配置</Button>
              </div>
            </div>
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
