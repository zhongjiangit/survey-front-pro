'use client';

import Api from '@/api';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { ProcessStatusObject, TemplateTypeEnum } from '@/types/CommonType';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Divider, Input, InputNumber, Modal, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import StandardDetailModal from '../../modules/standard-detail-modal';

interface TaskReviewDetailModalProps {
  task: any;
}

const TaskReviewDetailModal = ({ task }: TaskReviewDetailModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [open, setOpen] = useState(false);

  const { data: listReviewDetailsExpertData, run: getListReviewDetailsExpert } =
    useRequest(
      () => {
        return Api.listReviewDetailsExpert({
          currentSystemId: currentSystem?.systemId!,
          currentOrgId: currentOrg!.orgId!,
          taskId: task.taskId,
          pageNumber,
          pageSize,
        });
      },
      {
        manual: true,
        onSuccess: data => {
          console.log('listReviewDetailsExpertData', data);
        },
      }
    );

  const { run: saveReviewDetails } = useRequest(
    values => {
      return Api.saveReviewDetails({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        taskId: task.taskId,
        ...values,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        console.log('listReviewDetailsExpertData', data);
      },
    }
  );

  const { run: expertSubmit } = useRequest(
    values => {
      return Api.expertSubmit({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        taskId: task.taskId,
        ...values,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        console.log('listReviewDetailsExpertData', data);
      },
    }
  );

  useEffect(() => {
    if (open) {
      getListReviewDetailsExpert();
    }
  }, [open]);

  const saveReview = (record: any) => {
    saveReviewDetails({});
    console.log(record);
  };

  const submitReview = (record: any) => {
    expertSubmit({ singleFillId: record.singleFillId });
    console.log('submit', record);
  };

  const columns: any = [
    {
      title: '单位',
      dataIndex: 'fillerOrgName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.fillerOrgName : '-'}</div>;
      },
    },
    {
      title: <div>姓名</div>,
      dataIndex: 'fillerStaffName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.fillerStaffName : '-'}</div>;
      },
    },
    {
      title: <div>试卷编号</div>,
      dataIndex: 'fillIndex',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.isShowInfo ? record.fillIndex : '-'}</div>;
      },
    },
    {
      title: <div>试卷</div>,
      dataIndex: 'templateId',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <TemplateDetailModal
            showDom={'详情'}
            templateId={record.templateId || 1}
            TemplateType={TemplateTypeEnum.Check}
          />
        );
      },
    },
    {
      title: <div>状态</div>,
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
      title: <div>评分（满分：50）</div>,
      dataIndex: 'totalScore',
      align: 'center',
    },
    {
      title: (
        <div className="flex gap-1 items-center justify-center">
          <span>评价维度</span>
          <StandardDetailModal
            showDom={<ExclamationCircleOutlined className="cursor-pointer" />}
          />
        </div>
      ),
      dataIndex: 'dimension',
      width: '18%',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            {record?.dimensionScores?.map((item: any, index: number) => {
              return (
                <div key={item.dimensionId}>
                  <span>{item.dimensionName}</span>
                  {index + 1 !== record?.dimensionScores?.length && (
                    <Divider className="my-4" />
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: <div>维度评分</div>,
      dataIndex: 'dimensionScores',
      width: '11%',
      align: 'center',
      render: (text: any) => {
        return (
          <div>
            {text?.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <InputNumber
                    min={0}
                    max={5}
                    defaultValue={item.reviewScore}
                  />
                  {index + 1 !== text.length && <Divider className="my-4" />}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: <div>专家点评</div>,
      dataIndex: 'expertComment',
      align: 'center',
      render: (text: string) => {
        return (
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            defaultValue={text}
          ></Input.TextArea>
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
          <>
            {record.reviewStatus === 0 && (
              <Space>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    saveReview(record);
                  }}
                >
                  保存
                </a>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    submitReview(record);
                  }}
                >
                  提交
                </a>
              </Space>
            )}
            {record.reviewStatus === 1 && (
              <Space>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    saveReview(record);
                  }}
                >
                  保存
                </a>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    submitReview(record);
                  }}
                >
                  提交
                </a>
              </Space>
            )}
            {record.reviewStatus === 2 && '-'}
            {record.reviewStatus === 3 && '-'}
            {record.reviewStatus === 4 && (
              <Space>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    saveReview(record);
                  }}
                >
                  保存
                </a>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    submitReview(record);
                  }}
                >
                  提交
                </a>
                <a className="text-blue-500" onClick={() => {}}>
                  驳回履历
                </a>
              </Space>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        评审详情
      </a>
      <Modal
        open={open}
        title="专家评审"
        width={1400}
        onCancel={() => setOpen(false)}
        footer={
          <div className="flex justify-end gap-5 px-20">
            <Button size="large" onClick={() => {}}>
              保存本页
            </Button>
            <Button size="large" type="primary" onClick={() => {}}>
              提交本页
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={listReviewDetailsExpertData?.data || []}
          // dataSource={testDataSource}
        />
      </Modal>
    </>
  );
};

export default TaskReviewDetailModal;
