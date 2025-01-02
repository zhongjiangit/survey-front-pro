'use client';

import { ListReviewDetailsManagerResponse } from '@/api/task/listReviewDetailsManager';
import { LEVEL_LABEL } from '@/types/CommonType';
import { useEffect, useState } from 'react';

export function useReviewDetailColumn(
  originData: ListReviewDetailsManagerResponse[] | undefined | []
) {
  const [data, setData] = useState<
    ListReviewDetailsManagerResponse[] | undefined | []
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
          return text.orgName || '-';
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
