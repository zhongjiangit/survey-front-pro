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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { formatTreeData } from '@/lib/format-tree-data';

const { RangePicker } = DatePicker;

interface EvaluateAllocateModalProps {
  task: ListMyInspTaskResponse;
}

interface Values {
  taskName?: string;
}

export const EvaluateAllocateModal: React.FC<
  EvaluateAllocateModalProps & { setOpen: (open: boolean) => void }
> = ({ task, setOpen }) => {
  const open = true;
  const [modal, contextHolder] = Modal.useModal();
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);
  const [evaluateType, setEvaluateType] = useState('questionsToExperts');
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // 选中的试题
  const [assignedFills, setAssignedFills] = useState<number[]>([]);
  // 删除已分配的试题
  const [delAssignedFills, setDelAssignedFills] = useState<string[]>([]);
  // 选择的专家
  const [assignedExperts, setAssignedExperts] = useState<string[]>([]);
  // 专家标签
  const [expertTags, setExpertTags] = useState<number[]>([]);

  const [tableParams, setTableParams] = useState<any>({
    pagination: { current: 1, pageSize: 10 },
    filters: {},
  });

  // 标签列表
  const { data: tagList } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      // 1：单位标签  2：组织人员标签  3：专家标签
      return Promise.all([
        Api.getTagList({
          currentSystemId: currentSystem.systemId!,
          tagType: 3,
        }),
        Api.getTagList({
          currentSystemId: currentSystem.systemId!,
          tagType: 1,
        }),
        Api.getTagList({
          currentSystemId: currentSystem.systemId!,
          tagType: 2,
        }),
      ]);
    },
    { ready: true, refreshDeps: [currentSystem, currentOrg, open] }
  );
  const [expertTagList, orgTags, staffTags] = tagList || [];

  // 已分配专家列表
  const {
    data: listReviewAssignByExpert,
    refresh: refreshListReviewAssignByExpert,
  } = useRequest(
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
    { ready: true }
  );

  // 试题分配的专家
  const assignedFillExperts = useMemo(() => {
    if (!listReviewAssignByExpert?.data) {
      return {};
    }
    return listReviewAssignByExpert.data.reduce(
      (res: any, { assignedFills, ...expert }) => {
        assignedFills.forEach(({ singleFillId }) => {
          (res[singleFillId] ??= []).push(expert);
        });
        return res;
      },
      {}
    );
  }, [listReviewAssignByExpert]);

  // 已分配试题列表
  const { data: listReviewAssignByFill, run: getListReviewAssignByFill } =
    useRequest(
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
          //
        },
      }
    );

  // 试题列表
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
        pageNumber: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
        orgTags: tableParams.filters.orgName?.map((t: any) => ({ key: t })),
        staffTags: tableParams.filters.staffName?.map((t: any) => ({ key: t })),
      });
    },
    {
      ready: true,
      refreshDeps: [open, pageNumber, pageSize, JSON.stringify(tableParams)],
      onSuccess() {
        // 清空已选择试题
        setAssignedFills([]);
      },
    }
  );

  // 专家列表
  const { data: expertListByTags, run: getExpertListByTags } = useRequest(
    (tags = expertTags) => {
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.getExpertListByTags({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        tags: tags.map((t: any) => ({ key: t })),
      });
    },
    {
      refreshDeps: [expertTags],
      ready: true,
      onSuccess() {
        // 清空已选择专家
        setAssignedExperts([]);
      },
    }
  );

  // 保存分配
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
      onSuccess() {
        // 刷新列表
        refreshListReviewAssignByExpert();
      },
    }
  );

  // 删除分配
  const { run: reviewAssignDelete, loading: reviewAssignDeleteLoading } =
    useRequest(
      async () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        const assigns = delAssignedFills
          .map(t => t.split(','))
          .filter(t => t.length === 2)
          .map(idPath => {
            return {
              singleFillId: Number(idPath[1]),
              expertId: Number(idPath[0]),
            };
          });
        return Api.reviewAssignDelete({
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
          taskId: task.taskId,
          assigns: assigns,
        });
      },
      {
        manual: true,
        onSuccess(response) {
          refreshListReviewAssignByExpert();
          setDelAssignedFills([]);
        },
      }
    );

  const plainOptions = useMemo(() => {
    return (
      expertListByTags?.data.map(item => {
        return {
          label: item.expertName + '（' + item.cellphone + '）',
          value: item.id.toString(),
        };
      }) || []
    );
  }, [expertListByTags]);

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
  };

  const onExpertCheckAllChange: CheckboxProps['onChange'] = e => {
    setAssignedExperts(
      e.target.checked ? plainOptions.map(option => option.value) : []
    );
  };

  const handleTableChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters
  ) => {
    setTableParams({ pagination, filters });
  };

  const columns: TableColumnsType<DataType> = useMemo(
    () => [
      {
        title: '单位',
        dataIndex: 'orgName',
        filters: formatTreeData([orgTags?.data.tags]),
        filterMode: 'tree',
        filterSearch: true,
        width: '20%',
      },
      {
        title: '姓名',
        dataIndex: 'staffName',
        filters: formatTreeData([staffTags?.data.tags]),
        filterMode: 'tree',
        filterSearch: true,
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
        render: (text, record) => (
          <span>{assignedFillExperts[record.singleFillId]?.length || 0}</span>
        ),
      },
      {
        title: (
          <div className="flex gap-1">
            <span>选择</span>
          </div>
        ),
        render: (text, record) => (
          <Checkbox
            checked={assignedFills.includes(record.singleFillId)}
            onChange={e => {
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
    [assignedFills, assignedFillExperts, orgTags, listFillsByTaskPage]
  );

  return (
    <>
      {contextHolder}
      <Modal
        style={{ top: '5%' }}
        open={open}
        title="专家评审分配"
        onCancel={() => setOpen(false)}
        width={1400}
        footer={false}
        destroyOnClose
        maskClosable={false}
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
                      {expertListByTags?.data.length || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配专家</div>
                    <div className="bg-slate-100">
                      {listReviewAssignByExpert?.data.length || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配专家</div>
                    <div className="bg-slate-100">
                      {(expertListByTags?.data.length || 0) -
                        (listReviewAssignByExpert?.data.length || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">试题总数</div>
                    <div className="bg-slate-100">
                      {listFillsByTaskPage?.data.length || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">已分配试题</div>
                    <div className="bg-slate-100">
                      {Object.keys(assignedFillExperts).length || 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-slate-200">未分配试题</div>
                    <div className="bg-slate-100">
                      {(listFillsByTaskPage?.data.length || 0) -
                        (Object.keys(assignedFillExperts).length || 0)}
                    </div>
                  </div>
                </div>
              </div>
              {evaluateType === 'questionsToExperts' ? (
                <div className="flex flex-col gap-2 w-80 border">
                  <div className="bg-slate-300 p-3">
                    已分配专家详情/删除已分配
                  </div>
                  <div className="h-80 w-full p-x overflow-auto">
                    <Tree
                      checkable
                      checkedKeys={delAssignedFills}
                      onCheck={(keys: any) => setDelAssignedFills(keys)}
                      treeData={listReviewAssignByExpert?.data.map(item => ({
                        title: (
                          <div className="flex justify-start items-center gap-1">
                            <span>{item.expertName}</span>
                            <span>({item.cellphone})</span>
                            <span>已分配{item.assignedFills.length}套</span>
                          </div>
                        ),
                        key: item.expertId.toString(),
                        children: item?.assignedFills?.map(fill => {
                          return {
                            title: (
                              <div className="flex justify-start items-center gap-1">
                                <span>{fill.orgName}</span>
                                <span>{fill.staffName}</span>
                                <span>{fill.fillIndex}</span>
                              </div>
                            ),
                            key:
                              item.expertId +
                              ',' +
                              fill.singleFillId.toString(),
                          };
                        }),
                      }))}
                      // defaultExpandAll
                      style={{
                        flexShrink: 1,
                        // marginRight: '10%',
                      }}
                    />
                  </div>
                  <div className="flex p-2 justify-center">
                    <Button
                      onClick={() => {
                        delAssignedFills.length &&
                          modal.confirm({
                            title: '删除',
                            icon: <ExclamationCircleFilled />,
                            content: <>确认删除已分配试题？</>,
                            onOk() {
                              reviewAssignDelete();
                            },
                          });
                      }}
                      loading={reviewAssignDeleteLoading}
                    >
                      删除已选
                    </Button>
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
                    value={expertTags}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={formatTreeData([expertTagList?.data.tags])}
                    placeholder="请选择专家标签进行过滤"
                    treeCheckable={true}
                    showCheckedStrategy={'SHOW_PARENT'}
                    treeDefaultExpandAll
                    multiple
                    onChange={keys => {
                      setExpertTags(keys);
                      getExpertListByTags(keys);
                    }}
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
                  pagination={{
                    total: listFillsByTaskPage?.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    current: tableParams.pagination.current,
                    pageSize: tableParams.pagination.pageSize,
                    showTotal: total => `总共 ${total} 条`,
                  }}
                  onChange={handleTableChange}
                />
              </div>
              <div className="flex justify-center p-2 gap-5">
                <Button
                  type="default"
                  onClick={() => {
                    setAssignedFills(
                      listFillsByTaskPage?.data.map(t => t.singleFillId) || []
                    );
                  }}
                >
                  全选试题
                </Button>
                <Button
                  color="danger"
                  variant="outlined"
                  onClick={() => setAssignedFills([])}
                >
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
        maskClosable={false}
      >
        <SelectedTestTable />
      </Modal>
    </>
  );
};

const EvaluateAllocateModalBtn: React.FC<EvaluateAllocateModalProps> = ({
  task,
}: EvaluateAllocateModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="text-blue-500" onClick={() => setOpen(true)}>
        分配
      </a>
      {open && (
        <EvaluateAllocateModal
          task={task}
          setOpen={setOpen}
        ></EvaluateAllocateModal>
      )}
    </>
  );
};

export default EvaluateAllocateModalBtn;

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
