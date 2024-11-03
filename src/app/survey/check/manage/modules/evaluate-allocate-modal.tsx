'use client';

import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tree,
  TreeDataNode,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';
import type { TableColumnsType, TableProps, CheckboxProps } from 'antd';
import Circle from '@/components/display/circle';

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
      title: '刘专家118999999（已分配3套）',
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
];

const selectTreeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];

const plainOptions = ['语文', '数学', '英语'];
const defaultCheckedList = ['语文', '数学'];

const EvaluateAllocateModal: React.FC<
  EvaluateAllocateModalProps
> = ({}: EvaluateAllocateModalProps) => {
  const [open, setOpen] = useState(false);
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
        open={open}
        title="专家评审分配"
        onCancel={() => setOpen(false)}
        width={1200}
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
              <div className="flex flex-col gap-2 w-80 border">
                <div className="bg-slate-300 p-3">
                  已经分配专家详情/删除已分配
                </div>
                <div className="h-96 w-full p-x overflow-auto">
                  {
                    /* 循环生成10个tree组件 */
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => {
                      return (
                        <Tree
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
            </div>
            <div className="w-auto text-center flex">
              <div className="flex flex-col gap-5 px-5">
                <TreeSelect
                  style={{ width: '200px' }}
                  // value={value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={selectTreeData}
                  placeholder="请选择专家标签进行过滤"
                  treeDefaultExpandAll
                  // onChange={onChange}
                />
                <div className="flex flex-col">
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

              <Test />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EvaluateAllocateModal;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: '单位',
    dataIndex: 'org',
    filters: [
      {
        text: '语文',
        value: '1',
      },
      {
        text: 'Category 1',
        value: 'Category 1',
        children: [
          {
            text: 'Yellow',
            value: 'Yellow',
          },
          {
            text: 'Pink',
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
    title: '姓名',
    dataIndex: 'name',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '试题编号',
    dataIndex: 'num',
    // render: (text, record) => <Circle />,
  },
  {
    title: '已分配专家',
    dataIndex: 'num',
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
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
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

const Test: React.FC = () => (
  <Table<DataType>
    size="small"
    columns={columns}
    dataSource={data}
    onChange={onChange}
  />
);
