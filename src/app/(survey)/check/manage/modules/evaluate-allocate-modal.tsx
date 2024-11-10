'use client';

import Circle from '@/components/display/circle';
import { cn } from '@/lib/utils';
import type { CheckboxProps, TableColumnsType, TableProps } from 'antd';
import {
  Button,
  Checkbox,
  DatePicker,
  Modal,
  Select,
  Table,
  Tree,
  TreeDataNode,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;

interface EvaluateAllocateModalProps {}

interface Values {
  taskName?: string;
}

export const treeData: TreeDataNode[][] = [
  [
    {
      title: '杨专家118999999（已分配3套）',
      key: 's',
      children: [
        {
          title: '第一小学 陈老师 试卷1',
          key: '1',
        },
        {
          title: '第一小学 陈老师 试卷2',
          key: '2',
        },
        {
          title: '第一小学 陈老师 试卷3',
          key: '3',
        },
      ],
    },
  ],
  [
    {
      title: '第一小学 陈老师 试卷1（3位）',
      key: 's',
      children: [
        {
          title: '杨专家118999999',
          key: '1',
        },
        {
          title: '刘专家118999999',
          key: '2',
        },
        {
          title: '钟专家118999999',
          key: '3',
        },
      ],
    },
  ],
];

const selectTreeData = [
  {
    title: '语文',
    value: '0-0',
    children: [
      {
        title: '小学语文',
        value: '0-0-1',
      },
      {
        title: '初中语文',
        value: '0-0-2',
      },
    ],
  },
  {
    title: '数学',
    value: '0-1',
  },
];

const plainOptions = [
  '钟专家（12345678900）',
  '杨专家（12345678900）',
  '刘专家（12345678900）',
  '陈专家（12345678900）',
  '王专家（12345678900）',
  '李专家（12345678900）',
  '赵专家（12345678900）',
  '吴专家（12345678900）',
  '周专家（12345678900）',
  '徐专家（12345678900）',
  '孙专家（12345678900）',
  '朱专家（12345678900）',
  '马专家（12345678900）',
  '胡专家（12345678900）',
  '郭专家（12345678900）',
  '林专家（12345678900）',
  '何专家（12345678900）',
  '高专家（12345678900）',
  '梁专家（12345678900）',
  '谢专家（12345678900）',
  '宋专家（12345678900）',
  '唐专家（12345678900）',
  '许专家（12345678900）',
  '邓专家（12345678900）',
  '冯专家（12345678900）',
];
const defaultCheckedList = ['钟专家（12345678900）', '杨专家（12345678900）'];

const EvaluateAllocateModal: React.FC<
  EvaluateAllocateModalProps
> = ({}: EvaluateAllocateModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);
  const [evaluateType, setEvaluateType] = useState('1');
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    // setOpen(false);
  };

  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        分配
      </a>
      <Modal
        style={{ top: '5%' }}
        open={open}
        title="专家评审分配"
        onCancel={() => setOpen(false)}
        width={1400}
        footer={false}
        destroyOnClose
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center">
            <span>分配方法：</span>
            <Select
              style={{ width: 200 }}
              value={evaluateType}
              onChange={value => {
                setEvaluateType(value);
              }}
            >
              <Select.Option value="1">给专家分配试题</Select.Option>
              <Select.Option value="2">给试题分配专家</Select.Option>
            </Select>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-5">
              <div className="w-80 border">
                <div className="bg-slate-300 p-3">总揽</div>
                <div className="grid grid-cols-3 p-3">
                  <div className="text-center">
                    <div className="bg-slate-200">专家总数</div>
                    <div className="bg-slate-100">20</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配专家</div>
                    <div className="bg-slate-100">10</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配专家</div>
                    <div className="bg-slate-100">10</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">试题总数</div>
                    <div className="bg-slate-100">10</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配试题</div>
                    <div className="bg-slate-100">5</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配试题</div>
                    <div className="bg-slate-100">5</div>
                  </div>
                </div>
              </div>
              {evaluateType === '1' ? (
                <div className="flex flex-col gap-2 w-80 border">
                  <div className="bg-slate-300 p-3">
                    已分配专家详情/删除已分配
                  </div>
                  <div className="h-80 w-full p-x overflow-auto">
                    {
                      /* 循环生成10个tree组件 */
                      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                        return (
                          <Tree
                            key={index}
                            checkable
                            treeData={treeData[0]}
                            // defaultExpandAll
                            style={{
                              flexShrink: 1,
                              // marginRight: '10%',
                            }}
                          />
                        );
                      })
                    }
                  </div>
                  <div className="flex p-2 justify-center">
                    <Button>删除已选</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-80 border">
                  <div className="bg-slate-300 p-3">
                    已分配试题详情/删除已分配
                  </div>
                  <div className="flex justify-center items-center h-40">
                    <Button
                      onClick={() => {
                        setSelectedModalOpen(true);
                      }}
                    >
                      查看详情
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <div
                className={cn('w-auto text-center flex', {
                  'flex-row': evaluateType === '1',
                  'flex-row-reverse': evaluateType === '2',
                })}
              >
                <div className="flex flex-col gap-5 px-5 max-h-[31rem] overflow-auto">
                  <TreeSelect
                    style={{ width: '200px' }}
                    // value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={selectTreeData}
                    placeholder="请选择专家标签进行过滤"
                    treeDefaultExpandAll
                    multiple

                    // onChange={onChange}
                  />
                  <div className="flex flex-col max-h-[28rem] overflow-auto">
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    >
                      全选
                    </Checkbox>
                    <Checkbox.Group
                      options={plainOptions}
                      value={checkedList}
                      onChange={onChange}
                      className="grid grid-cols-1"
                    />
                  </div>
                </div>

                <TestTable />
              </div>
              <div className="flex justify-center p-2 gap-5">
                <Button type="default">全选试题</Button>
                <Button color="danger" variant="outlined">
                  清空全部已选试题
                </Button>
                <Button type="primary">分配已选</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        style={{ top: '5%' }}
        open={selectedModalOpen}
        title="专家评审分配"
        onCancel={() => setSelectedModalOpen(false)}
        width={1200}
        footer={false}
        destroyOnClose
      >
        <SelectedTestTable />
      </Modal>
    </>
  );
};

