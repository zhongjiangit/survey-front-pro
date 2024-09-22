import Breadcrumbs from '@/components/common/breadcrumbs';
import { fetchInvoiceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import SystemForm from '../.././modules/system-form';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [invoice] = await Promise.all([fetchInvoiceById(id)]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: '系统', href: '/survey/system' },
          {
            label: '编辑系统',
            href: `/survey/system/${id}/edit`,
            active: true,
          },
        ]}
      />
      <SystemForm initialValues={{ id: '1122', systemName: '1112345' }} />
    </main>
  );
}
