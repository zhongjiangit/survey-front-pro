'use client';
import MemberManage from '@/components/common/member-manage';
import { lusitana } from '@/components/display/fonts';

function Page() {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start">
        <h1 className={`${lusitana.className} text-2xl`}>成员管理</h1>
      </div>
      <MemberManage />
    </main>
  );
}

export default Page;
