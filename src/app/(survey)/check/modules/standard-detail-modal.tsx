import Api from '@/api';
import { DimensionsType } from '@/api/template/create-details';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useRequest } from 'ahooks';
import { Modal, Table } from 'antd';
import { ReactNode, useEffect, useMemo, useState } from 'react';

interface Props {
  showDom?: ReactNode;
  dimensions?: DimensionsType[];
  templateId?: number;
}

const StandardDetailModal = ({
  showDom,
  dimensions = [],
  templateId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [sourceData, setSourceData] = useState([]);

  const currentSystem = useSurveySystemStore(state => state.currentSystem);

  const { run: getTemplateDetails } = useRequest(
    (tempId: number) => {
      return Api.getTemplateDetails({
        currentSystemId: currentSystem?.systemId!,
        templateType: TemplateTypeEnum.Collect,
        templateId: Number(tempId),
      });
    },
    {
      manual: true,
      onSuccess: (data: any) => {
        setSourceData(data?.data?.dimensions || []);
      },
    }
  );

  useEffect(() => {
    if (templateId) {
      getTemplateDetails(templateId);
    }
  }, [getTemplateDetails, templateId]);

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns: any[] = useMemo(
    () => [
      {
        title: '序号',
        width: '15%',
        render: (text: any, record: any, index: number) => `${index + 1}`,
        editable: false,
      },
      {
        title: '指标',
        dataIndex: 'dimensionName',
        width: '20%',
      },
      {
        title: '最高分值',
        dataIndex: 'score',
        width: '20%',
      },
      {
        title: '准则',
        dataIndex: 'guideline',
        width: '30%',
      },
    ],
    []
  );

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        {showDom || <span>详情</span>}
      </a>
      <Modal
        title="标准详情"
        open={open}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table
          columns={columns}
          dataSource={templateId ? sourceData : dimensions}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default StandardDetailModal;
