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
import React, { useMemo, useState } from 'react';
import { treeData } from '../../testData';
const { RangePicker } = DatePicker;

interface TaskDetailEditModalProps {
  type: PublishTypeEnum;
}

const TaskDetailEditModal: React.FC<TaskDetailEditModalProps> = ({
  type,
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

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  const { data: listVisibleLevels } = useRequest(
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
      refreshDeps: [currentSystem, currentOrg],
    }
  );

  const { data: listLevelAssignSub, run: getListLevelAssignSub } = useRequest(
    (index: number) => {
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
      refreshDeps: [currentSystem, currentOrg, filterValue],
    }
  );

  const plainOptions = useMemo(
    () => listLevelAssignSub?.data.map(item => item.orgId) || [],
    [listLevelAssignSub]
  );

  const onCheckAllChange = (e: any) => {
    console.log(e);

    form.setFieldValue('orgs', e.target.checked ? plainOptions : []);
  };

  const onFilterChange = (value: string[]) => {
    console.log(value);
    setFilterValue(value);
  };

  const { data: tagList } = useRequest(
    () => {
      if (!currentSystem || !currentOrg) {
        return Promise.reject('No current system');
      }
      return Api.getTagList({
        currentSystemId: currentSystem?.systemId!,
        tagType: type,
      });
    },
    {
      refreshDeps: [currentSystem, currentOrg],
    }
  );

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
        修改
      </a>
      <Modal
        width={1400}
        open={open}
        title="修改抽检任务"
        okText="确定"
        cancelText="取消"
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
          onClick: () => form.submit(),
        }}
        onCancel={() => setOpen(false)}
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
                  {type === PublishTypeEnum.Org ? OrgSelect : MemberSelect}
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
