'use client';

import Api from '@/api';
import { SystemListType } from '@/api/system/getSystemListAll';
import { TemplateItemType } from '@/api/template/list-outline';
import {
  TemplateTypeEnum,
  ZeroOrOneType,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Button, Popconfirm, Space, Table, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import CreateModal from './create-modal';

interface CheckProps {
  system: SystemListType;
}

const Check = ({ system }: CheckProps) => {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedTab = searchParams.get('tab');
  const [currentTemplate, setCurrentTemplate] = useState<TemplateItemType>();
  const [open, setOpen] = useState(false);

  const [templateDetail, setTemplateDetail] = useLocalStorageState<any>(
    'copied-template-detail',
    {
      defaultValue: { items: [] },
    }
  );

  const { run: getTemplateDetails } = useRequest(
    (id, newTemplateId) => {
      return Api.getTemplateDetails({
        currentSystemId: system.id,
        templateType: TemplateTypeEnum.Check,
        templateId: id,
      });
    },
    {
      onSuccess: (response, params) => {
        if (response?.data.items?.length > 0) {
          const newTemplateId = params[1];
          setTemplateDetail({ ...response.data, newTemplateId: newTemplateId });
        }
      },
    }
  );

  const {
    run: getCheckList,
    data: checkList,
    loading,
  } = useRequest(() => {
    return Api.getTemplateOutlineList({
      currentSystemId: system.id,
      templateType: TemplateTypeEnum.Check,
    });
  });

  const { run: createOutline, loading: submitLoading } = useRequest(
    params => {
      return Api.createTemplateOutline({
        currentSystemId: params.currentSystemId,
        templateType: params.templateType,
        templateTitle: params.templateTitle,
        isValid: params.isValid, // or 0, depending on your logic
        memo: params.memo,
      });
    },
    {
      manual: true,
      onSuccess: (response, params) => {
        console.log('params', params);
        getTemplateDetails(params[0].templateId, response?.data.id);
        getCheckList();
      },
    }
  );

  const copyCheckTemplate = (record: TemplateItemType) => {
    createOutline({
      templateId: record.templateId,
      currentSystemId: record.currentSystemId,
      templateType: TemplateTypeEnum.Check,
      templateTitle: `${record.templateTitle}_复制`,
      isValid: record.isValid,
      memo: record.memo,
    });
  };

  const columns = useMemo(
    () => [
      {
        title: '收集模板',
        dataIndex: 'templateTitle',
        key: 'checkList',
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
          <Tag color={value === ZeroOrOneTypeEnum.One ? 'green' : 'geekblue'}>
            {value === ZeroOrOneTypeEnum.One ? '启用' : '停用'}
          </Tag>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: TemplateItemType) => (
          <Space size="middle">
            <Link
              href={`/system/config/check?id=${selectedId}&tab=${selectedTab}&tempId=${record.templateId}`}
            >
              详情
            </Link>
            <a
              onClick={() => {
                copyCheckTemplate(record);
              }}
            >
              复制
            </a>
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
          setCurrentTemplate(undefined);
          setOpen(true);
        }}
      >
        新增试题抽检问卷
      </Button>

      <Table
        columns={columns}
        dataSource={checkList?.data || []}
        loading={loading || submitLoading}
      />
      <CreateModal
        type={selectedTab as 'check' | 'collect'}
        open={open}
        setOpen={setOpen}
        refreshList={getCheckList}
        initValues={
          currentTemplate
            ? {
                ...currentTemplate,
                currentSystemId: system.id,
                templateType: TemplateTypeEnum.Check,
              }
            : undefined
        }
      />
    </main>
  );
};
export default Check;
