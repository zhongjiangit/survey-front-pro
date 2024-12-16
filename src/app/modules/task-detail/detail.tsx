'use client';

import TemplateFillDetail from '@/app/modules/template-fill-detail';
import { DetailShowType, TemplateTypeEnum } from '@/types/CommonType';
import { taskType } from '.';

interface FillCollectProps {
  task: taskType;
  singleFillId?: number;
  showType?: DetailShowType;
}

const FillCollect = ({ singleFillId, task, showType }: FillCollectProps) => {
  const { taskId, taskName, templateId, description } = task;
  return (
    <div className="fillCollect flex gap-5 justify-between">
      <div className="fillCollect-left flex flex-col justify-center items-center gap-5">
        <h2 className="text-lg font-bold">{taskName}</h2>
        <TemplateFillDetail
          templateType={TemplateTypeEnum.Check}
          templateId={templateId}
          taskId={taskId}
          singleFillId={singleFillId}
          showType={showType}
        />
      </div>
      <div className="w-60 px-5 flex flex-col justify-start gap-5">
        <h1 className="text-xl font-bold">任务说明</h1>
        <p>{description || ''}</p>
      </div>
    </div>
  );
};

export default FillCollect;
