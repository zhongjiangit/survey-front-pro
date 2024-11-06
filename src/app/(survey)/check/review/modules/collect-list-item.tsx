import {
  PublishTypeType,
  TaskStatusObject,
  TaskStatusTypeEnum,
} from '@/types/CommonType';
import { Table } from 'antd';
import { FunctionComponent } from 'react';
import StandardDetailModal from '../../modules/standard-detail-modal';
import TaskReviewDetailModal from './task-review-detail-modal';
type ItemDataType = any[];
interface CollectListItemProps {
  itemData: ItemDataType;
}

// taskId	int		任务id
// systemId	int		系统id
// orgId	int		发布单位id
// orgName	string		发布单位名称
// staffId	int		发布成员id
// staffName	string		发布成员名称
// taskName	string		任务名称
// beginTimeFillEstimate	string		预计填报开始时间 yyyy-mm-dd hh:MM:ss
// endTimeFillEstimate	string		预计填报结束时间 yyyy-mm-dd hh:MM:ss
// endTimeFillActual	string	○	实际填报结束时间 yyyy-mm-dd hh:MM:ss，未结束不传
// templateId	int		模板id
// maxFillCount	int		最大可提交份数，0表示不限制
// publishType	int		任务发布类型  1：按层级发布   2：指定人员发布
// passPeople	int		通过人数
// passCount	int		通过份数
// FillPeople	int		填报人数
// FillCount	int		填报份数
// taskStatus	int		任务状态 0：未开始 1：进行中 2：完成
// processStatus	int		提交状态 0：未提交 1: 已提交 2：驳回

const CollectListItem: FunctionComponent<CollectListItemProps> = props => {
  const { itemData } = props;

  const operateButton = {
    detail: (type: PublishTypeType) => {
      return <TaskReviewDetailModal key="detail" />;
    },
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
      dataIndex: 'task',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.title}</div>;
      },
    },
    {
      title: <div>评价标准及准则</div>,
      dataIndex: 'standard',
      align: 'center',
      render: (_: any, record: any) => {
        return <StandardDetailModal />;
      },
    },
    {
      title: <div>任务状态</div>,
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
      title: <div>通过</div>,
      dataIndex: 'endTimeFillActual',
      align: 'center',
      render: (text: any, record: any) => {
        return (
          <div>
            <div>{record.passPeople}%</div>
            <div>{record.passCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>驳回</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.passPeople}%</div>
            <div>{record.passCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>提交</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.fillPeople}%</div>
            <div>{record.fillCount}份</div>
          </div>
        );
      },
    },
    {
      title: <div>填报</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.fillPeople}%</div>
            <div>{record.fillCount}份</div>
          </div>
        );
      },
    },

    {
      title: <div>操作</div>,
      width: '10%',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {record.taskStatus === TaskStatusTypeEnum.Processing
              ? operateButton.detail(record.publishType)
              : '-'}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-5">
        <Table columns={columns} dataSource={itemData} />
      </div>
    </>
  );
};

export default CollectListItem;
