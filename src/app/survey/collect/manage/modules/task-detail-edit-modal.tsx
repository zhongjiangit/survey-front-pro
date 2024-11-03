'use client';

import { PublishTypeEnum } from '@/interfaces/CommonType';
import { Checkbox, DatePicker, Divider, Form, Modal, Select, Tree } from 'antd';
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
  const [form] = Form.useForm();

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  const plainOptions = [1, 2, 3, 4];

  const indeterminate = useMemo(() => {
    const checkedList = form.getFieldValue('orgs');
    return checkedList?.length > 0 && checkedList?.length < plainOptions.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('orgs'), plainOptions.length]);

  const onCheckAllChange = (e: any) => {
    console.log(e);

    form.setFieldValue('orgs', e.target.checked ? plainOptions : []);
  };

  const checkAll = useMemo(() => {
    return plainOptions.length === form.getFieldValue('orgs')?.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('orgs')]);

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
        labelCol={{ span: 7 }}
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue('publishType') === PublishTypeEnum.Org,
          }),
        ]}
      >
        <Checkbox.Group
          options={[
            { label: '市', value: '1' },
            { label: '区', value: '2' },
            { label: '校', value: '3' },
          ]}
        ></Checkbox.Group>
      </Form.Item>
      <span> 分配第一个所选层级的参与单位：</span>
      <Select
        mode="multiple"
        style={{ width: '50%' }}
        // onChange={handleChange}
        options={[
          { label: 'aaaaa', value: '1' },
          { label: 'bbbbb', value: '2' },
          { label: 'ccccc', value: '3' },
          { label: 'ddddd', value: '4' },
        ]}
      />
      <div className="mr-5 text-blue-400 text-right">已选：4单位</div>
      <Divider></Divider>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        全选
      </Checkbox>
      <Form.Item name="orgs" label="">
        <Checkbox.Group
          options={[
            { label: 'aaaaa单位', value: '1' },
            { label: 'bbbbb单位', value: '2' },
            { label: 'ccccc单位', value: '3' },
            { label: 'ddddd单位', value: '4' },
          ]}
        ></Checkbox.Group>
      </Form.Item>
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
        title="修改任务"
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
                      format="YYYY-MM-DD HH:mm"
                      showTime={{ format: 'HH:mm' }}
                      style={{ width: '90%' }}
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
    </>
  );
};

export default TaskDetailEditModal;
