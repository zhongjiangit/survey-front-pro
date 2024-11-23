'use client';

import Api from '@/api';
import Breadcrumbs from '@/components/common/breadcrumbs';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { useRequest } from 'ahooks';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import SystemForm from '../modules/system-form';
import NotFound from './not-found';

export default function Page() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const user = useSurveyUserStore(state => state.user);

  // 使用ahooks的useRequest
  const { data: systemList, loading: getSystemListLoading } = useRequest(() => {
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

  if (dataSources.length === 0 && !getSystemListLoading) {
    return <NotFound />;
  }

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
