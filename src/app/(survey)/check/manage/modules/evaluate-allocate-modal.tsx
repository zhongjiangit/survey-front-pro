'use client';

import Api from '@/api';
import { ListMyInspTaskResponse } from '@/api/task/listMyInspTask';
import { ListReviewAssignByFillResponse } from '@/api/task/listReviewAssignByFill';
import FillDetail from '@/app/modules/task-detail/fillDetail';
import Circle from '@/components/display/circle';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { formatTreeData } from '@/lib/format-tree-data';
import { cn } from '@/lib/utils';
import { DetailShowTypeEnum } from '@/types/CommonType';
import {
  ExclamationCircleFilled,
  QuestionCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Checkbox,
  CheckboxProps,
  message,
  Modal,
  Select,
  Table,
  TableColumnsType,
  TableProps,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import React, { useMemo, useState } from 'react';

interface EvaluateAllocateModalProps {
  task: ListMyInspTaskResponse;
}

export const EvaluateAllocateModal: React.FC<
  EvaluateAllocateModalProps & { setOpen: (open: boolean) => void }
> = ({ task, setOpen }) => {
  const open = true;
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, contextHolder] = Modal.useModal();
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);
  const [evaluateType, setEvaluateType] = useState<
    'questionsToExperts' | 'expertsToQuestions'
  >('questionsToExperts');
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
  // 试题表格参数
  const [tableParams, _setTableParams] = useState<any>({
    pagination: { current: 1, pageSize: 10 },
    filters: {},
    order: ['asc', null],
  });
  // 已分配试题表格参数
  const [assignFillTableParams, setAssignFillTableParams] = useState<any>({
    pagination: { current: 1, pageSize: 10 },
    filters: {},
  });
  const setTableParams = (data: any) => {
    _setTableParams((state: any) => ({ ...state, ...data }));
  };

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
          showUntagged: 1,
        }),
        Api.getTagList({
          currentSystemId: currentSystem.systemId!,
          tagType: 1,
          showUntagged: 1,
        }),
        Api.getTagList({
          currentSystemId: currentSystem.systemId!,
          tagType: 2,
          showUntagged: 1,
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
      // if (evaluateType !== 'questionsToExperts') {
      //   return Promise.reject('');
      // }
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.listReviewAssignByExpert({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
      });
    },
    { ready: true, refreshDeps: [evaluateType] }
  );

  // 获取总览
  const { data: reviewAssignOverview, refresh: refreshReviewAssignOverview } =
    useRequest(
      () => {
        if (!currentSystem?.systemId || !currentOrg?.orgId) {
          return Promise.reject('currentSystem or currentOrg is not exist');
        }
        return Api.getReviewAssignOverview({
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
          taskId: task.taskId,
        });
      },
      { ready: true, refreshDeps: [] }
    );

  // 试题分配的专家
  const assignedFillExperts = useMemo(() => {
    if (!listReviewAssignByExpert?.data) {
      return {};
    }
    return listReviewAssignByExpert.data.reduce(
      (res: any, { assignedFills, ...expert }) => {
        assignedFills.forEach(({ singleFillId }) => {
          if (assignedExperts.includes(expert.expertId + '')) {
            (res[singleFillId] ??= []).push(expert);
          }
        });
        return res;
      },
      {}
    );
  }, [listReviewAssignByExpert, assignedExperts]);

  const disabledFills = useMemo(() => {
    if (!assignedExperts.length || evaluateType === 'expertsToQuestions') {
      return {};
    }
    return Object.entries<any[]>(assignedFillExperts).reduce(
      (res: any, [fillId, experts]: [string, any[]]) => {
        res[fillId] =
          experts.length === assignedExperts.length &&
          experts.every((t: any) => assignedExperts.includes(t.expertId + ''));
        return res;
      },
      {}
    );
  }, [assignedFillExperts, assignedExperts]);

  const disabledExperts = useMemo(() => {
    if (
      !assignedFills.length ||
      !listReviewAssignByExpert?.data ||
      evaluateType === 'questionsToExperts'
    ) {
      return {};
    }
    return listReviewAssignByExpert.data.reduce(
      (res: any, { assignedFills: fills, ...expert }) => {
        res[expert.expertId] = assignedFills.every((t: any) =>
          fills.some((f: any) => f.singleFillId === t)
        );
        return res;
      },
      {}
    );
  }, [listReviewAssignByExpert, assignedFills]);

  // 有效的已分配试题
  const validSelectedFills = useMemo(() => {
    return assignedFills.filter((t: number) => !disabledFills[t]);
  }, [assignedFills, disabledFills]);

  // 有效的已分配专家
  const validSelectedExpert = useMemo(() => {
    return assignedExperts.filter((t: string) => !disabledExperts[t]);
  }, [assignedExperts, disabledExperts]);

  // 已分配试题列表
  const {
    data: listReviewAssignByFill,
    refresh: refreshListReviewAssignByFill,
    loading: listReviewAssignByFillLoading,
  } = useRequest(
    () => {
      if (evaluateType !== 'expertsToQuestions') {
        return Promise.reject('');
      }
      if (!currentSystem?.systemId || !currentOrg?.orgId) {
        return Promise.reject('currentSystem or currentOrg is not exist');
      }
      return Api.listReviewAssignByFill({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: currentOrg?.orgId,
        taskId: task.taskId,
        pageNumber: assignFillTableParams.pagination.current,
        pageSize: assignFillTableParams.pagination.pageSize,
        orgTags: assignFillTableParams.filters.orgName?.map((t: any) => ({
          key: t,
        })),
        staffTags: assignFillTableParams.filters.staffName?.map((t: any) => ({
          key: t,
        })),
      });
    },
    {
      ready: true,
      refreshDeps: [evaluateType, JSON.stringify(assignFillTableParams)],
    }
  );

  // 试题列表
  const {
    data: listFillsByTaskPage,
    refresh: refreshListFillsByTaskPage,
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
        order: [
          { orgName: tableParams.order[0] },
          { expertCount: tableParams.order[1] },
        ].filter(t => Object.values(t)[0]),
        pageNumber: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
        orgTags: tableParams.filters.orgName?.map((t: any) => ({ key: t })),
        staffTags: tableParams.filters.staffName?.map((t: any) => ({ key: t })),
      });
    },
    {
      ready: true,
      refreshDeps: [open, pageNumber, pageSize, JSON.stringify(tableParams)],
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
        tags: tags
          .map((t: any) => ({ key: Number(t) }))
          .filter((t: any) => t.key !== -1),
        showUntagged: tags.includes('-1') ? 1 : 0,
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
        messageApi.success('分配成功');
        setAssignedFills([]);
        setAssignedExperts([]);
        // 刷新列表
        refreshListReviewAssignByExpert();
        refreshListReviewAssignByFill();
        refreshReviewAssignOverview();
        refreshListFillsByTaskPage();
        setDelAssignedFills([]);
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
          messageApi.success('删除成功');
          refreshListReviewAssignByExpert();
          refreshListReviewAssignByFill();
          refreshReviewAssignOverview();
          refreshListFillsByTaskPage();
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
          disabled: disabledExperts[item.id],
        };
      }) || []
    );
  }, [expertListByTags, disabledExperts]);

  const undisabledOptions = useMemo(
    () => plainOptions.filter(t => !t.disabled),
    [plainOptions]
  );

  const expertCheckAll = useMemo(() => {
    return !!(
      validSelectedExpert.length &&
      validSelectedExpert.length === undisabledOptions.length
    );
  }, [validSelectedExpert, undisabledOptions]);

  const expertIndeterminate = useMemo(
    () =>
      !!(
        !expertCheckAll &&
        validSelectedExpert.length &&
        validSelectedExpert.length < undisabledOptions.length
      ),
    [assignedExperts, undisabledOptions]
  );

  const treeData = useMemo(
    () =>
      listReviewAssignByExpert?.data.map(item => ({
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
              <FillDetail
                task={task}
                singleFillId={fill.singleFillId}
                action={
                  <div className="flex justify-start items-center gap-1">
                    <span>{fill.orgName} / </span>
                    <span>{fill.staffName} / </span>
                    <span>题号:{fill.fillIndex}</span>
                  </div>
                }
                customTitle="试题详情"
                showType={DetailShowTypeEnum.Check}
              />
            ),
            key: item.expertId + ',' + fill.singleFillId.toString(),
          };
        }),
      })),
    [listReviewAssignByExpert, task]
  );

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
    const d = {
      staffName: null,
      orgName: null,
    };
    if (
      JSON.stringify({ ...d, ...tableParams.filters }) !==
      JSON.stringify({ ...d, ...filters })
    ) {
      setAssignedFills([]);
    }
    setTableParams({ pagination, filters });
  };

  const delOk = () => {
    if (delAssignedFills.length) {
      modal.confirm({
        title: '删除',
        icon: <ExclamationCircleFilled />,
        content: <>确认删除已分配试题？</>,
        onOk() {
          reviewAssignDelete();
        },
      });
    }
  };

  const sort = (
    order: 'desc' | 'asc' | null,
    orderBy: (order: 'desc' | 'asc' | null) => void
  ) => {
    return (
      <a
        className="ml-4"
        style={{ color: order ? '#1677ff' : '#999' }}
        onClick={() => orderBy(order === 'asc' ? 'desc' : order ? null : 'asc')}
      >
        {order === 'asc' ? (
          <SortAscendingOutlined />
        ) : (
          <SortDescendingOutlined />
        )}
      </a>
    );
  };

  const columns: TableColumnsType<DataType> = useMemo(() => {
    const orderParams = tableParams.order;
    const checkProps = (record: DataType) => {
      const disabled = disabledFills[record.singleFillId];
      const checked = !disabled && assignedFills.includes(record.singleFillId);
      return { checked, disabled };
    };
    const orderBy = (idx: number, order: 'desc' | 'asc' | null) => {
      setTableParams({ order: Object.assign(orderParams, { [idx]: order }) });
    };

    return [
      {
        title() {
          return (
            <>
              <span>单位</span>
              {sort(tableParams.order[0], order => orderBy(0, order))}
            </>
          );
        },
        dataIndex: 'orgName',
        filters: formatTreeData(orgTags?.data, true),
        filterMode: 'tree',
        filterSearch: true,
      },
      {
        title: '姓名',
        dataIndex: 'staffName',
        filters: formatTreeData(staffTags?.data, true),
        filterMode: 'tree',
        filterSearch: true,
      },
      {
        title: '试题编号',
        dataIndex: 'fillIndex',
        render: (text, record) => (
          <FillDetail
            task={task}
            singleFillId={record.singleFillId}
            action={
              <Circle
                style={{ display: 'inline-block', cursor: 'pointer' }}
                value={text}
              />
            }
            customTitle="试题详情"
            showType={DetailShowTypeEnum.Check}
          />
        ),
        width: '18%',
        align: 'center',
      },
      {
        title() {
          return (
            <>
              <span>已分配专家</span>
              {sort(tableParams.order[1], order => orderBy(1, order))}
            </>
          );
        },
        dataIndex: 'expertCount',
        width: '18%',
        align: 'center',
      },
      {
        title: '选择',
        render: (text, record) => (
          <Checkbox
            {...checkProps(record)}
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
        width: '10%',
        align: 'center',
      },
    ];
  }, [
    assignedFills,
    assignedFillExperts,
    orgTags,
    staffTags,
    tableParams,
    disabledFills,
    evaluateType,
  ]);

  // 已分配
  const allowFillColumns: TableColumnsType<ListReviewAssignByFillResponse> =
    useMemo(() => {
      return [
        {
          title: '单位',
          dataIndex: 'orgName',
          filters: formatTreeData(orgTags?.data, true),
          filterMode: 'tree',
          filterSearch: true,
          width: '15%',
        },
        {
          title: '姓名',
          dataIndex: 'staffName',
          filters: formatTreeData(staffTags?.data, true),
          filterMode: 'tree',
          filterSearch: true,
          width: '15%',
        },
        {
          title: '试题编号',
          dataIndex: 'fillIndex',
          width: '10%',
          render: (text, record) => (
            <FillDetail
              task={task}
              singleFillId={record.singleFillId}
              action={
                <Circle
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                  value={text}
                />
              }
              customTitle="试题详情"
              showType={DetailShowTypeEnum.Check}
            />
          ),
          align: 'center',
        },
        {
          title: '已分配专家',
          dataIndex: 'assignedExpertLength',
          width: '10%',
          render: (text, record) => (
            <>
              <a>{record.assignedExperts?.length}</a> 位
            </>
          ),
          align: 'center',
        },
        {
          title: '专家列表',
          dataIndex: 'assignedExperts',
          render: (text, record) =>
            text.map((t: any) => {
              const key = [t.expertId, record.singleFillId].join(',');
              return (
                <Checkbox
                  checked={delAssignedFills.includes(key)}
                  key={key}
                  onChange={e => {
                    setDelAssignedFills(
                      e.target.checked
                        ? [...delAssignedFills, key]
                        : delAssignedFills.filter(item => item !== key)
                    );
                  }}
                >
                  {t.expertName} {t.cellphone}
                </Checkbox>
              );
            }),
        },
      ];
    }, [delAssignedFills]);

  const overview = (
    <div
      className={cn('border', {
        'w-80': evaluateType === 'questionsToExperts',
      })}
    >
      <div className="bg-slate-300 p-3">总揽</div>
      <div
        className={cn(
          'grid p-3',
          evaluateType === 'questionsToExperts' ? 'grid-cols-3' : 'grid-cols-6'
        )}
      >
        <div className="text-center">
          <div className="bg-slate-200">专家总数</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.totalExpertCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-slate-200">已分配专家</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.assignedExpertCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-slate-200">未分配专家</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.unassignedExpertCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-slate-200">试题总数</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.totalSingleFillCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-slate-200">已分配试题</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.assignedSingleFillCount || 0}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-slate-200">未分配试题</div>
          <div className="bg-slate-100">
            {reviewAssignOverview?.data.unassignedSingleFillCount || 0}
          </div>
        </div>
      </div>
    </div>
  );

  const selectExperts = (
    <div
      className="flex flex-col gap-5 px-5 max-h-[31rem] overflow-auto"
      style={{ width: '0', flex: 'auto' }}
    >
      <TreeSelect
        style={{ width: '200px' }}
        value={expertTags}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={formatTreeData(expertTagList?.data, true)}
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
            全选 (已选: {validSelectedExpert.length} 人)
          </Checkbox>
        )}
        <Checkbox.Group
          options={plainOptions}
          value={validSelectedExpert}
          onChange={onChange}
          className="grid grid-cols-1"
        />
      </div>
    </div>
  );

  const fillTable = (
    <Table<DataType>
      size="small"
      scroll={{ y: '450px', x: '100%' }}
      className="flex-none"
      style={{ width: '70%' }}
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
  );

  const actions = (
    <div className="flex justify-center p-2 gap-5">
      <Button
        color="danger"
        variant="outlined"
        onClick={() => setAssignedFills([])}
      >
        清空全部已选
      </Button>
      <Button
        type="default"
        onClick={() => {
          setAssignedFills([
            ...new Set([
              ...assignedFills,
              ...(listFillsByTaskPage?.data.map(t => t.singleFillId) || []),
            ]),
          ]);
        }}
      >
        全选当页
      </Button>
      <Button
        type={
          validSelectedExpert.length && validSelectedFills.length
            ? 'primary'
            : 'default'
        }
        onClick={() =>
          validSelectedExpert.length &&
          validSelectedFills.length &&
          saveReviewAssignAdd()
        }
      >
        分配已选
        {validSelectedFills.length && validSelectedExpert.length
          ? evaluateType === 'questionsToExperts'
            ? validSelectedFills.length
              ? ` (${validSelectedFills.length})`
              : ''
            : validSelectedExpert.length
              ? ` (${validSelectedExpert.length})`
              : ''
          : ''}
      </Button>
    </div>
  );

  // 专家分配试题面板
  const expertPanel = (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5">
        {overview}
        <div className="flex flex-col gap-2 w-80 border">
          <div className="bg-slate-300 p-3">已分配专家详情/删除已分配</div>
          <div className="h-80 w-full p-x overflow-auto">
            <Tree
              height={320}
              checkedKeys={delAssignedFills}
              onCheck={(keys: any) => setDelAssignedFills(keys)}
              treeData={treeData}
              // defaultExpandAll
              style={{
                flexShrink: 1,
                // marginRight: '10%',
              }}
              checkable
            />
          </div>
          <div className="flex p-2 justify-center">
            <Button
              type={delAssignedFills.length ? 'primary' : 'default'}
              onClick={delOk}
              loading={reviewAssignDeleteLoading}
            >
              删除已选
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className={cn('w-auto text-center flex flex-row')}>
          {selectExperts}
          {fillTable}
        </div>
        {actions}
      </div>
    </div>
  );

  const tips = `操作说明:
【方法1】选择一套试题，再选择一位或多位专家后点击"分配"实现为一套试题分配专家。
【方法1】选择多套试题，再选择一位或多位专家后点击“分配"实现为多套试题同时分配多位相同的专家。
特别说明:翻页后会保存当页所选`;

  // 试题分配专家面板
  const questionPanel = (
    <div>
      <div>{overview}</div>
      <div className="flex items-end mt-3 mb-3">
        <div className="mr-auto">已分配试题详情/删除已分配</div>
        <Button
          type={delAssignedFills.length ? 'primary' : 'default'}
          onClick={delOk}
          loading={reviewAssignDeleteLoading}
        >
          删除已选
        </Button>
      </div>
      <div>
        <Table<ListReviewAssignByFillResponse>
          size="small"
          scroll={{ y: '450px', x: '100%' }}
          columns={allowFillColumns}
          dataSource={listReviewAssignByFill?.data || []}
          loading={listReviewAssignByFillLoading}
          pagination={{
            total: listReviewAssignByFill?.total,
            showSizeChanger: true,
            showQuickJumper: true,
            current: assignFillTableParams.pagination.current,
            pageSize: assignFillTableParams.pagination.pageSize,
            showTotal: total => `总共 ${total} 条`,
          }}
          onChange={(pagination, filters) =>
            setAssignFillTableParams({ pagination, filters })
          }
        />
      </div>
      <div className="flex items-end mt-3 mb-3">
        <div className="mr-auto">
          <Tooltip
            overlayStyle={{ maxWidth: 'max-content' }}
            title={<div className="whitespace-pre">{tips}</div>}
          >
            <span>分配(增量分配) </span>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      </div>
      <div className="flex gap-5">
        {fillTable}
        {selectExperts}
      </div>
      {actions}
    </div>
  );

  return (
    <>
      {contextHolder}
      {messageContextHolder}
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
                setDelAssignedFills([]);
                setAssignedExperts([]);
                setAssignedFills([]);
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
          {evaluateType === 'questionsToExperts' && expertPanel}
          {evaluateType === 'expertsToQuestions' && questionPanel}
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
