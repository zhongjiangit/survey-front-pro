import {
  EditableProTable,
  type ProColumnType,
} from '@ant-design/pro-components';
import { Select, SelectProps, Tag, TreeSelect } from 'antd';
import { FunctionComponent, useMemo } from 'react';

interface MemberManageProps {}

interface TableFormDateType {
  key: string;
  workId?: string;
  name?: string;
  department?: string;
  isNew?: boolean;
  tag?: string[];
  editable?: boolean;
  attribute?: string;
}

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}

const MemberManage: FunctionComponent<
  MemberManageProps
> = ({}: MemberManageProps) => {
  const columns: ProColumnType<TableFormDateType>[] = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules:
              rowIndex > 1 ? [{ required: true, message: '姓名为必填项' }] : [],
          };
        },
        // 第一行不允许编辑
        editable: (text, record, index) => {
          return index !== 0;
        },
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        width: '20%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '电话为必填项' }],
          };
        },
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        width: '20%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '角色为必选项' }],
          };
        },
        renderFormItem() {
          return (
            <Select
              allowClear
              style={{ minWidth: '240px' }}
              placeholder="请选择节点标签"
              options={[
                {
                  label: '普通管理员',
                  value: 'normalAdmin',
                },
                {
                  label: '普通成员',
                  value: 'normalMember',
                },
              ]}
            />
          );
        },
        render: (_, record: TableFormDateType) => {
          return <span>{record.attribute}</span>;
        },
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        width: '30%',
        renderFormItem() {
          return (
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择成员标签"
              allowClear
              multiple
              treeDefaultExpandAll
              treeData={[]}
            />
          );
        },
        render: (_, record: TableFormDateType) => {
          return (
            <span>
              {record.tag?.map(item => {
                return (
                  <Tag key={item} color="success">
                    {item}
                  </Tag>
                );
              })}
            </span>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        valueType: 'option',
        render: (_, record: TableFormDateType, index, action) => {
          return [
            <a
              key="edit"
              onClick={() => {
                action?.startEditable(record.key);
              }}
            >
              编辑
            </a>,
          ];
        },
      },
    ],
    []
  );

  return (
    <EditableProTable<TableFormDateType>
      recordCreatorProps={{
        record: () => {
          return {
            key: `0${Date.now()}`,
          };
        },
      }}
      columns={columns}
      rowKey="key"
      editable={{
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row);
        },
      }}
    />
  );
};

export default MemberManage;
