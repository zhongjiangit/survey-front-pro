'use client';

import { GetFillProcessDetailsResponse } from '@/api/task/getFillProcessDetails';
import {
  TaskProcessStatusObject,
  TaskProcessStatusType,
} from '@/types/CommonType';
import { TableColumnsType } from 'antd';
import { useEffect, useState, useRef, useMemo } from 'react';

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

  const getLevels = (
    data: GetFillProcessDetailsResponse[]
  ): { levelName: string; dataIndex: string }[] => {
    const obj = data.reduce<{ [key: string]: { levelName: string } }>(
      (res, t) => {
        return Object.keys(res).length < Object.keys(t.levels).length
          ? t.levels
          : res;
      },
      {}
    );
    return Object.values(obj).map(({ levelName }, i) => {
      return {
        levelName,
        dataIndex: `org${i + 1}`,
      };
    });
  };

  const getCombineKeys = (data: GetFillProcessDetailsResponse[]) => {
    return Object.values(getLevels(data)).map(t => t.dataIndex);
  };

  useEffect(() => {
    if (!data || data.length === 0 || !data[0]?.levels) {
      return;
    }
    const levels = getLevels(data);
    const tempColumn = levels.map(({ levelName, dataIndex }, index) => {
      return {
        title: levelName,
        dataIndex: dataIndex,
        onCell: (text: any) => {
          return {
            rowSpan: text.rowSpan?.[dataIndex] || 0,
          };
        },
        render: (value: any) => {
          return <>{value?.orgName}</>;
        },
      };
    });
    setFinalColumns([...tempColumn, ...baseColumns]);
  }, [data]);

  return {
    columns: finalColumns,
    setColumns: setData,
    getLevels,
    getCombineKeys,
  };
}
