import { lusitana } from '@/components/display/fonts';
import { Metadata } from 'next';
import { CreateSystem } from './modules/buttons';
import Search from './modules/search';
import SystemsTableList from './modules/system-table-list';

export const metadata: Metadata = {
  title: '系统管理',
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-start">
        <h1 className={`${lusitana.className} text-2xl`}>系统管理</h1>
      </div>
      <div className="flex flex-col gap-5">
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="搜索系统..." />
          <CreateSystem />
        </div>
        <SystemsTableList query={query} />
      </div>
    </div>
  );
}
