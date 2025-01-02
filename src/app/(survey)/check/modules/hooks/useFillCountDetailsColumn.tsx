'use client';

import { GetFillCountDetailsResponse } from '@/api/task/getFillCountDetails';
import { LEVEL_LABEL } from '@/types/CommonType';
import { useEffect, useState } from 'react';

export function useFillCountDetailsColumn(
  originData: GetFillCountDetailsResponse[] | undefined | []
) {
  const [data, setData] = useState<
    GetFillCountDetailsResponse[] | undefined | []
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
            ? `${text?.orgName}(${record?.fillPeople}人, ${record?.fillCount}份)`
            : text?.orgName || '-';
        },
      });
    }

    setFinalColumns([...tempColumn]);
    return () => {
      setFinalColumns([]);
    };
  }, [data]);

  return { columns: finalColumns, setColumns: setData };
}
