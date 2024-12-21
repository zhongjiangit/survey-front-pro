'use client';

import Api from '@/api';
import { CreateInspTaskParamsType } from '@/api/task/createInspTask';
import {
  getSelectedNum,
  membersToNode,
  selectMember,
  updateTreeDataV2,
} from '@/app/(survey)/check/manage/modules/utils';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { formatTreeData } from '@/lib/format-tree-data';
import {
  publishTypeEnum,
  PublishTypeEnum,
  TagTypeEnum,
  TagTypeType,
  TemplateTypeEnum,
} from '@/types/CommonType';
import {
  CloseCircleOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Tree,
  TreeSelect,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface TaskEditModalProps {
  refreshMyPublishTask?: () => void;
  setOpen: (open: boolean) => void;
}

interface FormItemWrapProps {
  id?: string;
  ref?: React.RefObject<HTMLInputElement>;
  value?: any;
  onChange?: (...arg: any[]) => void;
  renderChildren: (arg: any) => React.ReactNode;
}
const FormItemWrap: React.FC<FormItemWrapProps> = ({
  id,
  ref,
  value,
  onChange,
  renderChildren,
}) => {
  return renderChildren({ id, ref, value, onChange });
};
const TaskAddNewModal: React.FC<TaskEditModalProps> = ({
  refreshMyPublishTask,
  setOpen,
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const [templateId, setTemplateId] = useState<number>();
  const [filterValue, _setFilterValue] = useState<string[]>([]);
  const [levelOrgs, setLevelOrgs] = useState<any[]>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [levelOrgList, setLevelOrgList] = useState<any[]>([]);
  const [orgMembers, setOrgMembers] = useState<any>({});
  const [member, setMember] = useState<any[]>([]);

  const setFilterValue = (value: string[]) => {
    // hack 查询需要依赖及时更新的标签数据
    filterValue.length = 0;
    filterValue.push(...value);
    _setFilterValue(value);
  };
  // 人员部门树数据
  useMemo(() => {
    setLevelOrgList(levelOrgs.map(t => updateTreeDataV2(t, orgMembers)));
  }, [levelOrgs, orgMembers]);

  const { data: checkList, loading: checkListLoading } = useRequest(
    () => {
      if (!currentSystem) {
        return Promise.reject('No current system');
      }
      return Api.getTemplateOutlineList({
        currentSystemId: currentSystem.systemId!,
        templateType: TemplateTypeEnum.Check,
      });
    },
    {
      refreshDeps: [currentSystem],
    }
  );

  const { data: listVisibleLevels } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listVisibleLevels({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        // TODO orgId是什么？
        orgId: currentOrg.orgId!,
      }).then(res => res.data.slice(1));
    },
    {
      refreshDeps: [currentSystem, currentOrg],
    }
  );

  const { data: listLevelAssignSub, run: getListLevelAssignSub } = useRequest(
    (index: number | null) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listLevelAssignSub({
        currentSystemId: currentSystem.systemId!,
        currentOrgId: currentOrg.orgId!,
        // TODO orgId 是1时查不出来数据
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
        const levelOrgs = data.map(level =>
          level.orgs.map(org => ({
            ...org,
            title: `${org.orgName} (共${org.staffCount}人)`,
            key: org.orgId,
            disableCheckbox: org.staffCount === 0,
            isLeaf: false,
          }))
        );
        setLevelOrgs(levelOrgs);
      },
    }
  );

  const { data: tagList, run: getTagList } = useRequest(
    (type?: TagTypeType) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getTagList({
        currentSystemId: currentSystem.systemId!,
        tagType: type || 1,
      });
    },
    {
      manual: true,
    }
  );

  const { run: createInspTask, loading: submitLoading } = useRequest(
    (values: CreateInspTaskParamsType) => {
      return Api.createInspTask({
        ...values,
      });
    },
    {
      manual: true,
      onSuccess: () => {
        setOpen(false);
        form.resetFields();
        refreshMyPublishTask?.();
      },
    }
  );

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log('changedValues', changedValues);
    if (changedValues?.publishType) {
      setFilterValue([]);
      setOrgMembers({});
      setMember([]);
      form.setFieldsValue({ orgs: [], levels: [] });
    }
    if (changedValues?.publishType === publishTypeEnum.Level) {
      getTagList(TagTypeEnum.Org);
      getListLevelAssignSub(null);
    } else if (changedValues?.publishType === publishTypeEnum.Staff) {
      getTagList(TagTypeEnum.Member);
      getListAllAssignSub();
    } else if (changedValues?.levels) {
      getListLevelAssignSub(changedValues?.levels?.[0]);
      form.setFieldsValue({ orgs: [] });
    }
  };

  const onCreate = (values: any) => {
    const createDate: any = {
      ...values,
      maxFillCount: values.maxFillCount || 0,
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId!,
      beginTimeFillEstimate:
        values.timeFillEstimate[0].format('YYYY-MM-DD HH:mm'),
      endTimeFillEstimate:
        values.timeFillEstimate[1].format('YYYY-MM-DD HH:mm'),
    };
    delete createDate.timeFillEstimate;
    if (values.publishType === PublishTypeEnum.Org) {
      createDate.levels = values.levels?.map((item: string) => ({
        levelIndex: Number(item),
      }));
      createDate.orgs = values.orgs?.map((item: string) => ({
        orgId: Number(item),
      }));
      createDate.orgTags = filterValue?.map((item: string) => ({
        key: item,
      }));
    } else if (values.publishType === PublishTypeEnum.Member) {
      // 任务分配到人 可以选择人或部门
      createDate.staffs = member.map((item: string) => ({
        staffId: Number(item),
      }));
      createDate.staffTags = filterValue?.map((item: string) => ({
        key: item,
      }));
    }
    createInspTask(createDate);
  };

  const plainOptions = useMemo(
    () => listLevelAssignSub?.data.map(item => item.orgId) || [],
    [listLevelAssignSub]
  );

  const onCheckAllChange = (e: any) => {
    form.setFieldValue('orgs', e.target.checked ? plainOptions : []);
  };

  const showPublishTypeConfirm = () => {
    // 如果未选择就无需确认
    if (!member.length && !form.getFieldValue('orgs')?.length) {
      return;
    }
    return new Promise((resolve, reject) => {
      modal.confirm({
        title: '确认任务分配方式',
        icon: <ExclamationCircleFilled />,
        content: (
          <>改变任务分配方式后，之前的选择将会清空，确认任务分配方式？</>
        ),
        onOk() {
          resolve(true);
        },
        onCancel() {
          reject(false);
        },
      });
    });
  };

  const showConfirm = (nodes: any[]) => {
    const value = nodes.map(t => t.value);
    console.log(value);
    const onOk = () => {
      setFilterValue(value);
      setOrgMembers({});
      setMember([]);
      form.setFieldValue('orgs', []);

      const publishType = form.getFieldValue('publishType');
      if (publishType === PublishTypeEnum.Org) {
        getListLevelAssignSub(form.getFieldValue('levels')?.[0]);
      }
      if (publishType === PublishTypeEnum.Member) {
        getListAllAssignSub();
      }
    };
    // 如果未选择就无需确认
    if (!member.length && !form.getFieldValue('orgs')?.length) {
      onOk();
      return;
    }
    // TODO 之前所选单位是不是为空，，不为空则需要确认。
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
      tags: filterValue.map<{ key: number }>(item => ({ key: Number(item) })),
    });
    const members = membersToNode(res.data);
    setOrgMembers((t: { [key: string]: any }) => ({ ...t, [key]: members }));
    return members;
  };

  const onLoadMember = async (node: CustomTreeDataNode) => {
    const { key, children } = node;
    if (children) {
      return;
    }
    node.children = [];
    if (!currentSystem || !currentOrg) {
      return Promise.reject('No current system');
    }
    await getOrgMembers(Number(key));
  };

  const onSelectMember = async (
    checkedKeys: any,
    { checked, node }: { checked: boolean; node: any }
  ) => {
    setMember(await selectMember(member, checked, node, getOrgMembers));
  };

  const renderTitle = (nodeData: any) =>
    nodeData.isLeaf
      ? nodeData.title
      : `${nodeData.orgName} (共${getSelectedNum(member, nodeData.children || [])}/${nodeData.staffCount}人)`;

  useEffect(() => {
    if (!listVisibleLevels) {
      return;
    }
    let publishType = PublishTypeEnum.Org;
    // 没有可选的层级 就下发到人
    if (listVisibleLevels && !listVisibleLevels.length) {
      publishType = PublishTypeEnum.Member;
    }
    form.setFieldValue('publishType', publishType);
    onValuesChange({ publishType }, {});
  }, [listVisibleLevels]);

  const MemberSelect = (
    <div>
      <div className="flex justify-between items-center pl-20">
        <div className="w-96 flex items-center">
          <span>人员过滤：</span>
          <TreeSelect
            className="w-72 flex-1"
            value={filterValue}
            onChange={showConfirm}
            treeData={formatTreeData([tagList?.data.tags])}
            treeCheckable={true}
            treeCheckStrictly={true}
            showCheckedStrategy={'SHOW_ALL'}
            placeholder="选择标签过滤人员"
          />
        </div>
        <div className="mr-5 text-right flex gap-4 items-center">
          <span className="text-blue-400">已选：{member.length}人</span>
          <span
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => setMember([])}
          >
            <CloseCircleOutlined /> 清空
          </span>
        </div>
      </div>
      <Divider style={{ marginBottom: '8px' }}></Divider>
      <div
        key={allAssignSubLoading ? '1' : '2'}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 40px 0 0',
        }}
        className="px-20"
      >
        <div key={filterValue.join(',')} className="flex gap-20 w-full">
          {levelOrgList?.map((level: any, index: number) => (
            <div
              className="border-b-card"
              key={index}
              style={{ flex: 'auto', width: '0px' }}
            >
              <div className="font-bold">
                {listAllAssignSub?.[index]?.levelName}
              </div>
              <Tree
                treeData={level}
                checkedKeys={member}
                loadData={onLoadMember}
                checkable
                defaultExpandAll
                onCheck={onSelectMember}
                style={{ flexShrink: 1 }}
                titleRender={renderTitle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const OrgSelect = (
    <>
      <Form.Item
        name="levels"
        label="任务分配路径（任务下放经由层级）"
        dependencies={['publishType']}
        labelCol={{ span: 7 }}
        tooltip="分配第一个所选层级的参与单位"
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('publishType') === PublishTypeEnum.Org,
          }),
        ]}
      >
        <Checkbox.Group
          options={listVisibleLevels?.map(item => ({
            label: item.levelName,
            value: item.levelIndex,
          }))}
        ></Checkbox.Group>
      </Form.Item>
      <div className="flex justify-between items-center pl-20">
        <div className="w-96 flex items-center">
          <span>单位过滤：</span>
          <TreeSelect
            className="w-72 flex-1"
            value={filterValue}
            onChange={showConfirm}
            treeData={formatTreeData([tagList?.data.tags])}
            treeCheckable={true}
            treeCheckStrictly={true}
            showCheckedStrategy={'SHOW_ALL'}
            placeholder="选择标签过滤单位"
          />
        </div>
        <Form.Item noStyle dependencies={['orgs']}>
          {() => {
            if (!listLevelAssignSub?.data.length) {
              return null;
            }
            const checkedList = form.getFieldValue('orgs') || [];
            return (
              <div className="mr-5 text-blue-400 text-right">
                已选：{checkedList.length} 单位
              </div>
            );
          }}
        </Form.Item>
      </div>

      <Divider></Divider>
      <div className="px-20">
        <Form.Item noStyle dependencies={['orgs']}>
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
        <Form.Item
          name="orgs"
          label=""
          rules={[{ required: true, message: '请选择单位' }]}
        >
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
        open={true}
        title="新建任务"
        okText="确定"
        cancelText="取消"
        destroyOnClose
        okButtonProps={{
          autoFocus: true,
          onClick: () => form.submit(),
        }}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        confirmLoading={submitLoading}
        modalRender={dom => (
          <Form
            form={form}
            name="form_new_task_modal"
            onFinish={values => onCreate(values)}
            onError={v => {
              console.log(v);
            }}
            onValuesChange={onValuesChange}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 24 }}
            style={{
              overflow: 'auto',
              margin: '30px 0',
            }}
            initialValues={{
              publishType: PublishTypeEnum.Org,
              maxFillCount: 1,
            }}
          >
            {dom}
          </Form>
        )}
      >
        <Row
          gutter={24}
          style={{
            marginRight: '40px',
          }}
        >
          <Col span={12}>
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="input" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="timeFillEstimate"
              label="任务起止时间"
              rules={[{ required: true }]}
            >
              <RangePicker
                format="YYYY-MM-DD HH:mm"
                showTime={{
                  format: 'HH:mm',
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="templateId"
              label="选择资料收集模板"
              rules={[{ required: true }]}
            >
              <Select
                loading={checkListLoading}
                onChange={e => {
                  setTemplateId(e);
                }}
                options={checkList?.data?.map(item => ({
                  label: item.templateTitle,
                  value: item.templateId,
                }))}
              ></Select>
            </Form.Item>
            {templateId && (
              <a className="text-blue-500 absolute top-9 left-56">
                <TemplateDetailModal
                  templateId={templateId}
                  TemplateType={TemplateTypeEnum.Check}
                />
              </a>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxFillCount"
              label="每位填报者可提交最多份数"
              extra={
                <span className="text-slate-500">
                  *当不输入值时，为不限份数
                </span>
              }
            >
              <InputNumber style={{ width: '100%' }} min={0}></InputNumber>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="description"
              label="任务描述"
              // rules={[{ required: true }]}
            >
              <Input.TextArea cols={3} placeholder="请输入任务描述" />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item name="publishType" label="分配方式">
              <FormItemWrap
                renderChildren={({ id, ref, value, onChange }) => (
                  <Radio.Group
                    id={id}
                    ref={ref}
                    value={value}
                    disabled={!listVisibleLevels?.length}
                    onChange={async (...arg) => {
                      await showPublishTypeConfirm();
                      onChange(...arg);
                    }}
                  >
                    <Radio value={PublishTypeEnum.Org}>任务分配到单位</Radio>
                    <Radio value={PublishTypeEnum.Member}>任务分配到人</Radio>
                  </Radio.Group>
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item noStyle dependencies={['publishType']}>
          {({ getFieldValue }) => {
            if (!listVisibleLevels) {
              return null;
            }
            return (
              <div className="flex justify-center">
                <div
                  style={{
                    width: '90%',
                  }}
                >
                  <Divider orientation="left">分配详情</Divider>
                  <div style={{ marginLeft: '20px' }}>
                    {getFieldValue('publishType') === PublishTypeEnum.Org
                      ? OrgSelect
                      : MemberSelect}
                  </div>
                </div>
              </div>
            );
          }}
        </Form.Item>
      </Modal>
      {contextHolder}
    </>
  );
};

const TaskAdd: React.FC<{ refreshMyPublishTask?: () => void }> = ({
  refreshMyPublishTask,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="absolute right-0 -top-14">
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        发布新任务
      </Button>
      {open && (
        <TaskAddNewModal
          refreshMyPublishTask={refreshMyPublishTask}
          setOpen={v => setOpen(v)}
        ></TaskAddNewModal>
      )}
    </div>
  );
};

export default TaskAdd;
