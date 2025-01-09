import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import { taskType } from '@/app/modules/task-detail';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  EvaluateStatusTypeEnum,
  ModalTypeEnum,
  PublishTypeEnum,
  PublishTypeObject,
  PublishTypeType,
  TaskStatusObject,
  TaskStatusTypeEnum,
  TemplateTypeEnum,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Popconfirm, Space, Table } from 'antd';
import { FunctionComponent, useState } from 'react';
import ReviewDetailModal from '../../modules/review-detail-modal';
import ReviewResultModal from '../../modules/review-result-modal';
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
  refreshPublishTask: () => void;
}

const CollectListItem: FunctionComponent<CollectListItemProps> = props => {
  const { itemData, tabType, refreshPublishTask } = props;

  const [filledNumModalOpen, setFilledNumModalOpen] = useState(false);
  const [passedNumModalOpen, setPassedNumModalOpen] = useState(false);
  const [filleOrgDetailModalOpen, setFillOrgDetailModalOpen] = useState(false);
  const [filleMemberDetailModalOpen, setFillMemberDetailModalOpen] =
    useState(false);
  const [viewTask, setViewTask] = useState<taskType>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { run: setInspFillComplete } = useRequest(
    (taskId: number) => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到系统或组织机构');
      }
      return Api.setInspFillComplete({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg.orgId,
        taskId: taskId,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        refreshPublishTask();
      },
    }
  );

  const { run: setReviewReviewComplete } = useRequest(
    (taskId: number) => {
      if (!currentOrg?.orgId || !currentSystem?.systemId) {
        return Promise.reject('未获取到系统或组织机构');
      }
      return Api.setReviewReviewComplete({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg.orgId,
        taskId: taskId,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        refreshPublishTask();
      },
    }
  );

  const operateButton = {
    edit: (record: ListMyInspTaskResponse) => {
      return (
        <TaskDetailEditModal
          record={record}
          refreshList={refreshPublishTask}
          type={ModalTypeEnum.Edit}
        />
      );
    },
    detail: (record: ListMyInspTaskResponse) => {
      return (
        <a
          className=" text-blue-500"
          key="detail"
          onClick={() => {
            if (record.publishType === PublishTypeEnum.Org) {
              setFillOrgDetailModalOpen(true);
              setViewTask(record);
            } else {
              setFillMemberDetailModalOpen(true);
              setViewTask(record);
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
    finish: (record: any) => (
      <Popconfirm
        title="确认完成"
        key="finish"
        description={
          record.hasUncompletedFill === ZeroOrOneTypeEnum.One
            ? '未提交的数据将丢弃是否继续？'
            : '点击完成任务不可逆是否继续？'
        }
        onConfirm={() => {
          setInspFillComplete(record.taskId);
        }}
        onCancel={() => {}}
        okText="确定"
        cancelText="取消"
      >
        <a className=" text-blue-500" key="finished">
          完成
        </a>
      </Popconfirm>
    ),
    download: (
      <a className=" text-blue-500" key="download">
        下载
      </a>
    ),
  };

  const operateButtonEvaluate = {
    // 设置
    config: (record: ListMyInspTaskResponse) => {
      return (
        <EvaluateConfigModal
          taskId={record.taskId}
          taskName={record.taskName}
          refreshPublishTask={refreshPublishTask}
        />
      );
    },
    // 修改
    edit: (record: ListMyInspTaskResponse) => {
      return (
        <EvaluateConfigModal
          type={record.publishType}
          taskId={record.taskId}
          taskName={record.taskName}
          refreshPublishTask={refreshPublishTask}
        />
      );
    },
    // 分配
    allocate: (record: ListMyInspTaskResponse) => {
      return <EvaluateAllocateModal task={record} />;
    },
    // 评审详情
    detail: (type: PublishTypeType, record: ListMyInspTaskResponse) => {
      return <ReviewDetailModal task={record} />;
    },
    finish: (record: any) => (
      <Popconfirm
        title="确认完成"
        key="finish"
        description={
          record.hasUnCompletedReview === ZeroOrOneTypeEnum.One
            ? '未评审的数据将丢弃是否继续？'
            : '点击完成任务不可逆是否继续？'
        }
        onConfirm={() => {
          setReviewReviewComplete(record.taskId);
        }}
        onCancel={() => {}}
        okText="确定"
        cancelText="取消"
      >
        <a className=" text-blue-500" key="finished">
          完成
        </a>
      </Popconfirm>
    ),
    // 评审结果
    result: (record: ListMyInspTaskResponse) => {
      return <ReviewResultModal task={record} />;
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
      with: 100,
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
            <div>{record.createStaffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>分配方式</div>,
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
              // @ts-expect-error: fillTaskStatus might not be in TaskStatusObject
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
                description={record.description}
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
      width: 80,
      render: (_: any, record: any) => {
        return (
          <div>
            {record?.taskStatus != null
              ? // @ts-expect-error: fillTaskStatus might not be in TaskStatusObject
                TaskStatusObject[record.taskStatus]
              : '-'}
          </div>
        );
      },
    },
    {
      title: <div>任务预定期限</div>,
      dataIndex: 'key5',
      width: 160,
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
      dataIndex: 'endTimeFillActual',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return text ? text : '-';
      },
    },
    {
      title: <div>通过量</div>,
      dataIndex: 'PassCount',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        if (record.passPeople || record.passCount || record.reviewPassRate) {
          if (index === 0) {
            return (
              <div>
                {record.publishType === PublishTypeEnum.Org ? (
                  <div
                    onClick={() => {
                      setPassedNumModalOpen(true);
                      setViewTask(record);
                    }}
                  >
                    {record.passPeople ? (
                      <a className="text-blue-500 block">
                        {record.passPeople}人
                      </a>
                    ) : null}
                    {record.passCount ? (
                      <a className="text-blue-500 block">
                        {record.passCount}份
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {record.passPeople ? (
                      <span>{record.passPeople}人</span>
                    ) : null}
                    {record.passCount ? (
                      <span>{record.passCount}份</span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div className="flex flex-col">
              {record.passPeople ? <a>{record.passPeople}人</a> : null}{' '}
              {record.passCount ? <a>{record.passCount}份</a> : null}
              <div>{record.reviewPassRate}</div>
            </div>
          );
        }
      },
    },
    {
      title: <div>填报量</div>,
      dataIndex: 'key8',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        if (
          record.showFillPeople ||
          record.showFillCount ||
          record.reviewRate
        ) {
          if (index === 0) {
            return (
              <div>
                {record.publishType === PublishTypeEnum.Org ? (
                  <div
                    onClick={() => {
                      setFilledNumModalOpen(true);
                      setViewTask(record);
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
                  <div className="flex flex-col">
                    {record.showFillPeople ? (
                      <span>{record.showFillPeople}人</span>
                    ) : null}
                    {record.showFillCount ? (
                      <span>{record.showFillCount}份</span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          }
          return (
            <div className="flex flex-col">
              {record.showFillPeople ? <a>{record.showFillPeople}人</a> : null}
              {record.showFillCount ? <a>{record.showFillCount}份</a> : null}
              <div>{record.reviewRate}</div>
            </div>
          );
        }
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
          // 试题征集
          return (
            <Space className="flex justify-center items-center">
              {record.taskStatus === TaskStatusTypeEnum.NotStart && [
                operateButton.edit(record),
              ]}
              {record.taskStatus === TaskStatusTypeEnum.Processing && [
                operateButton.detail(record),
                operateButton.edit(record),
                operateButton.message,
                operateButton.finish(record),
                operateButton.download,
              ]}
              {record.taskStatus === TaskStatusTypeEnum.Finished && [
                operateButton.detail(record),
                operateButton.download,
              ]}
              {record.taskStatus === TaskStatusTypeEnum.Cancel && '-'}
            </Space>
          );
        }
        // 专家评审
        return (
          <Space className="flex justify-center items-center">
            {record.fillTaskStatus !== TaskStatusTypeEnum.Finished && '-'}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.Cancel &&
              operateButtonEvaluate.detail(record.publishType, record)}
            {record.fillTaskStatus === TaskStatusTypeEnum.Finished &&
              (!record.reviewTaskStatus ||
                record.reviewTaskStatus ===
                  EvaluateStatusTypeEnum.NotStart) && [
                operateButtonEvaluate.config(record),
              ]}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.NotStart && [
              operateButtonEvaluate.edit(record),
              operateButtonEvaluate.allocate(record),
            ]}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.Processing && [
              operateButtonEvaluate.detail(record.publishType, record),
              operateButtonEvaluate.allocate(record),
              operateButtonEvaluate.message,
              operateButtonEvaluate.result(record),
              operateButtonEvaluate.finish(record),
            ]}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.Finished && [
              operateButtonEvaluate.detail(record.publishType, record),
              operateButtonEvaluate.result(record),
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
      render: (_: any, record: any, index: number) => {
        if (index === 0) {
          return (
            <div>
              {record.taskStatus === TaskStatusTypeEnum.NotStart && '-'}
              {(record.taskStatus === TaskStatusTypeEnum.Processing ||
                record.taskStatus === TaskStatusTypeEnum.Finished) &&
                operateButton.detail(record)}
            </div>
          );
        }
        return (
          <Space className="flex justify-center items-center">
            {record?.reviewTaskStatus ? null : '-'}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.Processing && [
              operateButtonEvaluate.detail(record.publishType, record),
            ]}
            {record.reviewTaskStatus === EvaluateStatusTypeEnum.Finished && [
              operateButtonEvaluate.detail(record.publishType, record),
              operateButtonEvaluate.result(record),
            ]}
          </Space>
        );
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
      taskStatus: obj?.reviewTaskStatus,
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
      <div className="flex flex-col gap-5">
        {itemData?.map((item, index) => {
          return (
            <div key={index}>
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg pb-2 pl-4">
                  <span>NO.{index + 1}</span> {item?.taskName}
                </div>
                {tabType === 'self' && (
                  <div className="flex gap-2">
                    <TaskEditModal
                      task={item}
                      refreshPublishTask={refreshPublishTask}
                    />
                    {item.fillTaskStatus !== 2 ||
                    item.reviewTaskStatus !== 2 ? (
                      <TaskDeleteModal
                        taskId={item.taskId}
                        onRefresh={refreshPublishTask}
                      />
                    ) : null}
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
        task={viewTask}
      />
      <TaskPassedModal
        open={passedNumModalOpen}
        setOpen={setPassedNumModalOpen}
        task={viewTask}
      />
      <TaskOrgFillDetailModal
        task={viewTask}
        open={filleOrgDetailModalOpen}
        setOpen={setFillOrgDetailModalOpen}
        refreshList={refreshPublishTask}
      />
      <TaskMemberFillDetailModal
        task={viewTask}
        open={filleMemberDetailModalOpen}
        setOpen={setFillMemberDetailModalOpen}
        refreshList={refreshPublishTask}
      />
    </>
  );
};

export default CollectListItem;
