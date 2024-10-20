'use client';

import { SystemListType } from '@/data/system/useSystemListAllSWR';
import { TemplateTypeEnum, ZeroOrOneType } from '@/interfaces/CommonType';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Api from '@/api';
import { TemplateItemType } from '@/api/template/list-outline';

interface CollectProps {
  system: SystemListType;
}

const Check = ({ system }: CollectProps) => {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedTab = searchParams.get('tab');
  const [currentTemplate, setCurrentTemplate] = useState<TemplateItemType>();
  const [open, setOpen] = useState(false);

  const {
    run: getCollectList,
    data: collectList,
    loading,
  } = useRequest(
    () => {
      return Api.getTemplateOutlineList({
        currentSystemId: system.id,
        templateType: TemplateTypeEnum.Check,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        setOpen(false);
      },
    }
  );

  const columns = useMemo(
    () => [
      {
        title: '收集模板',
        dataIndex: 'templateTitle',
        key: 'collectList',
      },

      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '启用状态',
        key: 'isValid',
        dataIndex: 'isValid',
        render: (value: ZeroOrOneType) => (
          <Tag color={value === 1 ? 'green' : 'geekblue'}>
            {value === 1 ? '启用' : '停用'}
          </Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: TemplateItemType) => (
          <Space size="middle">
            <Link
              href={`/survey/system/config/check?id=${selectedId}&tab=${selectedTab}&check=${record.templateId}`}
            >
              详情
            </Link>
            <a>复制</a>
            <a
              onClick={() => {
                setCurrentTemplate(record);
                setOpen(true);
              }}
            >
              编辑
            </a>
            <Popconfirm
              title="删除模版"
              description="删除后将不可恢复，您确定要删除此模版吗？"
              // onConfirm={confirm}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <main className="relative">
      <Button
        type="primary"
        className="absolute -top-14 right-0"
        onClick={() => {
          setOpen(true);
        }}
      >
        新增试题抽检问卷
      </Button>
      <Table
        columns={columns}
        dataSource={collectList?.data || []}
        loading={loading}
      />
      {/* <CreateModal
        open={open}
        setOpen={setOpen}
        type={'collect'}
        initValues={{
          ...currentTemplate,
          currentSystemId: system.id,
          templateType: TemplateTypeEnum.Check,
        }}
      /> */}
    </main>
  );
};
export default Check;
