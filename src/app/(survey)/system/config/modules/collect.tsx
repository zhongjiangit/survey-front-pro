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

interface CollectProps {
  system: SystemListType;
}

const Collect = ({ system }: CollectProps) => {
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
        templateType: TemplateTypeEnum.Collect,
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
    run: getCollectList,
    data: collectList,
    loading,
  } = useRequest(() => {
    return Api.getTemplateOutlineList({
      currentSystemId: system.id,
      templateType: TemplateTypeEnum.Collect,
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
        getCollectList();
      },
    }
  );

  const copyCollectTemplate = (record: TemplateItemType) => {
    createOutline({
      templateId: record.templateId,
      currentSystemId: record.currentSystemId,
      templateType: TemplateTypeEnum.Collect,
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
              href={`/system/config/collect?id=${selectedId}&tab=${selectedTab}&tempId=${record.templateId}`}
            >
              详情
            </Link>
            <a
              onClick={() => {
                copyCollectTemplate(record);
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
        style={{ position: 'absolute', right: 0, top: -56 }}
        onClick={() => {
          setCurrentTemplate(undefined);
          setOpen(true);
        }}
      >
        新增数据收集
      </Button>

      <Table
        columns={columns}
        dataSource={collectList?.data || []}
        loading={loading || submitLoading}
        pagination={{
          total: collectList?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          // current: pageNumber,
          // pageSize: pageSize,
          // showTotal: total => `总共 ${total} 条`,
          // onChange: (page, pageSize) => {
          //   setPageNumber(page);
          //   setPageSize(pageSize);
          // },
        }}
      />
      <CreateModal
        type={selectedTab as 'check' | 'collect'}
        open={open}
        setOpen={setOpen}
        refreshList={getCollectList}
        initValues={
          currentTemplate
            ? {
                ...currentTemplate,
                currentSystemId: system.id,
                templateType: TemplateTypeEnum.Collect,
              }
            : undefined
        }
      />
    </main>
  );
};
export default Collect;
