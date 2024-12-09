'use client';

import TemplateDetail from '@/app/modules/template-detail';

interface FillCollectProps {}

const FillCollect = (props: FillCollectProps) => {
  return (
    <div className="flex gap-5 justify-between">
      <div className="flex flex-col justify-center items-center gap-5">
        <h2 className="text-lg font-bold">小学教学计划资料收集1</h2>
        <TemplateDetail />
      </div>

      <div className="w-60 px-5 flex flex-col justify-center gap-5">
        <h1 className="text-xl font-bold">任务说明</h1>
        <p>这里是填报任务页面，包括填报任务的详情，填报任务的状态等</p>
      </div>
    </div>
  );
};

export default FillCollect;
