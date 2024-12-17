import TemplateDetailModal from '@/app/modules/template-detail-modal';
import {
  PublishTypeEnum,
  PublishTypeObject,
  PublishTypeType,
  TaskStatusObject,
  TaskStatusTypeEnum,
  TemplateTypeEnum,
} from '@/types/CommonType';
import { Space, Table } from 'antd';
import { FunctionComponent, useState } from 'react';
import TaskDeleteModal from './task-delete-modal';
import TaskDetailEditModal from './task-detail-edit-modal';
import TaskEditModal from './task-edit-modal';
import TaskFilledModal from './task-filled-modal';
import TaskMemberFillDetailModal from './task-member-fill-detail-modal';
import TaskOrgFillDetailModal from './task-org-fill-detail-modal';
import TaskPassedModal from './task-passed-modal';
type ItemDataType = any[];
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
  const { itemData, tabType } = props;

  const [filledNumModalOpen, setFilledNumModalOpen] = useState(false);
  const [passedNumModalOpen, setPassedNumModalOpen] = useState(false);
  const [filleOrgDetailModalOpen, setFillOrgDetailModalOpen] = useState(false);
  const [filleMemberDetailModalOpen, setFillMemberDetailModalOpen] =
    useState(false);

  const operateButton = {
    edit: (type: PublishTypeType) => {
      return <TaskDetailEditModal type={type} />;
    },
    detail: (type: PublishTypeType) => {
      return (
        <a
          className=" text-blue-500"
          key="detail"
          onClick={() => {
            if (type === PublishTypeEnum.Org) {
              setFillOrgDetailModalOpen(true);
            } else {
              setFillMemberDetailModalOpen(true);
            }
          }}
        >
          详情
        </a>
      );
    },
    message: (
      <a className=" text-blue-500" key="message">
        短信提醒
      </a>
    ),
    finish: (
      <a className=" text-blue-500" key="finish">
        完成
      </a>
    ),
    download: (
      <a className=" text-blue-500" key="download">
        下载
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
      title: <div>任务分配方式</div>,
      dataIndex: 'publishType',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-expect-error: Object is possibly 'null'.
              PublishTypeObject[record.publishType]
            }
          </div>
        );
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
              // @ts-expect-error: Object is possibly 'null'.
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
      title: <div>任务完成时间</div>,
      dataIndex: 'endTimeFillActual',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: <div>通过量</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {record.publishType === PublishTypeEnum.Org ? (
              <div
                onClick={() => {
                  setPassedNumModalOpen(true);
                }}
              >
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
      title: <div>填报量</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {record.publishType === PublishTypeEnum.Org ? (
              <div
                onClick={() => {
                  setFilledNumModalOpen(true);
                }}
              >
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
      width: '10%',
      hidden: tabType !== 'self',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space className="flex justify-center items-center">
            {record.taskStatus === TaskStatusTypeEnum.NotStart && [
              operateButton.edit(record.publishType),
            ]}
            {record.taskStatus === TaskStatusTypeEnum.Processing && [
              operateButton.detail(record.publishType),
              operateButton.edit(record.publishType),
              operateButton.message,
              operateButton.finish,
              operateButton.download,
            ]}
            {record.taskStatus === TaskStatusTypeEnum.Finished && [
              operateButton.detail(record.publishType),
              operateButton.download,
            ]}
          </Space>
        );
      },
    },
    {
      title: <div>操作</div>,
      width: '10%',
      hidden: tabType !== 'subordinate',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{operateButton.detail(record.publishType)}</div>;
      },
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-5">
        {itemData.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg pb-2 pl-4">
                  <span>NO.{index + 1}</span>
                  {item?.taskName}
                </div>
                {tabType === 'self' && (
                  <div className="flex gap-2">
                    <TaskEditModal />
                    <TaskDeleteModal />
                  </div>
                )}
              </div>
              <Table
                pagination={false}
                columns={columns}
                dataSource={[item]}
              ></Table>
            </div>
          );
        })}
      </div>
      <TaskFilledModal
        open={filledNumModalOpen}
        setOpen={setFilledNumModalOpen}
      />
      <TaskPassedModal
        open={passedNumModalOpen}
        setOpen={setPassedNumModalOpen}
      />
      <TaskOrgFillDetailModal
        open={filleOrgDetailModalOpen}
        setOpen={setFillOrgDetailModalOpen}
      />
      <TaskMemberFillDetailModal
        open={filleMemberDetailModalOpen}
        setOpen={setFillMemberDetailModalOpen}
      />
    </>
  );
};

export default CollectListItem;
