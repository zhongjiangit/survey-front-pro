import ExpertManage from '@/components/common/expert-manage';
import { lusitana } from '@/components/display/fonts';

function Page() {
  return (
    <main className="flex flex-col gap-5">
      <div className="flex w-full items-center justify-start">
        <h1 className={`${lusitana.className} text-2xl`}>专家管理</h1>
      </div>
      <ExpertManage />
    </main>
  );
}

export default Page;
