'use client';

import Api from '@/api';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { formatTreeData } from '@/lib/format-tree-data';
import { PublishTypeEnum } from '@/types/CommonType';
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
  Select,
  Tooltip,
  Tree,
  TreeSelect,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { treeData } from '../../testData';
const { RangePicker } = DatePicker;

interface TaskDetailEditModalProps {
  linkName?: string;
  record: any;
  refreshList: () => void;
}

const TaskDetailEditModal: React.FC<TaskDetailEditModalProps> = ({
  linkName,
  record,
  refreshList,
}: TaskDetailEditModalProps) => {
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [form] = Form.useForm();
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [checkAll, setCheckAll] = useState(false);
  const [orgSelectedNum, setOrgSelectedNum] = useState<number>(0);
  const [indeterminate, setIndeterminate] = useState(false);

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
        setOpen(false);
        refreshList();
        setCheckAll(false);
      },
    }
  );

  const { data: listLevelAssignSub, run: getListLevelAssignSub } = useRequest(
    (index?: number) => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listLevelAssignSub({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
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

  const { run: getInspTaskFill } = useRequest(
    taskId => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getInspTaskFill({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
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
            dayjs(data.data.beginTimeFillEstimate, 'YYYY-MM-DD HH:mm:ss'),
            dayjs(data.data.endTimeFillEstimate, 'YYYY-MM-DD HH:mm:ss'),
          ],
        };
        getListLevelAssignSub(initValues?.levels?.[0] ?? 1);
        form.setFieldsValue(initValues);
      },
    }
  );

  const { data: listVisibleLevels, run: getListVisibleLevels } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.listVisibleLevels({
        currentSystemId: currentSystem?.systemId!,
        currentOrgId: currentOrg?.orgId!,
        // TODO orgId是什么？
        orgId: currentOrg?.orgId!,
      });
    },
    {
      manual: true,
    }
  );

  const { data: tagList, run: getTagList } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getTagList({
        currentSystemId: currentSystem?.systemId!,
        tagType: record.publishType,
      });
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (open) {
      getInspTaskFill(record.taskId);
      getListVisibleLevels();
      getTagList();
    }
  }, [open]);

  const onCreate = (values: any) => {
    const createDate: any = {
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId!,
      taskId: record.taskId,
      beginTimeFillEstimate: values.timeFillEstimate[0].format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      endTimeFillEstimate: values.timeFillEstimate[1].format(
        'YYYY-MM-DD HH:mm:ss'
      ),
    };
    delete createDate.timeFillEstimate;
    if (record.publishType === PublishTypeEnum.Org) {
      createDate.levels = values.levels?.map((item: string) => ({
        levelIndex: Number(item),
      }));
      createDate.orgs = values.orgs?.map((item: string) => ({
        orgId: Number(item),
      }));
    }
    updateInspTaskFill(createDate);
  };

  const plainOptions = useMemo(
    () => listLevelAssignSub?.data.map(item => item.orgId) || [],
    [listLevelAssignSub]
  );

  const onCheckAllChange = (e: any) => {
    form.setFieldValue('orgs', e.target.checked ? plainOptions : []);
    setCheckAll(e.target.checked);
  };

  const onFilterChange = (value: string[]) => {
    console.log(value);
    setFilterValue(value);
  };

  const showConfirm = () => {
    // TODO 之前所选单位是不是为空，，不为空则需要确认。
    modal.confirm({
      title: '过滤条件确认',
      icon: <ExclamationCircleFilled />,
      content: <>改变过滤条件之后，之前的选择将会清空，确认改变过滤条件？</>,
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
        onFilterChange([]);
      },
    });
  };

  const MemberSelect = (
    <div>
      <div className="w-full flex justify-start items-center">
        <span>人员标签过滤：</span>
        <div
          className="flex flex-1 justify-between items-center"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Select
            mode="multiple"
            style={{ width: '40%' }}
            options={[
              { label: 'aaaaa', value: '1' },
              { label: 'bbbbb', value: '2' },
              { label: 'ccccc', value: '3' },
              { label: 'ddddd', value: '4' },
            ]}
          />
          <span
            style={{
              marginRight: '20px',
              color: 'red',
            }}
          >
            已选：12人
          </span>
        </div>
      </div>

      <Divider></Divider>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 40px 0 0',
        }}
      >
        <Tree
          checkable
          treeData={treeData[0]}
          defaultExpandAll
          style={{
            flexShrink: 1,
            // marginRight: '10%',
          }}
        />
        <Tree
          checkable
          treeData={treeData[1]}
          defaultExpandAll
          style={{
            flexShrink: 1,
            // marginRight: '10%',
          }}
        />
        <Tree
          checkable
          treeData={treeData[2]}
          defaultExpandAll
          style={{
            flexShrink: 1,
            // marginRight: '10%',
          }}
        />
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
          onChange={value => {
            getListLevelAssignSub(value[0]);
          }}
          options={listVisibleLevels?.data.map(item => ({
            label: item.levelName,
            value: item.levelIndex,
          }))}
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
          onChange={onFilterChange}
          onBlur={showConfirm}
          treeData={formatTreeData([tagList?.data.tags])}
        />
      </div>

      <div className="mr-5 text-blue-400 text-right">
        已选：{orgSelectedNum}单位
      </div>
      <Divider></Divider>
      <div className="px-16">
        {!!listLevelAssignSub?.data.length && (
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        )}
        <Form.Item
          name="orgs"
          label=""
          rules={[{ required: true, message: '请选择单位' }]}
        >
          <Checkbox.Group
            onChange={checkedList => {
              setOrgSelectedNum(checkedList.length);
              setIndeterminate(
                !!checkedList.length &&
                  checkedList.length < (plainOptions?.length || 0)
              );
              setCheckAll(checkedList.length === plainOptions.length);
            }}
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
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        {linkName || '修改'}
      </a>
      <Modal
        width={1400}
        open={open}
        title="修改抽检任务"
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
          onClick: () => form.submit(),
        }}
        onCancel={() => {
          setOpen(false);
          setCheckAll(false);
          form.resetFields();
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
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ format: 'HH:mm:ss' }}
                      style={{ width: '40%' }}
                    />
                  </Form.Item>
                </div>
                <Divider orientation="left">分配详情</Divider>
                <div style={{ marginLeft: '20px' }}>
                  {record.publishType === PublishTypeEnum.Org
                    ? OrgSelect
                    : MemberSelect}
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

export default TaskDetailEditModal;
