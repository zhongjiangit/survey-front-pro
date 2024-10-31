'use client';

import {
  PublishTypeEnum,
  TaskStatusObject,
  TaskStatusTypeEnum,
} from '@/interfaces/CommonType';
import { Space, Table } from 'antd';
import { toAllotTaskData } from '../testData';
import TaskAllocateModal from '../manage/modules/task-allocate-modal';
import TemplateDetailModal from '@/components/common/template-detail-modal';
interface ItemDataType {
  title: string;
  dataSource: any[];
  showNumber: number;
}
interface CollectListItemProps {
  tabType: 'self' | 'subordinate';
  itemData: ItemDataType;
}
// systemId	int		系统id
// orgId	int		发布单位id
// orgName	string		发布单位名称
// staffId	int		发布成员id
// staffName	string		发布成员名称
// taskName	string		任务名称
// beginDateFillEstimate	string		预计填报开始日期 yyyy-mm-dd
// endDateFillEstimate	string		预计填报结束日期 yyyy-mm-dd
// endDateFillActual	string	○	实际填报结束日期 yyyy-mm-dd，未结束不传
// templateId	int		模板id
// maxFillCount	int		最大可提交份数，0表示不限制
// publishType	int		任务发布类型  1：按层级发布   2：指定人员发布
// passPeople	int		通过人数
// passCount	int		通过份数
// FillPeople	int		填报人数
// FillCount	int		填报份数
// taskStatus	int		任务状态 0：未开始 1：进行中 2：完成
//  todo 发现一个bug:页面刷新后不会根据当前路由定位到菜单栏，需要手动点击一下才会定位到

const ToAllotTask = () => {
  const operateButton = {
    allot: (type: PublishTypeEnum) => <TaskAllocateModal type={type} />,

    detail: (
      <a className=" text-blue-500" key="detail">
        详情
      </a>
    ),
  };

  // 给columns添加ts类型
  const columns: any = [
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          <div>发布单位</div>
          <div>发布人</div>
        </div>
      ),
      dataIndex: 'orgAndUser',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            <div>{record.orgName}</div>
            <div>{record.staffName}</div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          任务名称
        </div>
      ),
      dataIndex: 'taskName',
      render: (text: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            {text}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          <div>模板</div>
          <div>每人填报数</div>
        </div>
      ),
      width: '10%',
      dataIndex: 'maxFillCount',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            <div>
              <TemplateDetailModal />
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
      title: (
        <div className="flex flex-col justify-center items-center">状态</div>
      ),
      dataIndex: 'taskStatus',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            {
              // @ts-ignore
              TaskStatusObject[record.taskStatus]
            }
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          任务预定期限
        </div>
      ),
      dataIndex: 'key5',
      width: '18%',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            <div>{record.beginTimeFillEstimate.slice(0, -3)}</div>
            <div>~</div>
            <div>{record.endTimeFillEstimate.slice(0, -3)}</div>
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          通过数量
        </div>
      ),
      dataIndex: 'key7',
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col justify-center items-center">
            {record.publishType === PublishTypeEnum.Org ? (
              <div>
                <a className="text-blue-500 block">{record.passPeople}人</a>
                <a className="text-blue-500 block">{record.passCount}份</a>
              </div>
            ) : (
              <div>
                <div>{record.passPeople}人</div>
                <div>{record.passCount}份</div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">
          填报数量
        </div>
      ),
      dataIndex: 'key8',
      render: (_: any, record: any) => {
        return (
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => {}}
          >
            {record.publishType === PublishTypeEnum.Org ? (
              <div>
                <a className="text-blue-500 block">{record.fillPeople}人</a>
                <a className="text-blue-500 block">{record.fillCount}份</a>
              </div>
            ) : (
              <div>
                <div>{record.fillPeople}人</div>
                <div>{record.fillCount}份</div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col justify-center items-center">操作</div>
      ),
      width: '10%',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            {record.taskStatus === TaskStatusTypeEnum.NotStart && [
              operateButton.allot(record.publishType),
            ]}
            {record.taskStatus === TaskStatusTypeEnum.Processing && [
              operateButton.detail,
              operateButton.allot(record.publishType),
            ]}
            {record.taskStatus === TaskStatusTypeEnum.Finished && [
              operateButton.detail,
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
