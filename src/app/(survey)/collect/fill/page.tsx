'use client';

import TemplateDetailModal from '@/app/modules/template-detail-modal';
import {
  ProcessStatusObject,
  ProcessStatusTypeEnum,
  TemplateTypeEnum,
} from '@/types/CommonType';
import { Space, Table } from 'antd';
import Link from 'next/link';
import { toAllotTaskData } from '../testData';
interface ItemDataType {
  title: string;
  dataSource: any[];
  showNumber: number;
}
interface CollectListItemProps {
  tabType: 'self' | 'subordinate';
  itemData: ItemDataType;
}
// taskId	int		任务id
// systemId	int		系统id
// orgId	int		发布单位id
// orgName	string		发布单位名称
// staffId	int		发布成员id
// staffName	string		发布成员名称
// taskName	string		任务名称
// beginDateFillEstimate	string		预计填报开始日期 yyyy-mm-dd
// endDateFillEstimate	string		预计填报结束日期 yyyy-mm-dd
// templateId	int		模板id
// maxFillCount	int		最大可提交份数，0表示不限制
// taskStatus	int		任务状态 0：未开始 1：进行中 2：完成
// processStatus	int		提交状态 0：未提交 1: 已提交 2：驳回 listFillCollectionTask接口未返回该字段，是找错接口了吗？ todo

const ToAllotTask = () => {
  const operateButton = {
    fill: (
      <Link className=" text-blue-500" key="fill" href="/collect/fill/detail">
        填报任务
      </Link>
    ),
    submit: <a className=" text-blue-500">提交</a>,
  };

  // 给columns添加ts类型
  const columns: any = [
    {
      title: (
        <div>
          <div>发布单位</div>
          <div>发布人</div>
        </div>
      ),
      dataIndex: 'orgAndUser',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.orgName}</div>
            <div>{record.staffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>任务名称</div>,
      dataIndex: 'taskName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.taskName}</div>;
      },
    },
    {
      title: (
        <div>
          <div>模板</div>
          <div>每人填报数</div>
        </div>
      ),
      dataIndex: 'maxFillCount',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
              <TemplateDetailModal
                templateId={1}
                TemplateType={TemplateTypeEnum.Collect}
              />
            </div>
            {record.maxFillCount !== 0 ? (
              <div>{record.maxFillCount}份以内</div>
            ) : (
              '不限数量'
            )}
          </div>
        );
      },
    },
    {
      title: <div>任务预定期限</div>,
      dataIndex: 'key5',
      width: '20%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.beginTimeFillEstimate.slice(0, -3)}</div>
            <div>~</div>
            <div>{record.endTimeFillEstimate.slice(0, -3)}</div>
          </div>
        );
      },
    },
    {
      title: <div>提交状态</div>,
      dataIndex: 'processStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
              ProcessStatusObject[record.processStatus]
            }
          </div>
        );
      },
    },
    {
      title: <div>操作</div>,
      width: '8%',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space className="fle justify-center items-center">
            {record.processStatus === ProcessStatusTypeEnum.NotSubmit && [
              operateButton.fill,
              operateButton.submit,
            ]}
            {record.processStatus === ProcessStatusTypeEnum.Reject && [
              operateButton.fill,
              operateButton.submit,
            ]}
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={toAllotTaskData}></Table>
    </>
  );
};

export default ToAllotTask;
