'use client';

import { GetFillPassCountDetailsResponse } from '@/api/task/getFillPassCountDetails';
import { LEVEL_LABEL } from '@/types/CommonType';
import { useEffect, useState } from 'react';

const emptyColumns = [
  {
    title: '',
    dataIndex: 'empty',
  },
];
export function useFillPassCountDetailsColumn(
  originData: GetFillPassCountDetailsResponse[] | undefined | []
) {
  const [data, setData] = useState<
    GetFillPassCountDetailsResponse[] | undefined | []
  >(originData);
  const [finalColumns, setFinalColumns] = useState<any[]>([]);
  const levelCount = data?.[0]?.orgCount || 0;
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    const tempColumn: any[] = [];
    for (let i = 0; i < levelCount; i++) {
      tempColumn.push({
        title: LEVEL_LABEL[i + 1],
        dataIndex: `org${i + 1}`,
        onCell: (text: any) => {
          return {
            rowSpan: text.rowSpan?.[`org${i + 1}`] || 0,
          };
        },
        align: 'center',
        render: (text: any, record: any) => {
          return text?.orgName && i + 1 === levelCount
            ? `${text?.orgName}(${record?.fillPassPeople}人, ${record?.fillPassCount}份)`
            : text?.orgName || '-';
        },
      });
    }
    setFinalColumns(tempColumn?.length ? tempColumn : emptyColumns);
    return () => {
      setFinalColumns(emptyColumns);
    };
  }, [data]);

  return { columns: finalColumns, setColumns: setData };
}
