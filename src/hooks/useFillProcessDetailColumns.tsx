'use client';

import Api from '@/api';
import { GetFillProcessDetailsResponse } from '@/api/task/getFillProcessDetails';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import {
  TaskProcessStatusEnum,
  TaskProcessStatusObject,
  TaskProcessStatusType,
} from '@/types/CommonType';
import { message, Space, TableColumnsType } from 'antd';
import { useState } from 'react';

const baseColumns: TableColumnsType = [
  {
    title: '人员',
    dataIndex: 'member',
    key: 'member',
    width: '30%',
    render: (_, record) => {
      return (
        <div>
          {`${record.staff}(${record.phone})资料提交：${record.fillCount}份`}
        </div>
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    render: (_, record) => {
      return (
        <div>
          {
            TaskProcessStatusObject[
              record.processStatus as TaskProcessStatusType
            ]
          }
        </div>
      );
    },
  },
];
export function useFillProcessDetailColumns(
  originData: GetFillProcessDetailsResponse[] | undefined | []
) {
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [data, setData] = useState<
    GetFillProcessDetailsResponse[] | undefined | []
  >(originData);
  const [finalColumns, setFinalColumns] = useState(baseColumns);

  if (!data || data.length === 0) {
    return { columns: finalColumns, setColumns: setData };
  }
  for (let index = 0; index < data[0].levels.length; index++) {
    const levelName = data[0].levels[index][`level${index + 1}`].levelName;
    setFinalColumns(prev => {
      return [
        {
          title: levelName,
          dataIndex: `org${index + 1}`,
          //   width: '20%',
        },
        ...prev,
      ];
    });
  }

  const operationColumn = {
    title: '操作',
    dataIndex: 'operation',
    render: (_: any, record: any) => {
      return (
        <Space className="flex justify-center items-center">
          {record.status && <a className=" text-blue-500">资料详情</a>}
          {record.status === TaskProcessStatusEnum.Submitted && (
            <a
              className=" text-blue-500"
              onClick={() => {
                Api.approveFill({
                  currentSystemId: currentSystem!.systemId,
                  currentOrgId: currentOrg!.orgId,
                  taskId: record.taskId,
                  staffId: record.staffId,
                }).then(() => {
                  message.info('提交成功');
                });
              }}
            >
              通过
            </a>
          )}
          {record.status === TaskProcessStatusEnum.Submitted && (
            <a className=" text-blue-500">驳回</a>
          )}
        </Space>
      );
    },
  };
  return { columns: finalColumns, setColumns: setData };
}
