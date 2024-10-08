'use client';
import MemberManage from '@/components/common/member-manage';
import { lusitana } from '@/components/display/fonts';
import OrgTree from './modules/org-tree';
import { useState } from 'react';

function Page() {
  const [org, setOrg] = useState<React.Key>();
  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start gap-2">
        <h1 className={`${lusitana.className} text-2xl`}>单位成员管理</h1>
        <OrgTree setOrg={setOrg} />
      </div>
      <h2 className="flex items-center">
        * 你是xxx的管理员，你可以维护该单位人员。其他单位的人员只可查看
      </h2>
      <MemberManage />
    </main>
  );
}

export default Page;
