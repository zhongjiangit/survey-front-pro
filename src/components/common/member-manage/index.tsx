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
      },
      {
        title: '电话',
        dataIndex: 'workId',
        key: 'workId',
        width: '15%',
      },
      {
        title: '可见范围',
        dataIndex: 'department',
        key: 'department',
        width: '15%',
      },
      {
        title: '成员属性',
        dataIndex: 'attribute',
        key: 'attribute',
        width: '15%',
        renderFormItem() {
          return (
            <Select
              allowClear
              style={{ minWidth: '240px' }}
              placeholder="请选择节点标签"
              options={[
                {
                  label: '管理员',
                  value: '管理员',
                },
                {
                  label: '普通成员',
                  value: '普通成员',
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
        dataIndex: 'tag',
        key: 'tag',
        width: '15%',
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
    />
  );
};

export default MemberManage;
