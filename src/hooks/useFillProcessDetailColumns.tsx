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
      return (
        <>
          {record.cellphone
            ? `${record.staffName}(${record.cellphone}) 资料提交：${record.fillCount}份`
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
        onCell: (text: any, record: any, ...rest: any[]) => {
          // console.log(text,record,rest);
          return {
            rowSpan: text.spans[index] || 0, // text.rowSpan?.[`org${index + 1}`] || 0,
          };
        },
        render: (value: any) => {
          return <>{value?.orgName}</>;
        },
      };
    });

    setFinalColumns([...tempColumn, ...baseColumns]);
  }, [data]);

  return { columns: finalColumns, setColumns: setData };
}

export function formaterTableData(list: any) {
  const levels = Object.values(list[0].levels);
  list.forEach((t: any) => {
    t.orgs = levels.map((f, i) => t['org' + (i + 1)]);
    t.spans = [];
  });
  const ids = (orgs: any, idx: number) =>
    orgs
      .slice(0, idx + 1)
      .map((t: any) => t?.orgId)
      .join(',');
  const sort = (list: any, idx: number) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.spans[idx] = 1;
      const orgId = ids(item.orgs, idx);
      for (let j = i + 1; j < list.length; j++) {
        if (orgId === ids(list[j].orgs, idx)) {
          i++;
          item.spans[idx]++;
          if (j !== i) {
            const t = list[i];
            list[i] = list[j];
            list[j] = t;
          }
        }
      }
    }
  };
  levels.forEach((t, i) => {
    sort(list, i);
  });
  console.log(list.map(t => t.orgs.map(t => t?.orgName).concat(t.spans)));
  console.log(list);
  list.slice = () => list;
  return list;
}
