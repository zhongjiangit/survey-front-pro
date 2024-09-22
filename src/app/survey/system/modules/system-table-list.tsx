'use client';

import type { TableProps } from 'antd';
import { Table, Tag } from 'antd';
import { ConfigSystem, DeleteSystem, UpdateSystem } from './buttons';

interface DataType {
  id: string;
  systemName: string;
  levelCount: number;
  levelNames: string[];
  remaining: number;
  count: number;
  validDate: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '系统名称',
    dataIndex: 'systemName',
    key: 'systemName',
  },
  {
    title: '层级',
    dataIndex: 'levelCount',
    key: 'levelCount',
  },
  {
    title: '各层级名称',
    key: 'levelNames',
    render: (_, { levelNames }) => (
      <div className="flex">
        {levelNames.map((name, index) => (
          <Tag key={index} color={index % 2 === 0 ? 'blue' : 'green'}>
            {name}
          </Tag>
        ))}
      </div>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'validDate',
    key: 'validDate',
  },
  {
    title: '剩余次数/总次数',
    key: 'count',
    render: (_, { remaining, count }) => (
      <>
        {remaining} / {count}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <div className="flex justify-start gap-3">
        <ConfigSystem id={record.id} />
        <UpdateSystem id={record.id} />
        <DeleteSystem id={record.id} />
      </div>
    ),
  },
];

const data: DataType[] = [
  {
    id: 'ae42d64d-c0bf-4008-b729-60b7ad865433',
    systemName: 'John Brown',
    levelCount: 3,
    remaining: 2,
    count: 5,
    levelNames: ['nice', 'developer'],
    validDate: '2021-09-01',
  },
  {
    id: '648be994-df23-4115-8083-724308936ad1',
    systemName: 'Jim Green',
    levelCount: 4,
    remaining: 1,
    count: 3,
    levelNames: ['loser'],
    validDate: '2021-09-01',
  },
  {
    id: '648be994-df23-4115-8083-724308936ad2',
    systemName: 'Joe Black',
    levelCount: 2,
    remaining: 0,
    count: 1,
    levelNames: ['cool', 'teacher'],
    validDate: '2021-09-01',
  },
  // 生成50条数据
  ...Array.from({ length: 50 }, (_, index) => ({
    id: String(index),
    systemName: `Edward King ${index}`,
    levelCount: 2,
    remaining: 0,
    count: 1,
    levelNames: ['nice', 'developer'],
    validDate: '2021-09-01',
  })),
];

export default function SystemsTableList({ query }: { query: string }) {
  const dataSources = data.filter(({ systemName }) =>
    systemName.toLowerCase().includes(query.toLowerCase())
  );

  return <Table columns={columns} dataSource={dataSources} />;
}
