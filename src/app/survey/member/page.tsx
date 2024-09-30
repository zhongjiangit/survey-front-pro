'use client';
import MemberManage from '@/components/common/member-manage';
import { lusitana } from '@/components/display/fonts';

function Page() {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start">
        <h1 className={`${lusitana.className} text-2xl`}>成员管理</h1>
      </div>
      <h2 className="flex items-center">
        * 你是xxx的管理员，你可以维护该单位人员。其他单位的人员只可查看
      </h2>
      <MemberManage />
    </main>
  );
}

export default Page;
