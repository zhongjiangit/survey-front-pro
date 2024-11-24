'use client';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { cn } from '@/lib/utils';
import { useRequest } from 'ahooks';
import type { CheckboxProps, TableColumnsType, TableProps } from 'antd';
import {
  Button,
  Checkbox,
  DatePicker,
  Modal,
  Select,
  Table,
  Tree,
  TreeSelect,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

interface EvaluateAllocateModalProps {
  task: ListMyInspTaskResponse;
}

interface Values {
  taskName?: string;
}

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

const EvaluateAllocateModal: React.FC<EvaluateAllocateModalProps> = ({
  task,
}: EvaluateAllocateModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);
  const [evaluateType, setEvaluateType] = useState('questionsToExperts');
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assignedFills, setAssignedFills] = useState<number[]>([]);
  const [assignedExperts, setAssignedExperts] = useState<string[]>([]);

  const { run: getListReviewAssignByExpert, data: listReviewAssignByExpert } =
    useRequest(
      () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        return Api.listReviewAssignByExpert({
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
          taskId: task.taskId,
        });
      },
      {
        manual: true,
        onSuccess(response) {
          console.log('listReviewAssignByExpert', response);
        },
      }
    );

  const { run: getListReviewAssignByFill } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.listReviewAssignByFill({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
      });
    },
    {
      manual: true,
      onSuccess(response) {
        console.log('listReviewAssignByFill', response);
      },
    }
  );

  const {
    data: listFillsByTaskPage,
    run: getListFillsByTaskPage,
    loading: getListFillsByTaskPageLoading,
  } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.listFillsByTaskPage({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });
    },
    {
      manual: true,
      onSuccess(response) {
        console.log('listFillsByTaskPage', response);
      },
    }
  );

  const { data: staffListByTags, run: getStaffListByTags } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.getStaffListByTags({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        orgId: currentOrg?.orgId,
        tags: [],
      });
    },
    {
      manual: true,
      onSuccess(response) {
        console.log('getStaffListByTags', response);
      },
    }
  );

  const { run: saveReviewAssignAdd } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.reviewAssignAdd({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        assignedFills: assignedFills.map(fill => ({ singleFillId: fill })),
        assignedExperts: assignedExperts.map(expert => ({
          expertId: Number(expert),
        })),
      });
    },
    {
      manual: true,
      onSuccess(response) {
        console.log('getStaffListByTags', response);
      },
    }
  );

  const { run: reviewAssignDelete } = useRequest(
    () => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.reviewAssignDelete({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        // TODO: 为实现参数
        assigns: assignedFills.map(fill => ({
          singleFillId: fill,
          expertId: 0,
        })),
      });
    },
    {
      manual: true,
      onSuccess(response) {
        console.log('getStaffListByTags', response);
      },
    }
  );

  const plainOptions = useMemo(() => {
    return (
      staffListByTags?.data.map(item => {
        return {
          label: item.staffName + '（' + item.cellphone + '）',
          value: item.id.toString(),
        };
      }) || []
    );
  }, [staffListByTags]);

  const expertCheckAll = useMemo(
    () => plainOptions.length === assignedExperts.length,
    [assignedExperts.length, plainOptions.length]
  );
  const expertIndeterminate = useMemo(
    () =>
      assignedExperts.length > 0 &&
      assignedExperts.length < plainOptions.length,
    [assignedExperts.length, plainOptions.length]
  );

  // const testCheckAll = useMemo(
  //   () => listFillsByTaskPage?.data?.length === assignedFills.length,
  //   [assignedFills.length, listFillsByTaskPage?.data?.length]
  // );
  // const testIndeterminate = useMemo(
  //   () =>
  //     assignedFills.length > 0 &&
  //     assignedFills.length < (listFillsByTaskPage?.data?.length ?? 0),
  //   [assignedFills.length, listFillsByTaskPage?.data?.length]
  // );
  // const onTestCheckAllChange: CheckboxProps['onChange'] = useCallback(
  //   (e: any) => {
  //     setAssignedFills(
  //       e.target.checked
  //         ? listFillsByTaskPage?.data?.map(option => option.singleFillId) ?? []
  //         : []
  //     );
  //   },
  //   [listFillsByTaskPage]
  // );

  const onChange = (list: string[]) => {
    setAssignedExperts(list);
    console.log(list);
  };

  const onExpertCheckAllChange: CheckboxProps['onChange'] = e => {
    setAssignedExperts(
      e.target.checked ? plainOptions.map(option => option.value) : []
    );
  };

  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    // setOpen(false);
  };

  useEffect(() => {
    if (open) {
      getListReviewAssignByExpert();
      getListReviewAssignByFill();
      getListFillsByTaskPage();
      getStaffListByTags();
    }
  }, [
    getListFillsByTaskPage,
    getListReviewAssignByExpert,
    getListReviewAssignByFill,
    getStaffListByTags,
    open,
  ]);

  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: '单位',
        dataIndex: 'orgName',
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
        onFilter: (value, record) => record.orgName.includes(value as string),
        width: '20%',
      },
      {
        title: '姓名',
        dataIndex: 'staffName',
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
        onFilter: (value, record) => record.staffName.includes(value as string),
        width: '30%',
      },
      {
        title: '试题编号',
        dataIndex: 'fillIndex',
        render: (text, record) => <Circle value={text} />,
      },
      {
        title: '已分配专家',
        dataIndex: 'expertCount',
        render: (text, record) => <span>{text}</span>,
      },
      {
        title: (
          <div className="flex gap-1">
            <span>选择</span>
            {/* <Checkbox
              indeterminate={testIndeterminate}
              checked={testCheckAll}
              onChange={onTestCheckAllChange}
            /> */}
          </div>
        ),
        render: (text, record) => (
          <Checkbox
            checked={assignedFills.includes(record.singleFillId)}
            onChange={e => {
              console.log(e.target.checked);
              if (e.target.checked) {
                setAssignedFills([...assignedFills, record.singleFillId]);
              } else {
                setAssignedFills(
                  assignedFills.filter(item => item !== record.singleFillId)
                );
              }
            }}
          />
        ),
      },
    ],
    [assignedFills]
  );

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
              <Select.Option value="questionsToExperts">
                给专家分配试题
              </Select.Option>
              <Select.Option value="expertsToQuestions">
                给试题分配专家
              </Select.Option>
            </Select>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col gap-5">
              <div className="w-80 border">
                <div className="bg-slate-300 p-3">总揽</div>
                <div className="grid grid-cols-3 p-3">
                  <div className="text-center">
                    <div className="bg-slate-200">专家总数</div>
                    <div className="bg-slate-100">
                      {staffListByTags?.data.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配专家</div>
                    <div className="bg-slate-100">
                      {listReviewAssignByExpert?.data.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配专家</div>
                    <div className="bg-slate-100">
                      {(staffListByTags?.data.length || 0) -
                        (listReviewAssignByExpert?.data.length || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">试题总数</div>
                    <div className="bg-slate-100">
                      {listFillsByTaskPage?.data.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配试题</div>
                    <div className="bg-slate-100">0</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配试题</div>
                    <div className="bg-slate-100">0</div>
                  </div>
                </div>
              </div>
              {evaluateType === 'questionsToExperts' ? (
                <div className="flex flex-col gap-2 w-80 border">
                  <div className="bg-slate-300 p-3">
                    已分配专家详情/删除已分配
                  </div>
                  <div className="h-80 w-full p-x overflow-auto">
                    {listReviewAssignByExpert?.data?.map((item, index) => {
                      return (
                        <Tree
                          key={index}
                          checkable
                          treeData={[
                            {
                              title: (
                                <div className="flex justify-between p-2">
                                  <span>{item.expertName}</span>
                                  <span>({item.cellphone})</span>
                                  <span>
                                    已分配{item.assignedFills.length}套
                                  </span>
                                </div>
                              ),
                              key: item.expertId.toString(),
                              children: item?.assignedFills?.map(fill => {
                                return {
                                  title: (
                                    <div className="flex justify-between gap-1 p-2">
                                      <span>{fill.orgName}</span>
                                      <span>{fill.staffName}</span>
                                      <span>{fill.fillIndex}</span>
                                    </div>
                                  ),
                                  key: fill.singleFillId.toString(),
                                };
                              }),
                            },
                          ]}
                          // defaultExpandAll
                          style={{
                            flexShrink: 1,
                            // marginRight: '10%',
                          }}
                        />
                      );
                    })}
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
                  'flex-row': evaluateType === 'questionsToExperts',
                  'flex-row-reverse': evaluateType === 'expertsToQuestions',
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
                    {plainOptions.length > 0 && (
                      <Checkbox
                        indeterminate={expertIndeterminate}
                        onChange={onExpertCheckAllChange}
                        checked={expertCheckAll}
                      >
                        全选
                      </Checkbox>
                    )}
                    <Checkbox.Group
                      options={plainOptions}
                      value={assignedExperts}
                      onChange={onChange}
                      className="grid grid-cols-1"
                    />
                  </div>
                </div>

                <Table<DataType>
                  size="small"
                  className="w-[48rem]"
                  columns={columns}
                  dataSource={listFillsByTaskPage?.data || []}
                  loading={getListFillsByTaskPageLoading}
                  // onChange={onChange}
                />
              </div>
              <div className="flex justify-center p-2 gap-5">
                <Button type="default">全选试题</Button>
                <Button color="danger" variant="outlined">
                  清空全部已选试题
                </Button>
                <Button type="primary" onClick={saveReviewAssignAdd}>
                  分配已选
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        style={{ top: '5%' }}
        open={selectedModalOpen}
        title="试题分配详情"
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
  cellphone: string;
  expertCount: number;
  fillIndex: number;
  orgName: string;
  singleFillId: number;
  staffId: number;
  staffName: string;
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
    onFilter: (value, record) => record.orgName.includes(value as string),
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
    onFilter: (value, record) => record.staffName.includes(value as string),
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
    dataIndex: 'orgName',
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
    onFilter: (value, record) => record.orgName.includes(value as string),
    width: '20%',
  },
  {
    title: '姓名',
    dataIndex: 'staffName',
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
    onFilter: (value, record) => record.staffName.includes(value as string),
    width: '30%',
  },
  {
    title: '试题编号',
    dataIndex: 'fillIndex',
    render: (text, record) => <Circle value={text} />,
  },
  {
    title: '已分配专家',
    dataIndex: 'expertCount',
    render: (text, record) => <span>{text}</span>,
  },
  {
    title: (
      <div className="flex gap-1">
        <span>选择</span>
        {/* <Checkbox onClick={checkAllTest} /> */}
      </div>
    ),
    render: () => <Checkbox />,
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

const SelectedTestTable = () => (
  <Table<DataType>
    size="small"
    columns={selectedTestColumns}
    dataSource={[]}
    onChange={onChange}
  />
);
