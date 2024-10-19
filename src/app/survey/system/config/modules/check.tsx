'use client';

import { SystemListType } from '@/data/system/useSystemListAllSWR';
import useListOutlineSWR, {
  TemplateListResponse,
} from '@/data/temp/useListOutlineSWR';
import { TemplateTypeEnum, ZeroOrOne } from '@/interfaces/CommonType';
import { Popconfirm, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

interface CollectProps {
  system: SystemListType;
}

const Check = ({ system }: CollectProps) => {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedTab = searchParams.get('tab');
  const [currentTemplate, setCurrentTemplate] =
    useState<TemplateListResponse>();
  const [open, setOpen] = useState(false);
  const { data: collectList } = useListOutlineSWR({
    currentSystemId: system.id,
    templateType: TemplateTypeEnum.Check,
  });

  console.log('collectList', collectList);

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
        render: (value: ZeroOrOne) => (
          <Tag color={value === 1 ? 'green' : 'geekblue'}>
            {value === 1 ? '启用' : '停用'}
          </Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: TemplateListResponse) => (
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
    <main>
      <Table columns={columns} dataSource={collectList?.data.data || []} />
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
