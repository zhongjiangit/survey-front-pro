'use client';

import { ListReviewDetailsManagerResponse } from '@/api/task/listReviewDetailsManager';
import { LEVEL_LABEL } from '@/types/CommonType';
import { useEffect, useState } from 'react';
import OrgResult from '../review-result-modal/modules/org-result';
import { ShowReviewResultResponse } from '@/api/task/showReviewResult';
type OriginData =
  | ListReviewDetailsManagerResponse[]
  | ShowReviewResultResponse[]
  | undefined;

export function useReviewResultColumns(originData: OriginData) {
  const [data, setData] = useState<OriginData>(originData);
  const [finalColumns, setFinalColumns] = useState<any[]>([]);
  const levelCount = data?.[0]?.orgCount || 0;
  useEffect(() => {
    if (!data || data?.length === 0) {
      return;
    }
    const tempColumn: any[] = [];
    for (let i = 0; i < levelCount; i++) {
      tempColumn.push({
        title: (
          <>
            <div>{LEVEL_LABEL[i + 1]}</div>
            <div>平均分(点击查看详情)</div>
          </>
        ),
        dataIndex: `org${i + 1}`,
        onCell: (text: any) => {
          return {
            rowSpan: text.rowSpan?.[`org${i + 1}`] || 0,
          };
        },
        align: 'center',
        render: (value: any) => (
          <>
            <div>{value.orgName || '-'}</div>
            <OrgResult
              buttonText={`${value.averageScore}分`}
              record={value}
              modalTitle={value.orgName || '-'}
            ></OrgResult>
          </>
        ),
      });
    }

    setFinalColumns([...tempColumn, ...finalColumns]);
    return () => {
      setFinalColumns([]);
    };
  }, [data]);

  return { columns: finalColumns, setColumns: setData };
}
