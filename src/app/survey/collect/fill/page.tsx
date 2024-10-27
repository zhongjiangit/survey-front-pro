'use client';

import {
  ProcessStatusObject,
  ProcessStatusTypeEnum,
} from '@/interfaces/CommonType';
import { Space, Table } from 'antd';
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
      <a className=" text-blue-500" key="fill">
        填报任务
      </a>
    ),
  };

  // 给columns添加ts类型
  const columns: any = [
    {
      title: (
        <div>
          <div>发布单位/</div>
          <div>发布人</div>
        </div>
      ),
      dataIndex: 'orgAndUser',
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
      title: '任务名称',
      dataIndex: 'taskName',
    },
    {
      title: (
        <>
          <div>模板/</div>
          <div>每人需填报份数</div>
        </>
      ),
      dataIndex: 'maxFillCount',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
              <a className="text-blue-500">模板详情</a>
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
      title: '任务预定期限',
      dataIndex: 'key5',
      width: '20%',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
              {`${record.beginTimeFillEstimate.slice(
                0,
                -3
              )} ~ ${record.endTimeFillEstimate.slice(0, -3)}`}
            </div>
          </div>
        );
      },
    },
    {
      title: '提交状态',
      dataIndex: 'processStatus',
      render: (_: any, record: any) => {
        // @ts-ignore
        return ProcessStatusObject[record.processStatus];
      },
    },
    {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            {record.processStatus === ProcessStatusTypeEnum.NotSubmit && [
              operateButton.fill,
            ]}
            {record.processStatus === ProcessStatusTypeEnum.Reject && [
              operateButton.fill,
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
