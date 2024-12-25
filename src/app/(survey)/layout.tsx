'use client';
import Header from '@/components/common/header';
import SideNav from '@/components/common/side-nav/sidenav';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [currentSystem] = useSurveySystemStore(state => [state.currentSystem]);
  const [currentOrg] = useSurveyOrgStore(state => [state.currentOrg]);
  const [currentRole] = useSurveyCurrentRoleStore(state => [state.currentRole]);

  return (
    <div className="p-2 h-screen">
      <div className="flex h-16 md:h-20 shrink-0 items-end rounded-lg bg-sky-100 dark:bg-sky-900 p-4">
        <Header isThemeShow={false} />
      </div>
      <div className="flex flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-52">
          <SideNav />
        </div>
        <div
          key={[
            currentSystem?.systemId,
            currentOrg?.orgId,
            currentRole?.key,
          ].join(',')}
          className="min-h-[88vh] flex-grow p-6 md:overflow-y-auto md:m-4 rounded-lg"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
