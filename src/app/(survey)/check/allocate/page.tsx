'use client';

import Api from '@/api';
import { taskType } from '@/app/modules/task-detail';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  ModalTypeEnum,
  PublishTypeEnum,
  TaskStatusObject,
  TaskStatusTypeEnum,
  TemplateTypeEnum,
} from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import TaskDetailEditModal from '../manage/modules/task-detail-edit-modal';
import TaskFilledModal from '../manage/modules/task-filled-modal';
import TaskOrgFillDetailModal from '../manage/modules/task-org-fill-detail-modal';
import TaskPassedModal from '../manage/modules/task-passed-modal';
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

const ToAllotTask = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filleOrgDetailModalOpen, setFillOrgDetailModalOpen] = useState(false);
  const [viewTask, setViewTask] = useState<taskType>();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [passedNumModalOpen, setPassedNumModalOpen] = useState(false);
  const [filledNumModalOpen, setFilledNumModalOpen] = useState(false);

  const { data: listAssignInspTaskData, refresh: refreshListAssignInspTask } =
    useRequest(
      () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        return Api.listAssignInspTask({
          currentSystemId: currentSystem?.systemId!,
          currentOrgId: currentOrg!.orgId!,
          pageNumber,
          pageSize,
        });
      },
      {
        refreshDeps: [
          currentSystem?.systemId,
          currentOrg?.orgId,
          pageNumber,
          pageSize,
        ],
      }
    );

  // const { data: fillProcessDetailsData, run: getFillProcessDetails } =
  //   useRequest(
  //     (taskId: number) => {
  //       if (!currentSystem?.systemId || !currentOrg?.orgId) {
  //         return Promise.reject('currentSystem or currentOrg is not exist');
  //       }
  //       return Api.getFillProcessDetails({
  //         currentSystemId: currentSystem?.systemId!,
  //         currentOrgId: currentOrg!.orgId!,
  //         taskId: taskId,
  //         pageNumber,
  //         pageSize,
  //       });
  //     },
  //     {
  //       refreshDeps: [
  //         currentSystem?.systemId,
  //         currentOrg?.orgId,
  //         pageNumber,
  //         pageSize,
  //       ],
  //     }
  //   );

  const operateButton = {
    allot: (record: any) => (
      <TaskDetailEditModal
        record={record}
        refreshList={refreshListAssignInspTask}
        linkName={'分配任务'}
        type={ModalTypeEnum.Allot}
      />
    ),

    detail: (record: any) => (
      <a
        className=" text-blue-500"
        key="detail"
        onClick={() => {
          if (record.publishType === PublishTypeEnum.Org) {
            setViewTask(record);
            setFillOrgDetailModalOpen(true);
          } else {
            // setFillMemberDetailModalOpen(true);
          }
        }}
      >
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
      align: 'center',
      dataIndex: 'orgAndUser',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>{record.createOrgName}</div>
            <div>{record.createStaffName}</div>
          </div>
        );
      },
    },
    {
      title: <div>任务名称</div>,
      align: 'center',
      dataIndex: 'taskName',
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
      align: 'center',
      dataIndex: 'maxFillCount',
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
      dataIndex: 'fillTaskStatus',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {
              // @ts-expect-error: fillTaskStatus might not be in TaskStatusObject
              TaskStatusObject[record.fillTaskStatus]
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
      title: <div>通过量</div>,
      dataIndex: 'key7',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div
            onClick={() => {
              setPassedNumModalOpen(true);
              setViewTask(record);
            }}
          >
            {record.publishType === PublishTypeEnum.Org ? (
              <div>
                <a className="text-blue-500 block">{record.fillPassPeople}人</a>
                <a className="text-blue-500 block">{record.fillPassCount}份</a>
              </div>
            ) : (
              <div>
                <div>{record.fillPassPeople}人</div>
                <div>{record.fillPassCount}份</div>
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
          <div
            onClick={() => {
              setFilledNumModalOpen(true);
              setViewTask(record);
            }}
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
      title: <div>操作</div>,
      width: '8%',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space className="fle justify-center items-center">
            {record.fillTaskStatus === TaskStatusTypeEnum.NotStart && [
              operateButton.allot(record),
            ]}
            {record.fillTaskStatus === TaskStatusTypeEnum.Processing && [
              operateButton.detail(record),
              operateButton.allot(record),
            ]}
            {record.fillTaskStatus === TaskStatusTypeEnum.Finished && [
              operateButton.detail(record),
            ]}
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    return () => {
      setPageNumber(1);
      setPageSize(10);
    };
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={listAssignInspTaskData?.data || []}
        pagination={{
          total: listAssignInspTaskData?.total,
          showSizeChanger: true,
          showQuickJumper: true,
          current: pageNumber,
          pageSize: pageSize,
          showTotal: total => `总共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPageNumber(page);
            setPageSize(pageSize);
          },
        }}
      ></Table>
      <TaskOrgFillDetailModal
        task={viewTask}
        open={filleOrgDetailModalOpen}
        setOpen={setFillOrgDetailModalOpen}
        refreshList={refreshListAssignInspTask}
      />
      <TaskPassedModal
        open={passedNumModalOpen}
        setOpen={setPassedNumModalOpen}
        task={viewTask}
      />
      <TaskFilledModal
        open={filledNumModalOpen}
        setOpen={setFilledNumModalOpen}
        task={viewTask}
      />
    </>
  );
};

export default ToAllotTask;
