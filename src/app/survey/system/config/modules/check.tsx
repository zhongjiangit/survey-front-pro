'use client';

import { SystemListType } from '@/data/system/useSystemListAllSWR';
import { Space, Table, TableProps, Tag } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';
import NewCheckSet from './new-check-set';

interface DataType {
  key: string;
  name: string;
  time: string;
  status: string[];
}

interface CollectProps {
  system: SystemListType;
}

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    time: '2024-09-01',
    status: ['停用'],
  },
  {
    key: '2',
    name: 'Jim Green',
    time: '2024-09-01',
    status: ['启用'],
  },
  {
    key: '3',
    name: 'Joe Black',
    time: '2024-09-01',
    status: ['启用'],
  },
];

const Check = ({ system }: CollectProps) => {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  const selectedTab = searchParams.get('tab');
  const initialItems = [
    { label: '问卷 1', children: <NewCheckSet system={system} />, key: '1' },
  ];
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);
  const columns: TableProps<DataType>['columns'] = useMemo(
    () => [
      {
        title: '模板',
        dataIndex: 'name',
        key: 'name',
        render: (_, { key }) => <span>{`模板${key}`}</span>,
      },

      {
        title: '创建时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '启用状态',
        key: 'status',
        dataIndex: 'status',
        render: (_, { status }) => (
          <>
            {status.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === '停用') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Link
              href={`/survey/system/config/collect?id=${selectedId}&tab=${activeKey}&check=${record.key}`}
            >
              详情
            </Link>
            <a>复制</a>
            <a>删除</a>
          </Space>
        ),
      },
    ],
    []
  );
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: `问卷 ${newTabIndex.current + 1}`,
      children: <NewCheckSet system={system} />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter(item => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <main>
      <Table<DataType> columns={columns} dataSource={data} />
    </main>
  );
};
export default Check;
