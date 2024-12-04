import { cn } from '@/lib/utils';
import { ZeroOrOneTypeEnum } from '@/types/CommonType';
import { SystemType } from '@/types/SystemType';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Popconfirm, Tooltip } from 'antd';
import { Bolt, MonitorPause, TvMinimalPlay } from 'lucide-react';
import Link from 'next/link';

export function CreateSystem() {
  return (
    <Link
      href="/system/create"
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
      href={`/system/edit?id=${id}`}
      className="rounded-md border p-1 h-7 w-7 hover:bg-gray-100"
    >
      <Tooltip title="系统基本信息修改">
        <PencilIcon className="w-4 h-4" />
      </Tooltip>
    </Link>
  );
}

export function DeleteSystem({
  record,
  deleteSystem,
}: {
  record: SystemType;
  deleteSystem: (params: { id: string }) => void;
}) {
  const { id } = record;
  // <MonitorPause />
  // <TvMinimalPlay />
  return (
    <Popconfirm
      title={
        record.systemStatus === ZeroOrOneTypeEnum.Zero ? '启用系统' : '停用系统'
      }
      description={
        record.systemStatus === ZeroOrOneTypeEnum.Zero
          ? '您确定要启用此系统吗？'
          : '您确定要停用此系统吗？'
      }
      onConfirm={() => {
        if (record.systemStatus === ZeroOrOneTypeEnum.Zero) {
          // restart system
          // TODO: implement restart system
        } else {
          deleteSystem({ id });
        }
      }}
    >
      <div
        className={cn(
          ' cursor-pointer rounded-md border p-1 h-7 w-7 hover:bg-gray-100 hover:text-blue-300 duration-300',
          'flex items-center justify-center duration-300 pl-1.5',
          {
            'text-red-500 hover:text-red-700':
              record.systemStatus === ZeroOrOneTypeEnum.One,
            'text-green-500 hover:text-green-700':
              record.systemStatus === ZeroOrOneTypeEnum.Zero,
          }
        )}
      >
        {record.systemStatus === ZeroOrOneTypeEnum.Zero ? (
          <TvMinimalPlay className="w-4 h-4" />
        ) : (
          <MonitorPause className="w-4 h-4" />
        )}
      </div>
    </Popconfirm>
  );
}

export function ConfigSystem({ id }: { id: string }) {
  return (
    <Link
      href={`/system/config?id=${id}`}
      className="rounded-md border p-1 h-7 w-7 hover:bg-gray-100"
    >
      <Tooltip title="系统配置">
        <Bolt className="w-4 h-4" />
      </Tooltip>
    </Link>
  );
}
