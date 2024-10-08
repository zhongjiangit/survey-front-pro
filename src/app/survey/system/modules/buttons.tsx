import { deleteInvoice } from '@/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, Popconfirm, Tooltip } from 'antd';
import { Bolt } from 'lucide-react';
import Link from 'next/link';

export function CreateSystem() {
  return (
    <Link
      href="/survey/system/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">创建系统</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSystem({ id }: { id: string }) {
  return (
    <Link
      href={`/survey/system/edit?id=${id}`}
      className="rounded-md border p-1 h-7 w-7 hover:bg-gray-100"
    >
      <Tooltip title="系统基本信息修改">
        <PencilIcon className="w-4 h-4" />
      </Tooltip>
    </Link>
  );
}

export function DeleteSystem({ id }: { id: string }) {
  const deleteSystemWithId = deleteInvoice.bind(null, id);
  return (
    <Popconfirm
      title="删除系统"
      description="删除后将不可恢复，您确定要删除此系统吗？"
      // onConfirm={confirm}
    >
      <Button
        danger
        className="rounded-md border p-1 h-7 w-7 hover:bg-gray-100 hover:text-blue-300 duration-300"
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </Popconfirm>
  );
}

export function ConfigSystem({ id }: { id: string }) {
  return (
    <Link
      href={`/survey/system/config?id=${id}`}
      className="rounded-md border p-1 h-7 w-7 hover:bg-gray-100"
    >
      <Tooltip title="系统配置">
        <Bolt className="w-4 h-4" />
      </Tooltip>
    </Link>
  );
}
