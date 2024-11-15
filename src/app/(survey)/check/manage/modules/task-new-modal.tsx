'use client';

import Api from '@/api';
import TemplateDetailModal from '@/app/modules/template-detail-modal';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { PublishTypeEnum, TemplateTypeEnum } from '@/types/CommonType';
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
} from 'antd';
import React, { useState } from 'react';
import { treeData } from '../../testData';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

interface TaskEditModalProps {}

interface Values {
  taskName?: string;
}

const TaskAddNewModal: React.FC<TaskEditModalProps> = ({}) => {
  const [modal, contextHolder] = Modal.useModal();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [checkAll, setCheckAll] = useState(false);
  const [templateId, setTemplateId] = useState<number>();
  const [indeterminate, setIndeterminate] = useState(false);
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const { data: checkList, loading: checkListLoading } = useRequest(() => {
    return Api.getTemplateOutlineList({
      currentSystemId: currentSystem?.systemId!,
      templateType: TemplateTypeEnum.Check,
    });
  });

  const onCreate = (values: Values) => {
    const createDate = {
      ...values,
      currentSystemId: currentSystem?.systemId!,
      currentOrgId: currentOrg?.orgId!,
    };
    console.log('Received values of form: ', createDate);
    // setOpen(false);
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
    setIndeterminate(false);
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
      <div className="flex justify-between items-center pl-20">
        <div className="w-96 flex items-center">
          <span>人员过滤：</span>
          <Select
            mode="multiple"
            className="w-72 flex-1"
            // onChange={handleChange}
            options={[
              { label: 'aaaaa', value: '1' },
              { label: 'bbbbb', value: '2' },
              { label: 'ccccc', value: '3' },
              { label: 'ddddd', value: '4' },
            ]}
          />
        </div>
        <div className="mr-5 text-right flex gap-4 items-center">
          <span className="text-blue-400">已选：4人</span>
          <span className="cursor-pointer text-red-500 hover:text-red-600">
            <CloseCircleOutlined />
            清空
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
        className="px-20"
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
        tooltip="分配第一个所选层级的参与单位"
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
      <div className="flex justify-between items-center pl-20">
        <div className="w-96 flex items-center">
          <span>单位过滤：</span>
          <Select
            mode="multiple"
            className="w-72 flex-1"
            value={filterValue}
            onChange={onFilterChange}
            onBlur={showConfirm}
            options={[
              { label: 'aaaaa', value: '1' },
              { label: 'bbbbb', value: '2' },
              { label: 'ccccc', value: '3' },
              { label: 'ddddd', value: '4' },
            ]}
          />
        </div>
        <div className="mr-5 text-blue-400 text-right">已选：4单位</div>
      </div>

      <Divider></Divider>
      <div className="px-20">
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
        <Form.Item name="orgs" label="">
          <Checkbox.Group
            onChange={checkedList => {
              setIndeterminate(
                !!checkedList.length && checkedList.length < plainOptions.length
              );
              setCheckAll(checkedList.length === plainOptions.length);
            }}
            options={[
              { label: 'aaaaa单位', value: '1' },
              { label: 'bbbbb单位', value: '2' },
              { label: 'ccccc单位', value: '3' },
              { label: 'ddddd单位', value: '4' },
            ]}
          ></Checkbox.Group>
        </Form.Item>
      </div>
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
        width={1400}
        open={open}
        title="新建任务"
        okText="确定"
        cancelText="取消"
        destroyOnClose
        okButtonProps={{
          autoFocus: true,
          htmlType: 'submit',
          onClick: () => form.submit(),
        }}
        onCancel={() => setOpen(false)}
        modalRender={dom => (
          <Form
            form={form}
            name="form_new_task_modal"
            onFinish={values => onCreate(values)}
            onError={v => {
              console.log(v);
            }}
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
              <RangePicker style={{ width: '100%' }} />
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
                options={checkList?.data.map(item => ({
                  label: item.templateTitle,
                  value: item.templateId,
                }))}
              ></Select>
              {templateId && (
                <a className="text-blue-500">
                  <TemplateDetailModal
                    templateId={templateId}
                    TemplateType={TemplateTypeEnum.Check}
                  />
                </a>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="maxFillCount" label="每位填报者可提交最多份数">
              <InputNumber style={{ width: '100%' }} min={0}></InputNumber>
              <span className="text-slate-500">*当不输入值时，为不限份数</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="taskDescription"
              label="任务描述"
              // rules={[{ required: true }]}
            >
              <Input.TextArea cols={3} placeholder="请输入任务描述" />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
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
      </Modal>
      {contextHolder}
    </div>
  );
};

export default TaskAddNewModal;
