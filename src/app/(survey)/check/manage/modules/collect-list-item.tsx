import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
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
import ReviewDetailModal from '../../modules/review-detail-modal/page';
import ReviewResultModal from '../../modules/review-result-modal/page';
import EvaluateAllocateModal from './evaluate-allocate-modal';
import EvaluateConfigModal from './evaluate-config-modal';
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
  itemData: ItemDataType | undefined;
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

  const operateCollectButton = {
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

  const operateCheckButton = {
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
          评审详情
        </a>
      );
    },
    checkResult: (
      <a className=" text-blue-500" key="checkResult">
        评审结果
      </a>
    ),
    message: (
      <a className=" text-blue-500" key="message">
        短信提醒
      </a>
    ),
    set: (
      <a className=" text-blue-500" key="set">
        设置
      </a>
    ),
    checkDetail: (
      <a className=" text-blue-500" key="checkDetail">
        评审详情
      </a>
    ),
    allocate: (
      <a className=" text-blue-500" key="allocate">
        分配
      </a>
    ),
    delete: (
      <a className=" text-blue-500" key="delete">
        删除
      </a>
    ),
  };

  const operateButtonEvaluate = {
    config: () => {
      return <EvaluateConfigModal />;
    },
    edit: (type: string) => {
      return <EvaluateConfigModal type={type} />;
    },
    allocate: () => {
      return <EvaluateAllocateModal />;
    },
    detail: (type: PublishTypeType) => {
      return <ReviewDetailModal />;
    },
    result: () => {
      return <ReviewResultModal />;
    },
    message: (
      <a className=" text-blue-500" key="message">
        短信提醒
      </a>
    ),
  };

  // 给columns添加ts类型
  const columns: any = [
    {
      title: <div>阶段名称</div>,
      dataIndex: 'stage',
      align: 'center',
      render: (text: any) => {
        //  todo 接口无字段
        return <div>{text}</div>;
      },
    },
    {
      title: (
        <div>
          <div>发布单位</div>
          <div>发布人</div>
        </div>
      ),
      dataIndex: 'orgAndUser',
      align: 'center',
      onCell: (_: any, index: number) => {
        if (index === 0) {
          return { rowSpan: 2 };
        }
        return { rowSpan: 0 };
      },
      render: (_: any, record: any) => {
        return (
          <div className="flex flex-col gap-3 justify-center items-center">
            <div>{record.createOrgName}</div>
            <div>{record.staffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>任务分配方式</div>,
      dataIndex: 'publishType',
      align: 'center',
      onCell: (_: any, index: number) => {
        if (index === 0) {
          return { rowSpan: 2 };
        }
        return { rowSpan: 0 };
      },
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-ignore
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
      onCell: (_: any, index: number) => {
        if (index === 0) {
          return { rowSpan: 2 };
        }
        return { rowSpan: 0 };
      },
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
              <TemplateDetailModal
                templateId={record.templateId}
                TemplateType={TemplateTypeEnum.Check}
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
          record?.beginTimeEstimate && (
            <div>
              <div>{record?.beginTimeEstimate?.slice(0, -3)}</div>
              <div>~</div>
              <div>{record?.endTimeEstimate?.slice(0, -3)}</div>
            </div>
          )
        );
      },
    },
    {
      title: <div>任务完成时间</div>,
      dataIndex: 'endTimeActual',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return <div>{text}</div>;
      },
    },
    {
      title: <div>通过数量</div>,
      dataIndex: 'PassCount',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        if (index === 0) {
          return (
            <div>
              {record.publishType === PublishTypeEnum.Org ? (
                <div
                  onClick={() => {
                    setPassedNumModalOpen(true);
                  }}
                >
                  {record.passPeople ? (
                    <a className="text-blue-500 block">{record.passPeople}人</a>
                  ) : null}
                  {record.passCount ? (
                    <a className="text-blue-500 block">{record.passCount}份</a>
                  ) : null}
                </div>
              ) : (
                <div
                  onClick={() => {
                    setPassedNumModalOpen(true);
                  }}
                >
                  {record.passPeople ? <a>{record.passPeople}人</a> : null}
                  {record.passCount ? <a>{record.passCount}份</a> : null}
                </div>
              )}
            </div>
          );
        }

        return (
          <div>
            {record.passPeople ? <a>{record.passPeople}人</a> : null}{' '}
            {record.passCount ? <a>{record.passCount}份</a> : null}
            <div>{record.reviewPassRate}</div>
          </div>
        );
      },
    },
    {
      title: <div>填报数量</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        if (index === 0) {
          return (
            <div>
              {record.publishType === PublishTypeEnum.Org ? (
                <div
                  onClick={() => {
                    setFilledNumModalOpen(true);
                  }}
                >
                  {record.showFillPeople ? (
                    <a className="text-blue-500 block">
                      {record.showFillPeople}人
                    </a>
                  ) : null}
                  {record.showFillCount ? (
                    <a className="text-blue-500 block">
                      {record.showFillCount}份
                    </a>
                  ) : null}
                </div>
              ) : (
                <div>
                  {record.showFillPeople ? (
                    <a>{record.showFillPeople}人</a>
                  ) : null}
                  {record.showFillCount ? (
                    <a>{record.showFillCount}份</a>
                  ) : null}
                </div>
              )}
            </div>
          );
        }
        return (
          <div>
            {record.showFillPeople ? <a>{record.showFillPeople}人</a> : null}
            {record.showFillCount ? <a>{record.showFillCount}份</a> : null}
            <div>{record.reviewRate}</div>
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
      render: (_: any, record: any, index: number) => {
        if (index === 0) {
          // 我发布的任务，（一）试题征集的按钮
          return (
            <Space className="flex justify-center items-center">
              {record.taskStatus === TaskStatusTypeEnum.NotStart && [
                operateCollectButton.edit(record.publishType),
              ]}
              {record.taskStatus === TaskStatusTypeEnum.Processing && [
                operateCollectButton.detail(record.publishType),
                operateCollectButton.edit(record.publishType),
                operateCollectButton.message,
                operateCollectButton.finish,
                operateCollectButton.download,
              ]}
              {record.taskStatus === TaskStatusTypeEnum.Finished && [
                operateCollectButton.detail(record.publishType),
                operateCollectButton.download,
              ]}
            </Space>
          );
        } else {
          // 我发布的任务，（二）专家评审的按钮
          if (record.taskStatus === TaskStatusTypeEnum.NotStart) {
            return (
              <Space>
                [operateCheckButton.edit, operateCheckButton.allocate]
              </Space>
            );
          } else if (record.taskStatus === TaskStatusTypeEnum.Processing) {
            return (
              <Space>
                {[
                  operateCheckButton.detail(record.publishType),
                  operateCheckButton.edit(record.publishType),
                  operateCheckButton.allocate,
                  operateCheckButton.message,
                  operateCheckButton.checkResult,
                  operateCheckButton.delete,
                ]}
              </Space>
            );
          } else if (record.taskStatus === TaskStatusTypeEnum.Finished) {
            return (
              <Space>
                {[
                  operateCheckButton.detail(record.publishType),
                  operateCheckButton.delete,
                ]}
              </Space>
            );
          } else {
            return (
              // todo怎么判断未设置
              <Space>{[operateCheckButton.set]}</Space>
            );
          }
          // <Space className="flex justify-center items-center">
          //   {record.evaluateStatus === EvaluateStatusTypeEnum.NOConfig && [
          //     operateButtonEvaluate.config(),
          //   ]}
          //   {record.evaluateStatus === EvaluateStatusTypeEnum.NotStart && [
          //     operateButtonEvaluate.edit(record.publishType),
          //     operateButtonEvaluate.allocate(),
          //   ]}
          //   {record.evaluateStatus === EvaluateStatusTypeEnum.Processing && [
          //     operateButtonEvaluate.detail(record.publishType),
          //     operateButtonEvaluate.edit('edit'),
          //     operateButtonEvaluate.allocate(),
          //     operateButtonEvaluate.message,
          //     operateButtonEvaluate.result(),
          //   ]}
          //   {record.evaluateStatus === EvaluateStatusTypeEnum.Finished && [
          //     operateButtonEvaluate.detail(record.publishType),
          //   ]}
          // </Space>;
        }
      },
    },
    {
      title: <div>操作</div>,
      width: '10%',
      // 下级发布的任务，按钮
      hidden: tabType !== 'subordinate',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{operateCollectButton.detail(record.publishType)}</div>;
      },
    },
  ];

  const splitItemData = (obj: ListMyInspTaskResponse) => {
    const arr = [];
    arr[0] = {
      ...obj,
      stage: '（一）试题征集',
      taskStatus: obj.fillTaskStatus,
      passPeople: obj.fillPassPeople,
      passCount: obj.fillPassCount,
      beginTimeEstimate: obj.beginTimeFillEstimate,
      endTimeEstimate: obj.endTimeFillEstimate,
      endTimeActual: obj.endTimeFillActual,
      showFillPeople: obj.fillPeople,
      showFillCount: obj.fillCount,
    };
    arr[1] = {
      ...obj,
      stage: '（二）专家评审',
      taskStatus: obj.reviewTaskStatus,
      passPeople: obj.reviewPassPeople,
      passCount: obj.reviewPassCount,
      beginTimeEstimate: obj.beginTimeReviewEstimate,
      endTimeEstimate: obj.endTimeReviewEstimate,
      endTimeActual: obj.endTimeReviewActual,
      showFillPeople: obj.reviewPassCount,
      showFillCount: obj.reviewPassCount,
    };
    return arr;
  };

  return (
    <>
      {/* todo  */}
      <div className="flex flex-col gap-5">
        {itemData?.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg pb-2 pl-4">
                  <span>NO.{index + 1}</span>
                  {item?.taskName}
                </div>
                {tabType === 'self' && (
                  <div className="flex gap-2">
                    <TaskEditModal task={item} />
                    <TaskDeleteModal />
                  </div>
                )}
              </div>
              <Table
                pagination={false}
                columns={columns}
                dataSource={splitItemData(item)}
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