'use client';

import Api from '@/api';
import { SystemListType } from '@/api/system/getSystemListAll';
import { TemplateItemType } from '@/api/template/list-outline';
import {
  TemplateTypeEnum,
  ZeroOrOneType,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLocalStorageState, useRequest } from 'ahooks';
import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
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
      manual: true,
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
        currentSystemId: system.id,
        templateType: params.templateType,
        templateTitle: params.templateTitle,
        isValid: params.isValid, // or 0, depending on your logic
        memo: params.memo,
      });
    },
    {
      manual: true,
      onSuccess: (response, params) => {
        getTemplateDetails(params[0].templateId, response?.data.id);
        getCheckList();
      },
    }
  );

  const { run: deleteTemplate, loading: deleteLoading } = useRequest(
    (id: number) => {
      return Api.deleteTemplate({
        currentSystemId: system.id,
        templateId: id,
      });
    },
    {
      manual: true,
      onSuccess: () => {
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
        title: '抽检模板',
        dataIndex: 'templateTitle',
        key: 'checkList',
        render: (text: string, record: TemplateItemType) => (
          <div className="flex items-center gap-1">
            <span>{text}</span>
            <Tooltip title={record.memo}>
              <QuestionCircleOutlined className="cursor-pointer" />
            </Tooltip>
          </div>
        ),
      },

      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
              onConfirm={() => {
                deleteTemplate(record.templateId);
              }}
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
        style={{ position: 'absolute', right: 0, top: -56 }}
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
        loading={loading || submitLoading || deleteLoading}
        pagination={{
          total: checkList?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          // showTotal: total => `总共 ${total} 条`,
        }}
      />
      <CreateModal
        type={selectedTab as 'check' | 'collect'}
        open={open}
        selectedId={selectedId}
        selectedTab={selectedTab}
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
