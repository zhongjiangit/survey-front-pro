import Api from '@/api';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { joinRowSpanData } from '@/lib/join-rowspan-data';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Modal, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

interface ProfessorDetailProps {
  buttonText: string;

  [key: string]: any;
}

const loginUserType: 'org' | 'professor' = 'org';
const ProfessorResult: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
  task,
}) => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<any>();
  const joinRowSpanKey = ['fillerAverageScore', 'fillIndex', 'averageScore'];

  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const {
    run: getReviewResultStaff,
    loading: getReviewResultStaffLoading,
    data: reviewResultStaffData,
  } = useRequest(
    () => {
      if (!currentSystem || !currentOrg || !record) {
        return Promise.reject(
          'currentSystem or currentOrg or record is not defined'
        );
      }

      return Api.getReviewResultStaff({
        currentSystemId: currentSystem.systemId,
        currentOrgId: currentOrg.orgId,
        taskId: task.taskId,
        fillerStaffId: record.fillerStaffId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        const professorResultData: any[] = [];
        data.data?.singleFills?.forEach(item => {
          const resultItem: any = {
            ...item,
            fillerAverageScore: data?.data?.fillerAverageScore,
          };
          professorResultData.push(
            ...(resultItem.dimensionScores.map((scoreItem: any) => {
              return { ...scoreItem, ...resultItem };
            }) || [])
          );
        });
        const finalresult = joinRowSpanKey.reduce(
          (prev: any[] | undefined, currentKey: string) => {
            return joinRowSpanData(prev, currentKey);
          },
          professorResultData
        );
        setDataSource(finalresult);
      },
    }
  );

  const columns: TableProps['columns'] = [
    {
      title: '个人平均分',
      dataIndex: 'fillerAverageScore',
      align: 'center',
      onCell: record => {
        return {
          rowSpan: record?.rowSpan?.fillerAverageScore || 0,
        };
      },
    },
    {
      title: '试卷序列',
      dataIndex: 'fillIndex',
      align: 'center',
      render: (text: number, record) =>
        text && (
          <div className="flex justify-center">
            <a>
              <TemplateDetailModal
                templateId={task.templateId}
                taskId={task.taskId}
                singleFillId={record.singleFillId}
                TemplateType={TemplateTypeEnum.Check}
                title="试卷详情"
                showDom={<Circle value={text} />}
              />
            </a>
          </div>
        ),
      onCell: record => ({
        rowSpan: record?.rowSpan?.fillIndex || 0,
      }),
    },
    {
      title: '试卷得分',
      dataIndex: 'averageScore',
      align: 'center',
      render: text => text && <span>{`${text}分`}</span>,
      onCell: record => ({
        rowSpan: record?.rowSpan?.averageScore || 0,
      }),
    },
    {
      title: '指标',
      align: 'center',
      dataIndex: 'dimensionName',
    },
    {
      title: '小项均分',
      align: 'center',
      dataIndex: 'reviewAverageScore',
      render: text => text && <span>{`${text}分`}</span>,
    },
    {
      title: '评价',
      align: 'center',
      dataIndex: 'itemRate',
      hidden: loginUserType === 'org',
      render: text =>
        text && (
          <div>
            {text.map((item: any, index: number) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        ),
    },
  ];

  useEffect(() => {
    if (open) {
      getReviewResultStaff();
    }
  }, [getReviewResultStaff, open]);

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
        title={
          <div className="mx-5 m-2">{record.fillerStaffName}的评审结果</div>
        }
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        width={1200}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          style={{ margin: '20px' }}
          pagination={false}
        ></Table>
      </Modal>
    </>
  );
};

export default ProfessorResult;
