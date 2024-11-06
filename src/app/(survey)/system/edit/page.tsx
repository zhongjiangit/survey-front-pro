'use client';

import Breadcrumbs from '@/components/common/breadcrumbs';
import SystemForm from '../modules/system-form';
import NotFound from './not-found';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Api from '@/api';
import { useRequest } from 'ahooks';

export default function Page() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const user = useSurveyUserStore(state => state.user);

  // 使用ahooks的useRequest
  const { data: systemList } = useRequest(() => {
    return Api.getSystemListAll({
      currentSystemId: user?.systems[0].systemId,
    });
  });

  const dataSources = useMemo(() => {
    if ((systemList?.data ?? []).length > 0) {
      const dataList = systemList?.data;
      const dataSources = (dataList ?? []).filter(
        ({ id }: { id: number }) => id === Number(selectedId)
      );
      return dataSources;
    }
    return [];
  }, [systemList?.data, selectedId]);

  if (dataSources.length === 0) {
    return <NotFound />;
  }

  console.log('dataSources', dataSources);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统', href: '/system' },
          {
            label: '编辑系统',
            href: `/system/edit?id=${selectedId}`,
            active: true,
          },
        ]}
      />
      <SystemForm initialValues={dataSources[0]} />
    </main>
  );
}
