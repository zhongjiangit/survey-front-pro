'use client';

import Api from '@/api';
import { ListVisibleLevelsResponse } from '@/api/system/listVisibleLevels';
import {
  getSelectedNum,
  membersToNode,
  selectMember,
  updateTreeDataV2,
} from '@/app/(survey)/check/manage/modules/utils';
import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { formatTreeData } from '@/lib/format-tree-data';
import {
  ModalType,
  PublishTypeEnum,
  TagTypeEnum,
  TagTypeType,
  ZeroOrOneTypeEnum,
} from '@/types/CommonType';
import {
  ExclamationCircleFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Modal,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { treeSelectToChecked } from '@/lib/utils';
const { RangePicker } = DatePicker;

interface TaskDetailEditModalProps {
  linkName?: string;
  record: any;
  type: ModalType;
  refreshList: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const TaskDetailEditModal: React.FC<TaskDetailEditModalProps> = ({
  linkName,
  record,
  type,
  refreshList,
  open,
  setOpen,
}: TaskDetailEditModalProps) => {
  const [modal, contextHolder] = Modal.useModal();
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [form] = Form.useForm();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [levelOrgs, setLevelOrgs] = useState<any[]>([]);
  const [levelOrgList, setLevelOrgList] = useState<any[]>([]);
  const [orgMembers, setOrgMembers] = useState<any>({});
  const [task, setTask] = useState<any>(null);
  const [member, setMember] = useState<any>([]);

  const assignTaskToMember = useMemo(
    () =>
      record.publishType === PublishTypeEnum.Member ||
      (record.publishType === PublishTypeEnum.Org &&
        task?.isLowest === ZeroOrOneTypeEnum.One),
    [record.publishType, task?.isLowest]
  );

  // 是否分配任务
  const isAllocate = useMemo(
    () => record.createOrgId !== currentOrg?.orgId,
    [record, currentOrg]
  );

  const changeFilterValue = (value: string[]) => {
    // hack 查询需要依赖及时更新的标签数据
    filterValue.length = 0;
    filterValue.push(...value);
    setFilterValue(value);
  };

  useMemo(() => {
    setLevelOrgList(
      (isAllocate ? levelOrgs.slice(0, 1) : levelOrgs).map(t =>
        updateTreeDataV2(t, orgMembers)
      )
    );
  }, [levelOrgs, orgMembers, isAllocate]);

  const { run: updateInspTaskFill } = useRequest(
    values => {
      return Api.updateInspTaskFill({
        ...values,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        form.resetFields();
        setOpen!(false);
        refreshList();
      },
    }
  );

  const { data: listLevelAssignSub, run: getListLevelAssignSub } = useRequest(
    (index: number) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listLevelAssignSub({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        levelIndex: index || 1,
        tags: filterValue.map(item => ({
          key: Number(item),
        })),
      });
    },
    {
      manual: true,
    }
  );

  const { data: inspTaskFill, run: getInspTaskFill } = useRequest(
    (taskId: number) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getInspTaskFill({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        taskId: taskId,
      });
    },
    {
      manual: true,
      onSuccess: data => {
        const initValues = {
          levels: data.data.levels?.map(level => level.levelIndex),
          orgs: data.data.orgs?.map(org => org.orgId),
          timeFillEstimate: [
            dayjs(data.data.beginTimeFillEstimate, 'YYYY-MM-DD HH:mm'),
            dayjs(data.data.endTimeFillEstimate, 'YYYY-MM-DD HH:mm'),
          ],
        };
        form.setFieldsValue(initValues);
        setTask(data.data);
      },
    }
  );

  const { data: listVisibleLevels, runAsync: getListVisibleLevels } =
    useRequest(
      () => {
        if (!currentSystem || !currentOrg) {
          return Promise.reject('No current system');
        }
        return Api.listVisibleLevels({
          currentSystemId: currentSystem.systemId!,
          currentOrgId: currentOrg.orgId!,
          orgId: currentOrg.orgId!,
        });
      },
      {
        manual: true,
      }
    );

  const { data: tagList, run: getTagList } = useRequest(
    (tagType: TagTypeType) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getTagList({
        currentSystemId: currentSystem.systemId!,
        tagType: tagType,
        showUntagged: 1,
      });
    },
    {
      manual: true,
    }
  );
  const tagTreeData = useMemo(
    () => formatTreeData(tagList?.data, true),
    [tagList]
  );
  // 获取人员分配的所有单位
  const {
    data: listAllAssignSub,
    run: getListAllAssignSub,
    loading: allAssignSubLoading,
  } = useRequest(
    () => {
      console.log('getListAllAssignSub');

      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listAllAssignSub({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        staffTags: filterValue.map(item => ({
          key: Number(item),
        })),
      }).then(res => res.data);
    },
    {
      manual: true,
      onSuccess: data => {
        setLevelOrgs(
          data.map(level =>
            level.orgs.map(org => ({
              ...org,
              title: `${org.orgName} (共${org.staffCount}人)`,
              key: org.orgId,
              disableCheckbox: org.staffCount === 0,
              isLeaf: false,
            }))
          )
        );
      },
    }
  );

  const onCreate = (values: any) => {
    const createDate: any = {
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId!,
      taskId: record.taskId,
      beginTimeFillEstimate:
        values.timeFillEstimate[0].format('YYYY-MM-DD HH:mm'),
      endTimeFillEstimate:
        values.timeFillEstimate[1].format('YYYY-MM-DD HH:mm'),
    };
    delete createDate.timeFillEstimate;
    // 下发到部门
    if (assignTaskToMember) {
      // 下发到人
      createDate.staffs = member?.map((item: string) => ({
        staffId: Number(item),
      }));
      createDate.staffTags = filterValue?.map((item: string) => ({
        key: item,
      }));
    } else {
      createDate.levels = values.levels?.map((item: string) => ({
        levelIndex: Number(item),
      }));
      createDate.orgs = values.orgs?.map((item: string) => ({
        orgId: Number(item),
      }));
      createDate.orgTags = filterValue?.map((item: string) => ({
        key: item,
      }));
    }

    updateInspTaskFill(createDate);
  };

  const plainOptions = useMemo(
    () => listLevelAssignSub?.data.map(item => item.orgId) || [],
    [listLevelAssignSub]
  );

  // 不是创建单位
  const noCreateDept = useMemo(
    () => inspTaskFill?.data.createOrgId !== currentOrg?.orgId,
    [inspTaskFill, currentOrg]
  );

  const getLeveList = (task?: any, levels?: ListVisibleLevelsResponse[]) => {
    const list = (levels || []).slice(1);
    return list.slice(
      list.findIndex(t =>
        task.levels.some((f: any) => f.levelIndex === t.levelIndex)
      )
    );
  };
  const levelList = useMemo(
    () => getLeveList(task, listVisibleLevels?.data),
    [listVisibleLevels, isAllocate]
  );

  const onCheckAllChange = (e: any) => {
    form.setFieldValue('orgs', e.target.checked ? plainOptions : []);
  };

  /**
   * 标签切换确认
   * @param nodes
   */
  const showConfirm = (nodes: any[]) => {
    const value = nodes;
    const onOk = () => {
      changeFilterValue(value);
      setMember([]);
      setOrgMembers({});
      form.setFieldValue('orgs', []);
      if (!assignTaskToMember) {
        getListLevelAssignSub(form.getFieldValue('levels')?.[0]);
      }
      if (assignTaskToMember) {
        getListAllAssignSub();
      }
    };
    // 如果未选择就无需确认
    if (!member.length && !form.getFieldValue('orgs')?.length) {
      onOk();
      return;
    }
    modal.confirm({
      title: '过滤条件确认',
      icon: <ExclamationCircleFilled />,
      content: <>改变过滤条件之后，之前的选择将会清空，确认改变过滤条件？</>,
      onOk() {
        onOk();
      },
    });
  };

  const getOrgMembers = async (key: number | string) => {
    orgMembers[key] = [];
    const res = await Api.getStaffListByTags({
      currentSystemId: currentSystem?.systemId,
      currentOrgId: currentOrg?.orgId,
      orgId: Number(key),
      tags: filterValue.map(item => ({
        key: Number(item),
      })),
    });
    const members = membersToNode(res.data);
    setOrgMembers((t: any) => ({ ...t, [key]: members }));
    return members;
  };

  const onLoadMember = async (node: CustomTreeDataNode) => {
    const { key, children } = node;
    if (children) {
      return;
    }
    // Hack 防止重复加载
    node.children = [];
    return await getOrgMembers(key as number);
  };

  const onSelectMember = async (
    checkedKeys: any,
    { checked, node }: { checked: boolean; node: any }
  ) => {
    setMember(await selectMember(member, checked, node, getOrgMembers));
  };
  const titleRender = (nodeData: any) => {
    return nodeData.isLeaf
      ? nodeData.title
      : `${nodeData.orgName} (共${getSelectedNum(member, nodeData.children || [])}/${nodeData.staffCount}人)`;
  };

  useEffect(() => {
    if (!task) {
      getInspTaskFill(record.taskId);
      return;
    }
    const filterValue =
      (!assignTaskToMember ? task.orgTags : task.staffTags)?.map(
        (item: any) => item.key
      ) || [];
    changeFilterValue(filterValue);

    if (assignTaskToMember) {
      setMember(task.staffs.map((item: { staffId: number }) => item.staffId));

      getTagList(TagTypeEnum.Member);
      getListAllAssignSub();
      const p = Promise.resolve();
      // 获取已选部门人员列表
      for (const orgId of [
        ...new Set<number>(
          task.staffs.map((item: { orgId: number }) => item.orgId)
        ),
      ]) {
        p.then(() => getOrgMembers(orgId));
      }
    }
    if (!assignTaskToMember) {
      getListVisibleLevels().then(res => {
        // 获取要查询的单位层级 分配只能选下级层级
        getListLevelAssignSub(getLeveList(task, res.data)[0].levelIndex);
      });
      getTagList(TagTypeEnum.Org);
    }
  }, [task]);

  const MemberSelect = (
    <div>
      <div className="w-full flex justify-start items-center">
        <span>人员标签过滤：</span>
        <div
          className="flex flex-1 justify-between items-center"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <TreeSelect
            style={{ width: '40%' }}
            value={filterValue}
            onChange={showConfirm}
            treeData={tagTreeData}
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="选择标签过滤人员"
          />
          <span
            style={{
              marginRight: '20px',
              color: 'red',
            }}
          >
            已选：{member.length}人
          </span>
        </div>
      </div>

      <Divider></Divider>
      <div
        key={filterValue.join(',')}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 40px 0 0',
        }}
      >
        {levelOrgList?.map((level: any, index: number) => (
          <div key={index} style={{ flex: 'auto', width: '0px' }}>
            <div className="font-bold">
              {listAllAssignSub?.[index]?.levelName}
            </div>
            <Tree
              height={360}
              treeData={level}
              checkedKeys={member}
              loadData={onLoadMember}
              checkable
              defaultExpandAll
              onCheck={onSelectMember}
              style={{ flexShrink: 1 }}
              titleRender={titleRender}
              onClick={e => treeSelectToChecked(e.nativeEvent)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const OrgSelect = (
    <>
      <Form.Item
        name="levels"
        label="任务分配路径（任务下放经由层级）"
        dependencies={['publishType']}
        labelCol={{ span: 5 }}
        tooltip="分配第一个所选层级的参与单位"
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('publishType') === PublishTypeEnum.Org,
          }),
        ]}
      >
        <Checkbox.Group
          disabled={true}
          onChange={value => {
            getListLevelAssignSub(value[0]);
            form.setFieldValue('orgs', []);
          }}
          //listVisibleLevels剔除数组中的第一个元素
          options={
            levelList.map(item => ({
              label: item.levelName,
              value: item.levelIndex,
            })) || []
          }
        ></Checkbox.Group>
      </Form.Item>
      <div className="flex items-center mx-16">
        <div className="flex flex-nowrap items-center gap-1 w-24">
          {' '}
          单位过滤{' '}
          <Tooltip placement="top" title={'分配第一个所选层级的参与单位：'}>
            <QuestionCircleOutlined className="cursor-pointer" />
          </Tooltip>{' '}
          <span>：</span>
        </div>
        <TreeSelect
          style={{ width: '40%' }}
          value={filterValue}
          onChange={showConfirm}
          treeData={tagTreeData}
          treeCheckable={true}
          showCheckedStrategy={TreeSelect.SHOW_PARENT}
        />
      </div>

      <div className="mr-5 text-blue-400 text-right">
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.orgs !== curValues.orgs
          }
        >
          {() => {
            return `已选：${form.getFieldValue('orgs')?.length} 单位`;
          }}
        </Form.Item>
      </div>
      <Divider></Divider>
      <div className="px-16">
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, curValues) =>
            prevValues.orgs !== curValues.orgs
          }
        >
          {() => {
            if (!listLevelAssignSub?.data.length) {
              return null;
            }
            const checkedList = form.getFieldValue('orgs') || [];
            const indeterminate =
              !!checkedList.length &&
              checkedList.length < (plainOptions?.length || 0);
            const checkedAll = checkedList.length === plainOptions.length;
            return (
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkedAll}
              >
                全选
              </Checkbox>
            );
          }}
        </Form.Item>
        <Form.Item name="orgs" label="">
          <Checkbox.Group
            options={listLevelAssignSub?.data.map(item => ({
              label: item.orgName,
              value: item.orgId,
            }))}
          ></Checkbox.Group>
        </Form.Item>
      </div>
    </>
  );

  return (
    <>
      <Modal
        width={1400}
        open={open}
        title={`${type}抽检任务`}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        okButtonProps={{
          autoFocus: true,
          onClick: () => form.submit(),
        }}
        onCancel={() => {
          setOpen!(false);
        }}
      >
        <Form
          form={form}
          name="form_new_task_modal"
          onFinish={values => onCreate(values)}
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  border: '1px',
                  width: '100%',
                }}
              >
                <div className="px-10">
                  <Form.Item
                    name="timeFillEstimate"
                    label="任务起止时间"
                    rules={[{ required: true }]}
                  >
                    <RangePicker
                      disabled={noCreateDept}
                      format="YYYY-MM-DD HH:mm"
                      showTime={{
                        format: 'HH:mm',
                        defaultValue: [
                          dayjs('09:00', 'HH:mm'),
                          dayjs('09:00', 'HH:mm'),
                        ],
                      }}
                      style={{ width: '40%' }}
                    />
                  </Form.Item>
                </div>
                <Divider orientation="left">分配详情</Divider>
                <div style={{ marginLeft: '20px' }}>
                  {!assignTaskToMember ? OrgSelect : MemberSelect}
                </div>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

// export default TaskDetailEditModal;
const TaskDetailEditBtn: React.FC<TaskDetailEditModalProps> = ({
  linkName,
  record,
  type,
  refreshList,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(!open);
        }}
      >
        {linkName || '修改'}
      </a>
      {open && (
        <TaskDetailEditModal
          key={record.taskId}
          record={record}
          type={type}
          refreshList={refreshList}
          linkName={linkName}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  );
};
export default TaskDetailEditBtn;
