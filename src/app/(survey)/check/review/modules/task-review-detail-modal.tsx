'use client';

import Api from '@/api';
import { ListReviewDetailsExpertResponse } from '@/api/task/listReviewDetailsExpert';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  ProcessStatusObject,
  ProcessStatusTypeEnum,
  TemplateTypeEnum,
} from '@/types/CommonType';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import StandardDetailModal from '../../modules/standard-detail-modal';

interface TaskReviewDetailModalProps {
  task: any;
  refreshList?: () => void;
}

const TaskReviewDetailModal = ({
  task,
  refreshList,
}: TaskReviewDetailModalProps) => {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const [_loading, _setLoading] = useState<any>({ loading: {} });
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<any>([]);

  const setLoading = (key: string, loading: boolean) => {
    _loading.loading[key] = loading;
    _setLoading({ ..._loading });
  };
  const loading = _loading.loading;

  const {
    data: listReviewDetailsExpertData,
    run: getListReviewDetailsExpert,
    loading: getListReviewDetailsExpertLoading,
    refresh: refreshListReviewDetailsExpert,
  } = useRequest(
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
        form.resetFields();
        form.setFieldsValue(data.data);
        console.log('listReviewDetailsExpertData', data);
      },
    }
  );

  const { runAsync: saveReviewDetails } = useRequest(
    values => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('未获取到当前系统或组织 ID');
      }
      return Api.saveReviewDetails({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        taskId: task.taskId,
        ...values,
      });
    },
    { manual: true }
  );

  const { runAsync: expertSubmit } = useRequest(
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
      onSuccess: () => {
        refreshList?.();
      },
    }
  );

  useEffect(() => {
    if (open) {
      getListReviewDetailsExpert();
    }
  }, [getListReviewDetailsExpert, open]);

  const saveReview = async (idx: number, noRefresh?: boolean) => {
    const data = form.getFieldsValue();
    const record = listReviewDetailsExpertData?.data[idx]!;
    const values = data[idx];
    record.expertComment = values.expertComment;
    record.dimensionScores.forEach((t, i) => {
      t.reviewScore = values.dimensionScores[i].reviewScore;
    });
    const loadingKey = record.singleFillId + '_save';
    setLoading(loadingKey, true);
    await saveReviewDetails(record).finally(() => {
      setLoading(loadingKey, false);
    });
    if (!noRefresh) {
      refreshListReviewDetailsExpert();
    }
  };

  const submitReview = async (i: number, noRefresh?: boolean) => {
    await saveReview(i, noRefresh);
    const record = listReviewDetailsExpertData?.data[i]!;
    const loadingKey = record.singleFillId + '_submit';
    setLoading(loadingKey, true);
    await expertSubmit({ singleFillId: record.singleFillId }).finally(() => {
      setLoading(loadingKey, false);
    });
    if (!noRefresh) {
      refreshListReviewDetailsExpert();
    }
  };

  const saveCurrentPage = async () => {
    setLoading('saveCurrentPage', true);
    try {
      for (
        let i = 0;
        i < (listReviewDetailsExpertData?.data || []).length;
        i++
      ) {
        await saveReview(i, true);
      }
      refreshListReviewDetailsExpert();
    } finally {
      setLoading('saveCurrentPage', false);
    }
  };

  const submitCurrentPage = async () => {
    setLoading('submitCurrentPage', true);
    try {
      for (
        let i = 0;
        i < (listReviewDetailsExpertData?.data || []).length;
        i++
      ) {
        await submitReview(i, true);
      }
      refreshListReviewDetailsExpert();
    } finally {
      setLoading('submitCurrentPage', false);
    }
  };

  const changeFormValue = (
    singleFillId: number,
    value: any,
    dimensionId?: number
  ) => {
    console.log('===============', singleFillId, value, dimensionId);

    const oldItem = formValues.find(
      (item: any) => item.singleFillId === singleFillId
    );

    if (oldItem) {
      if (dimensionId) {
        let isExist = false;
        if (oldItem.dimensionScores === undefined) {
          oldItem.dimensionScores = [];
        }
        oldItem.dimensionScores = oldItem.dimensionScores.map((item: any) => {
          if (item.dimensionId === dimensionId) {
            isExist = true;
            return {
              ...item,
              reviewScore: value,
            };
          }
          return item;
        });
        if (!isExist) {
          oldItem.dimensionScores.push({
            dimensionId,
            reviewScore: value,
          });
        }
      } else {
        oldItem.expertComment = value;
      }
    } else {
      const item: any = { singleFillId: singleFillId, dimensionScores: [] };
      if (dimensionId) {
        item.dimensionScores = [
          {
            dimensionId,
            reviewScore: value,
          },
        ];
      } else {
        item.expertComment = value;
      }
      formValues.push(item);
    }

    console.log('formValues', formValues);

    setFormValues(formValues);
  };

  // console.log('formValues', formValues);

  const columns: any = [
    {
      title: '单位',
      dataIndex: 'fillerOrgName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.showFiller ? record.fillerOrgName : '-'}</div>;
      },
    },
    {
      title: <div>姓名</div>,
      dataIndex: 'fillerStaffName',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.showFiller ? record.fillerStaffName : '-'}</div>;
      },
    },
    {
      title: <div>试卷编号</div>,
      dataIndex: 'fillIndex',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>{record.showFiller ? record.fillIndex : '-'}</div>;
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
            taskId={task.taskId}
            singleFillId={record.singleFillId}
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
              // @ts-expect-error: fillTaskStatus might not be in TaskStatusObject
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
      render: (
        text: any,
        record: ListReviewDetailsExpertResponse,
        index: number
      ) => {
        return (
          <div>
            {text?.map((item: any, i: number) => {
              return (
                <div key={i}>
                  <Form.Item
                    name={[index, 'dimensionScores', i, 'reviewScore']}
                    required
                  >
                    <InputNumber min={0} max={100} />
                  </Form.Item>
                  {i + 1 !== text.length && <Divider className="my-4" />}
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
      render: (
        text: string,
        record: ListReviewDetailsExpertResponse,
        index: number
      ) => {
        return (
          <Form.Item
            required
            name={[index, 'expertComment']}
            initialValue={text}
          >
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
        );
      },
    },

    {
      title: <div>操作</div>,
      width: '10%',
      dataIndex: 'operation',
      fixed: 'right',
      align: 'center',
      render: (_: any, record: any, index: number) => {
        return (
          <>
            {(record.processStatus === ProcessStatusTypeEnum.NotFill ||
              record.processStatus === ProcessStatusTypeEnum.NotSubmit ||
              record.processStatus === ProcessStatusTypeEnum.Reject) && (
              <Space>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    saveReview(index);
                  }}
                >
                  {loading[record.singleFillId + '_save'] ? (
                    <LoadingOutlined />
                  ) : (
                    '保存'
                  )}
                </a>
                <a
                  className="text-blue-500"
                  onClick={() => {
                    submitReview(index);
                  }}
                >
                  {loading[record.singleFillId + '_submit'] ? (
                    <LoadingOutlined />
                  ) : (
                    '提交'
                  )}
                </a>
              </Space>
            )}
            {(record.processStatus ===
              ProcessStatusTypeEnum.WaitSubmitExpertData ||
              record.processStatus ===
                ProcessStatusTypeEnum.WaitAuditExpertData ||
              record.processStatus === ProcessStatusTypeEnum.Submitted ||
              record.processStatus === ProcessStatusTypeEnum.Passed ||
              record.processStatus === ProcessStatusTypeEnum.PassedExpertData ||
              record.processStatus === ProcessStatusTypeEnum.RejectExpertData ||
              record.processStatus === ProcessStatusTypeEnum.DataDiscard) &&
              '-'}
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
        onCancel={() => {
          form.resetFields();
          setFormValues([]);
          setOpen(false);
        }}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-5 px-20">
            <Button
              size="large"
              loading={loading.saveCurrentPage}
              onClick={() => saveCurrentPage()}
            >
              保存本页
            </Button>
            <Button
              size="large"
              type="primary"
              loading={loading.submitCurrentPage}
              onClick={() => submitCurrentPage()}
            >
              提交本页
            </Button>
          </div>
        }
      >
        <Form form={form} component={false}>
          <Table
            columns={columns}
            dataSource={listReviewDetailsExpertData?.data || []}
            loading={getListReviewDetailsExpertLoading}
            pagination={{
              total: listReviewDetailsExpertData?.total,
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
          />
        </Form>
      </Modal>
    </>
  );
};

export default TaskReviewDetailModal;
