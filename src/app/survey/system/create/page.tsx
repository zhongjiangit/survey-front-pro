import { fetchCustomers } from '@/lib/data';
import SystemForm from '../modules/system-form';
import Breadcrumbs from '@/components/common/breadcrumbs';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '创建系统',
            href: '/survey/system/create',
            active: true,
          },
        ]}
      />
      <SystemForm />
    </main>
  );
}