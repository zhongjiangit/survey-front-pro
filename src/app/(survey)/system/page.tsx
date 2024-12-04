'use client';

import { lusitana } from '@/components/display/fonts';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { Role_Enum } from '@/types/CommonType';
import { CreateSystem } from './modules/buttons';
import Search from './modules/search';
import SystemsTableList from './modules/system-table-list';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const isPlatformAdmin = currentRole?.key === Role_Enum.PLATFORM_ADMIN;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-start">
        <h1 className={`${lusitana.className} text-2xl`}>系统管理</h1>
      </div>
      <div className="flex flex-col gap-5">
        {isPlatformAdmin && (
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="搜索系统名称..." />
            <CreateSystem />
          </div>
        )}
        <SystemsTableList query={query} />
      </div>
    </div>
  );
}