export default EvaluateAllocateModal;

interface DataType {
  key: React.Key;
  org: string;
  num: string;
  experts: number;
  name: string;
}

const selectedTestColumns: TableColumnsType<DataType> = [
  {
    title: '单位',
    dataIndex: 'org',
    filters: [
      {
        text: '单位1',
        value: '1',
      },
      {
        text: '单位2',
        value: 'Category 1',
        children: [
          {
            text: '单位3',
            value: 'Yellow',
          },
          {
            text: '单位4',
            value: 'Pink',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.org.includes(value as string),
    width: '15%',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    filters: [
      {
        text: '语文',
        value: '1',
      },
      {
        text: '数学',
        value: 'Category 1',
        children: [
          {
            text: '小学数学',
            value: 'Yellow',
          },
          {
            text: '初中数学',
            value: 'Pink',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value as string),
    width: '20%',
  },
  {
    title: '试题编号',
    dataIndex: 'num',
    render: (text, record) => <Circle value={3} />,
  },
  {
    title: '已分配专家',
    dataIndex: 'num',
    render: (text, record) => <span>5</span>,
  },
  {
    title: (
      <div className="flex gap-1">
        <span>专家列表</span>
      </div>
    ),
    width: '48%',
    render: text => {
      return (
        <div className="flex gap-1">
          <div className="flex flex-nowrap">
            <Checkbox />
            <span>杨专家12345678900</span>
          </div>
          <div className="flex flex-nowrap">
            <Checkbox />
            <span>杨专家12345678900</span>
          </div>
          <div className="flex flex-nowrap">
            <Checkbox />
            <span>杨专家12345678900</span>
          </div>
        </div>
      );
    },
  },
];

const columns: TableColumnsType<DataType> = [
  {
    title: '单位',
    dataIndex: 'org',
    filters: [
      {
        text: '单位1',
        value: '1',
      },
      {
        text: '单位2',
        value: 'Category 1',
        children: [
          {
            text: '单位3',
            value: 'Yellow',
          },
          {
            text: '单位4',
            value: 'Pink',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.org.includes(value as string),
    width: '20%',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    filters: [
      {
        text: '语文',
        value: '1',
      },
      {
        text: '数学',
        value: 'Category 1',
        children: [
          {
            text: '小学数学',
            value: 'Yellow',
          },
          {
            text: '初中数学',
            value: 'Pink',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value as string),
    width: '30%',
  },
  {
    title: '试题编号',
    dataIndex: 'num',
    render: (text, record) => <Circle value={3} />,
  },
  {
    title: '已分配专家',
    dataIndex: 'num',
    render: (text, record) => <span>5</span>,
  },
  {
    title: (
      <div className="flex gap-1">
        <span>选择</span>
        <Checkbox />
      </div>
    ),
    render: () => <Checkbox />,
  },
];

const data: DataType[] = [
  {
    key: '1',
    org: '第一小学',
    name: '陈老师（123445678900）',
    num: '1',
    experts: 3,
  },
  {
    key: '2',
    name: '陈老师（123445678900）',
    org: '第二小学',
    num: '2',
    experts: 3,
  },
  {
    key: '3',
    name: '陈老师（123445678900）',
    org: '第三小学',
    num: '3',
    experts: 3,
  },
  {
    key: '4',
    name: '陈老师（123445678900）',
    org: '第四小学',
    num: '4',
    experts: 3,
  },
  {
    key: '5',
    name: '陈老师（123445678900）',
    org: '第五小学',
    num: '5',
    experts: 3,
  },
  {
    key: '6',
    name: '陈老师（123445678900）',
    org: '第六小学',
    num: '6',
    experts: 3,
  },
  {
    key: '7',
    name: '陈老师（123445678900）',
    org: '第七小学',
    num: '7',
    experts: 3,
  },
  {
    key: '8',
    name: '陈老师（123445678900）',
    org: '第八小学',
    num: '8',
    experts: 3,
  },
  {
    key: '9',
    name: '陈老师（123445678900）',
    org: '第九小学',
    num: '9',
    experts: 3,
  },
  {
    key: '10',
    name: '陈老师（123445678900）',
    org: '第十小学',
    num: '10',
    experts: 3,
  },
  {
    key: '11',
    name: '陈老师（123445678900）',
    org: '第十一小学',
    num: '11',
    experts: 3,
  },
  {
    key: '12',
    name: '陈老师（123445678900）',
    org: '第十二小学',
    num: '12',
    experts: 3,
  },
];

const onChange: TableProps<DataType>['onChange'] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log('params', pagination, filters, sorter, extra);
};

const TestTable: React.FC = () => (
  <Table<DataType>
    size="small"
    className="w-[48rem]"
    columns={columns}
    dataSource={data}
    onChange={onChange}
  />
);

const SelectedTestTable: React.FC = () => (
  <Table<DataType>
    size="small"
    columns={selectedTestColumns}
    dataSource={data}
    onChange={onChange}
  />
);
