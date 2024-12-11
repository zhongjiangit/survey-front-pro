'use client';

import Api from '@/api';
import TemplateDetail from '@/app/modules/template-detail';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { TemplateTypeEnum } from '@/types/CommonType';
import { useLocalStorageState, useRequest } from 'ahooks';

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
      <div className="w-60 px-5 flex flex-col justify-center gap-5">
        <h1 className="text-xl font-bold">任务说明</h1>
        <p>这里是填报任务页面，包括填报任务的详情，填报任务的状态等</p>
      </div>
    </div>
  );
};

export default FillCollect;
