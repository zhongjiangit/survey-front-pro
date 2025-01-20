import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useRequest } from 'ahooks';
import { Divider, Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

interface ProfessorDetailProps {
  buttonText: string;
  modalTitle: string;
  [key: string]: any;
}

const OrgResult: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  value,
  record,
  modalTitle,
}) => {
  const [open, setOpen] = useState(false);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const {
    run: getReviewResultOrg,
    loading: getReviewResultOrgLoading,
    data: reviewResultOrgData,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg || !value || !record.task.taskId) {
        return Promise.reject(
          'currentSystem or currentOrg or value is not defined'
        );
      }
      return Api.getReviewResultOrg({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: record.task.taskId,
        orgId: value.orgId,
      });
    },
    {
      manual: true,
    }
  );

  const columns: TableProps['columns'] = [
    {
      title: '单位平均分',
      dataIndex: 'averageScore',
      align: 'center',

      render: text => text && <span>{`${text}分`}</span>,
    },
    {
      title: '准测',
      dataIndex: 'dimensionScores',
      align: 'center',
      render: text => (
        <div>
          {text?.map((item: any, i: number) => {
            return (
              <div key={i}>
                <span>{item.guideline}</span>
                {i + 1 !== text.length && <Divider className="my-4" />}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: '小项均分',
      align: 'center',
      dataIndex: 'dimensionScores',
      render: text => (
        <div>
          {text?.map((item: any, i: number) => {
            return (
              <div key={i}>
                <span>{`${item.reviewAverageScore}分`}</span>
                {i + 1 !== text.length && <Divider className="my-4" />}
              </div>
            );
          })}
        </div>
      ),
    },
    {
      title: '指标',
      align: 'center',
      dataIndex: 'dimensionScores',
      render: text => (
        <div>
          {text?.map((item: any, i: number) => {
            return (
              <div key={i}>
                <span>{item.dimensionName}</span>
                {i + 1 !== text.length && <Divider className="my-4" />}
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (open) {
      getReviewResultOrg();
    }
  }, [getReviewResultOrg, open]);

  return (
    <>
      <a
        onClick={() => {
          setOpen(true);
        }}
        className="text-blue-500"
      >
        {buttonText}
      </a>
      <Modal
        title={<div className="mx-5 m-2">{modalTitle}</div>}
        open={open}
        footer={null}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        width={1200}
      >
        <Table
          columns={columns}
          dataSource={
            reviewResultOrgData?.data ? [reviewResultOrgData?.data] : []
          }
          size="small"
          style={{ margin: '20px' }}
          loading={getReviewResultOrgLoading}
          pagination={false}
        ></Table>
      </Modal>
    </>
  );
};

export default OrgResult;
