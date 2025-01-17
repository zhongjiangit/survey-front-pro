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
  message,
  Modal,
  Space,
  Table,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import StandardDetailModal from '../../modules/standard-detail-modal';

interface TaskReviewDetailModalProps {
  task: any;
  refreshList?: () => void;
}

const TaskReviewDetailModal = ({
  task,
  refreshList,
}: TaskReviewDetailModalProps) => {
  const [messageApi, contextHolder] = message.useMessage();
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
      if (!open) {
        return Promise.reject('未打开');
      }
      return Api.listReviewDetailsExpert({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg!.orgId!,
        taskId: task.taskId,
        pageNumber,
        pageSize,
      });
    },
    {
      refreshDeps: [pageSize, pageNumber, open],
      onSuccess: data => {
        form.resetFields();
        form.setFieldsValue(data.data);
      },
    }
  );
  const { data: templateDetail, run: getTemplateDetails } = useRequest(
    (tempId: number) => {
      return Api.getTemplateDetails({
        currentSystemId: currentSystem?.systemId!,
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
      });
    },
    { manual: true }
  );
  useEffect(() => {
    const tempId = listReviewDetailsExpertData?.data[0]?.templateId;
    if (open && !templateDetail && tempId) {
      getTemplateDetails(tempId);
    }
  }, [listReviewDetailsExpertData, templateDetail, open]);

  const recordStatus = useMemo(() => {
    return (listReviewDetailsExpertData?.data || []).reduce<{
      [key: number]: { unedit: boolean; edit: boolean };
    }>((res, record) => {
      res[record.singleFillId] = {
        unedit:
          record.processStatus === ProcessStatusTypeEnum.WaitSubmitExpertData ||
          record.processStatus === ProcessStatusTypeEnum.WaitAuditExpertData ||
          record.processStatus === ProcessStatusTypeEnum.Submitted ||
          record.processStatus === ProcessStatusTypeEnum.Passed ||
          record.processStatus === ProcessStatusTypeEnum.PassedExpertData ||
          record.processStatus === ProcessStatusTypeEnum.DataDiscard,
        edit:
          record.processStatus === ProcessStatusTypeEnum.NotFill ||
          record.processStatus === ProcessStatusTypeEnum.NotSubmit ||
          record.processStatus === ProcessStatusTypeEnum.RejectExpertData ||
          record.processStatus === ProcessStatusTypeEnum.Reject,
      };
      return res;
    }, {});
  }, [listReviewDetailsExpertData]);

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
        //
      },
    }
  );

  const [dimensions, sumScore] = useMemo(() => {
    const dimensions = templateDetail?.data?.dimensions || [];
    const sumScore = dimensions.reduce((a, b) => a + b.score, 0);
    return [dimensions, sumScore];
  }, [templateDetail]);

  const getRecordValues = (idx: number) => {
    const data = form.getFieldsValue();
    const record = listReviewDetailsExpertData?.data[idx]!;
    const values = data[idx];
    const reviewScoreList = record.dimensionScores.map(
      (t, i) => values.dimensionScores[i].reviewScore
    );
    return [values.expertComment, reviewScoreList];
  };

  const validateRecord = (idx: number, showError?: boolean) => {
    const [expertComment, reviewScoreList] = getRecordValues(idx);
    let errorMsg = '';
    if (!reviewScoreList.some((t: any) => ![null, undefined].includes(t))) {
      errorMsg = '请将维度评分填写完整';
    }
    if (!expertComment?.trim()) {
      errorMsg = '请输入点评内容';
    }
    if (showError) {
      messageApi.info(errorMsg);
    }
    return errorMsg;
  };

  const saveReview = async (idx: number, noRefresh?: boolean) => {
    if (!noRefresh && validateRecord(idx, true)) {
      throw new Error('信息不完整');
    }
    const record = listReviewDetailsExpertData?.data[idx]!;
    const [expertComment, reviewScoreList] = getRecordValues(idx);
    record.expertComment = expertComment;
    record.dimensionScores.forEach((t, i) => {
      t.reviewScore = reviewScoreList[i];
    });
    const loadingKey = record.singleFillId + '_save';
    setLoading(loadingKey, true);
    await saveReviewDetails(record).finally(() => {
      setLoading(loadingKey, false);
    });
    if (!noRefresh) {
      refreshListReviewDetailsExpert();
      messageApi.success('保存成功!');
    }
  };

  const submitReview = async (i: number, noRefresh?: boolean) => {
    if (!noRefresh && validateRecord(i, true)) {
      throw new Error('信息不完整');
    }
    await saveReview(i, true);
    const record = listReviewDetailsExpertData?.data[i]!;
    const loadingKey = record.singleFillId + '_submit';
    setLoading(loadingKey, true);
    await expertSubmit({ singleFillId: record.singleFillId }).finally(() => {
      setLoading(loadingKey, false);
    });
    if (!noRefresh) {
      refreshListReviewDetailsExpert();
      refreshList?.();
      messageApi.success('提交成功!');
    }
  };

  const validateCurrentPage = () => {
    const list = listReviewDetailsExpertData?.data || [];
    for (let i = 0; i < list.length; i++) {
      if (recordStatus[list[i].singleFillId].edit) {
        const validateRes = validateRecord(i);
        if (validateRes) {
          messageApi.info('请将所有数据的维度评分与点评内容填写完整!');
          return validateRes;
        }
      }
    }
  };

  const saveCurrentPage = async () => {
    if (validateCurrentPage()) {
      return;
    }
    const list = listReviewDetailsExpertData?.data || [];
    setLoading('saveCurrentPage', true);
    try {
      for (let i = 0; i < list.length; i++) {
        if (recordStatus[list[i].singleFillId].edit) {
          await saveReview(i, true);
        }
      }
      refreshListReviewDetailsExpert();
      messageApi.success('本页保存成功!');
    } finally {
      setLoading('saveCurrentPage', false);
    }
  };

  const submitCurrentPage = async () => {
    if (validateCurrentPage()) {
      return;
    }
    setLoading('submitCurrentPage', true);
    const list = listReviewDetailsExpertData?.data || [];
    try {
      for (let i = 0; i < list.length; i++) {
        await submitReview(i, true);
      }
      refreshListReviewDetailsExpert();
      refreshList?.();
      messageApi.success('本页提交成功!');
    } finally {
      setLoading('submitCurrentPage', false);
    }
  };

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
      title: <div>评分（满分：{sumScore}）</div>,
      dataIndex: 'totalScore',
      align: 'center',
    },
    {
      title: (
        <div className="flex gap-1 items-center justify-center">
          <span>评价维度</span>
          <StandardDetailModal
            dimensions={dimensions}
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
      title: (
        <div>
          <span style={{ color: '#ff4d4f' }}>*</span> 维度评分
        </div>
      ),
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
                    noStyle
                  >
                    <InputNumber
                      min={0}
                      max={dimensions[i]?.score}
                      placeholder="请输入"
                      title={`最高分值: ${dimensions[i]?.score}`}
                      disabled={recordStatus[record.singleFillId]?.unedit}
                    />
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
      title: (
        <div>
          <span style={{ color: '#ff4d4f' }}>*</span> 专家点评
        </div>
      ),
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
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 10 }}
              disabled={recordStatus[record.singleFillId]?.unedit}
            />
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
            {recordStatus[record.singleFillId]?.edit && (
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
            {recordStatus[record.singleFillId]?.unedit && '-'}
          </>
        );
      },
    },
  ];
  const batchBtnDisabled = Object.values(recordStatus).every(
    item => item.unedit
  );
  useEffect(() => {
    return () => {
      setPageNumber(1);
      setPageSize(10);
    };
  }, []);
  return (
    <>
      {contextHolder}
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        评审详情
      </a>
      <Modal
        style={{ top: '16px', paddingBottom: '0px' }}
        open={open}
        title="专家评审"
        width={'100vw'}
        onCancel={() => {
          form.resetFields();
          setFormValues([]);
          setOpen(false);
        }}
        destroyOnClose
        maskClosable={false}
        footer={
          <div className="flex justify-end gap-5 px-20">
            <Button
              size="large"
              disabled={batchBtnDisabled}
              loading={loading.saveCurrentPage}
              onClick={() => saveCurrentPage()}
            >
              保存本页
            </Button>
            <Button
              size="large"
              disabled={batchBtnDisabled}
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
            scroll={{
              y: window.innerHeight - 16 - 16 - 40 - 32 - 52 - 80 - 34,
            }}
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
