'use client';

import { PublishTypeEnum } from '@/interfaces/CommonType';
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
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { treeData } from '../../testData';
import TemplateDetailModal from '@/components/common/template-detail-modal';

interface TaskEditModalProps {}

interface Values {
  taskName?: string;
}

const TaskAddNewModal: React.FC<TaskEditModalProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const { RangePicker } = DatePicker;
  const onCreate = (values: Values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  const plainOptions = ['1', '2', '3', '4'];

  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      form.setFieldValue('orgs', plainOptions);
      setCheckAll(true);
    } else {
      form.setFieldValue('orgs', []);
      setCheckAll(false);
    }
  };

  useEffect(() => {
    const checkedList = form.getFieldValue('orgs');
    setIndeterminate(
      checkedList?.length > 0 && checkedList?.length < plainOptions.length
    );
    setCheckAll(plainOptions.length === form.getFieldValue('orgs')?.length);
  }, [form, plainOptions.length]);

  const MemberSelect = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Select
          mode="multiple"
          style={{ width: '60%' }}
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

      <Divider></Divider>
      <div className="mb-3 pl-6">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 40px 0 0',
        }}
      >
        <Tree
          checkable
          treeData={treeData}
          defaultExpandAll
          style={{
            flexShrink: 1,
            // marginRight: '10%',
          }}
        />
        <Tree
          checkable
          treeData={treeData}
          defaultExpandAll
          style={{
            flexShrink: 1,
            // marginRight: '10%',
          }}
        />
        <Tree
          checkable
          treeData={treeData}
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
    <div className="absolute right-0 -top-14">
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        发布新任务
      </Button>
      <Modal
        width={'70vw'}
        open={open}
        title="新建任务"
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
          // layout="inline"
          form={form}
          name="form_new_task_modal"
          onFinish={values => onCreate(values)}
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 24 }}
          // style={{
          //   marginTop: '30px',
          // }}
          initialValues={{ publishType: PublishTypeEnum.Org, maxFillCount: 1 }}
        >
          <Row
            gutter={24}
            style={{
              marginTop: '30px',
              marginLeft: '-20px',
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
                  showTime={{ format: 'HH:mm' }}
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
                  options={[{ label: '关于2024基础建设费用收集', value: '1' }]}
                ></Select>
                <a className="text-blue-500">
                  查看已选
                  <TemplateDetailModal />
                </a>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxFillCount" label="每位填报者可提交最多份数">
                <InputNumber style={{ width: '100%' }} min={0}></InputNumber>
                <span className="text-blue-400">*当不输入值时，为不限份数</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="publishType" label="任务分配方式">
                <Radio.Group>
                  <Radio value={PublishTypeEnum.Org}>任务分配到单位</Radio>
                  <Radio value={PublishTypeEnum.Member}>任务分配到人</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item noStyle dependencies={['publishType']}>
            {({ getFieldValue }) => {
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
        </Form>
      </Modal>
    </div>
  );
};

export default TaskAddNewModal;
