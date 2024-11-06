import SystemForm from '../modules/system-form';
import Breadcrumbs from '@/components/common/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统', href: '/system' },
          {
            label: '创建系统',
            href: '/system/create',
            active: true,
          },
        ]}
      />
      <SystemForm />
    </main>
  );
}
