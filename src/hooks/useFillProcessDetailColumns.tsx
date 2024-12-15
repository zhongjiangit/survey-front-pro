'use client';

import { GetFillProcessDetailsResponse } from '@/api/task/getFillProcessDetails';
import {
  TaskProcessStatusObject,
  TaskProcessStatusType,
} from '@/types/CommonType';
import { TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';

const baseColumns: TableColumnsType = [
  {
    title: '人员',
    dataIndex: 'member',
    key: 'member',
    align: 'center',
    // width: '30%',
    render: (_, record) => {
      console.log(record, 'record');

      return (
        <>
          {record.cellphone
            ? `${record.staffName}(${record.cellphone})资料提交：${record.fillCount}份`
            : '-'}
        </>
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'processStatus',
    align: 'center',
    render: value => {
      return (
        <div>
          {TaskProcessStatusObject[value as TaskProcessStatusType] || value}
        </div>
      );
    },
  },
];
export function useFillProcessDetailColumns(
  originData: GetFillProcessDetailsResponse[] | undefined | []
) {
  const [data, setData] = useState<
    GetFillProcessDetailsResponse[] | undefined | []
  >(originData);
  const [finalColumns, setFinalColumns] = useState(baseColumns);

  useEffect(() => {
    if (!data || data.length === 0 || !data[0]?.levels) {
      return;
    }

    const tempColumn = Object.keys(data[0].levels).map((key, index) => {
      const levelName = data[0].levels?.[key].levelName;
      return {
        title: levelName,
        dataIndex: `org${index + 1}`,
        render: (value: any) => {
          return <>{value?.orgName}</>;
        },
      };
    });

    setFinalColumns([...tempColumn, ...finalColumns]);
    return () => {
      setFinalColumns(baseColumns);
    };
  }, [data]);

  return { columns: finalColumns, setColumns: setData };
}
