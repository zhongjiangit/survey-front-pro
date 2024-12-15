'use client';

import TemplateDetail from '@/app/modules/template-detail';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useLocalStorageState } from 'ahooks';

interface FillCollectProps {
  singleFillId?: number;
}

const FillCollect = ({ singleFillId }: FillCollectProps) => {
  const [currentFillTask] = useLocalStorageState<any>('current-fill-task', {
    defaultValue: {},
  });
  return (
    <div className="fillCollect flex gap-5 justify-between">
      <div className="fillCollect-left flex flex-col justify-center items-center gap-5">
        <h2 className="text-lg font-bold">{currentFillTask.taskName}</h2>
        <TemplateDetail
          templateType={TemplateTypeEnum.Check}
          templateId={currentFillTask.templateId}
          taskId={currentFillTask.taskId}
          singleFillId={singleFillId}
        />
      </div>
      <div className="w-60 px-5 flex flex-col justify-start gap-5">
        <h1 className="text-xl font-bold">任务说明</h1>
        <p>{currentFillTask?.description}</p>
      </div>
    </div>
  );
};

export default FillCollect;
