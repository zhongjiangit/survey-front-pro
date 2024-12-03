'use client';

import TemplateDetailModal from '@/app/modules/template-detail-modal';
import {
  PublishTypeEnum,
  TaskStatusObject,
  TaskStatusTypeEnum,
  TemplateTypeEnum,
} from '@/types/CommonType';
import { Space, Table } from 'antd';
import TaskAllocateModal from '../manage/modules/task-allocate-modal';
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
      render: (text: any, record: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: (
        <div>
          <div>模板</div>
          <div>每人填报数</div>
        </div>
      ),
      width: '10%',
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
      title: <div>状态</div>,
      dataIndex: 'taskStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
              TaskStatusObject[record.taskStatus]
            }
          </div>
        );
      },
    },
    {
      title: <div>任务预定期限</div>,
      dataIndex: 'key5',
      width: '18%',
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
      title: <div>通过数量</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
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
      title: <div>填报数量</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div onClick={() => {}}>
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
      title: <div>操作</div>,
      width: '8%',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space className="fle justify-center items-center">
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
