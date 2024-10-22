import { TaskStatusObject } from '@/interfaces/CommonType';
import { Space, Table } from 'antd';
import { FunctionComponent } from 'react';
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
  // 给columns添加ts类型
  const columns: any = [
    {
      title: '发布单位发布人',
      dataIndex: 'orgAndUser',
      render: (_, record: any) => {
        return `${record.orgName} / ${record.staffName}`;
      },
    },
    {
      title: '任务分配方',
      dataIndex: 'key2',
    },
    {
      title: '模版每人需填报份数',
      width: '10%',
      dataIndex: 'maxFillCount',
    },
    {
      title: '状态',
      dataIndex: 'taskStatus',
      render: (_, record: any) => {
        // @ts-ignore
        return TaskStatusObject[record.taskStatus];
      },
    },
    {
      title: '任务预定期限',
      dataIndex: 'key5',
      width: '18%',
      render: (_, record: any) => {
        return `${record.beginTimeFillEstimate} ~  ${record.endTimeFillEstimate}`;
      },
    },
    {
      title: ' 任务完成时间',
      dataIndex: 'endTimeFillActual',
      width: '11%',
    },
    {
      title: '通过数',
      dataIndex: 'key7',
      render: (_, record: any) => {
        return `${record.passPeople}人 / ${record.passCount}份`;
      },
    },
    {
      title: '填报数',
      dataIndex: 'key8',
      render: (_, record: any) => {
        return `${record.fillPeople}人 / ${record.fillCount}份`;
      },
    },
    {
      title: '操作',
      width: '10%',
      dataIndex: 'operation',
      render: (_, record: any) => {
        return (
          <Space>
            <a className=" text-blue-500">详情</a>
            <a className=" text-blue-500">更多</a>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg pb-2 pl-4">
          <span>NO.{itemData?.showNumber}</span>
          {itemData?.title}
        </div>
        <div className="flex gap-2">
          <a className=" text-blue-500">编辑</a>
          <a className=" text-blue-500">删除</a>
        </div>
      </div>

      <Table
        //   title={() => (
        //     <div className="font-bold text-lg py-1">
        //       <span>NO.{itemData?.showNumber}</span>
        //       {itemData?.title}
        //     </div>
        //   )}
        columns={columns}
        dataSource={itemData?.dataSource || []}
      ></Table>
    </>
  );
};

export default CollectListItem;
