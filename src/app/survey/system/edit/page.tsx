'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import SystemForm from '../modules/system-form';
import NotFound from './not-found';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import useSystemListAllSWR from '@/data/system/useSystemListAllSWR';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');

  const user = useSurveyUserStore(state => state.user);
  const { data: list } = useSystemListAllSWR({
    currentSystemId: user?.systems[0].systemId,
  });

  const dataSources = useMemo(() => {
    if ((list?.data.data ?? []).length > 0) {
      const dataList = list?.data.data;
      const dataSources = (dataList ?? []).filter(
        ({ id }: { id: number }) => id === Number(selectedId)
      );
      return dataSources;
    }
    return [];
  }, [list?.data.data, selectedId]);

  if (dataSources.length === 0) {
    return <NotFound />;
  }

  console.log('dataSources', dataSources);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '编辑系统',
            href: `/survey/system/edit?id=${selectedId}`,
            active: true,
          },
        ]}
      />
      <SystemForm initialValues={dataSources[0]} />
    </main>
  );
}
