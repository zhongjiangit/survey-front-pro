import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import useStaffCreateMutation from '@/data/staff/useStaffCreateMutation';
import useStaffDeleteMutation from '@/data/staff/useStaffDeleteMutation';
import useStaffListSWR from '@/data/staff/useStaffListSWR';
import useStaffUpdateMutation from '@/data/staff/useStaffUpdateMutation';
import {
  StaffType,
  StaffTypeEnum,
  StaffTypeObject,
} from '@/interfaces/CommonType';
import {
  EditableProTable,
  type ProColumnType,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Select, SelectProps, Tag, TreeSelect } from 'antd';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface TableFormDateType {
  id: number | string;
  currentOrgId?: number;
  currentRoleId?: number;
  CurrentSystemId?: number;
  staffName?: string;
  cellphone?: string;
  staffType?: StaffType;
  tag?: string[];
}

interface MemberManageProps {}

const MemberManage: FunctionComponent<
  MemberManageProps
> = ({}: MemberManageProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<TableFormDateType[]>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);

  const {
    data: list,
    isLoading,
    mutate: listMutate,
  } = useStaffListSWR({
    currentSystemId: currentSystem?.systemId,
    currentOrgId: currentOrg?.orgId,
  });

  const {
    trigger: createTrigger,
    isMutating: createMutating,
    data: createCallbackData,
  } = useStaffCreateMutation();

  const {
    trigger: updateTrigger,
    isMutating: updateMutating,
    data: updateCallbackData,
  } = useStaffUpdateMutation();

  const {
    trigger: deleteTrigger,
    isMutating: deleteMutating,
    data: deleteCallbackData,
  } = useStaffDeleteMutation();

  useEffect(() => {
    if (Array.isArray(list?.data?.data)) {
      setDataSource(list.data.data);
    }
  }, [list]);

  useEffect(() => {
    if (createCallbackData || deleteCallbackData || updateCallbackData) {
      listMutate();
    }
  }, [createCallbackData, deleteCallbackData, updateCallbackData, listMutate]);

  const onSave = useCallback(
    (values: any) => {
      console.log('onSave', values);
      console.log('editableKeys', editableKeys);

      if (currentSystem?.systemId && currentOrg?.orgId) {
        if (typeof values.id === 'number') {
          updateTrigger({
            id: values.id,
            currentSystemId: currentSystem?.systemId,
            currentOrgId: currentOrg?.orgId,
            staffName: values.staffName,
            cellphone: values.cellphone,
            staffType: values.staffType,
            tags: values?.tags || [],
          });
        } else {
          createTrigger({
            currentSystemId: currentSystem?.systemId,
            currentOrgId: currentOrg?.orgId,
            staffName: values.staffName,
            cellphone: values.cellphone,
            staffType: values.staffType,
            tags: values?.tags || [],
          });
        }
      }
    },
    [
      editableKeys,
      currentSystem?.systemId,
      currentOrg?.orgId,
      updateTrigger,
      createTrigger,
    ]
  );

  const onDelete = useCallback(
    (id: number) => {
      if (currentSystem?.systemId && currentOrg?.orgId) {
        deleteTrigger({
          id,
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
        });
      }
    },
    [currentSystem?.systemId, currentOrg?.orgId, deleteTrigger]
  );

  const columns: ProColumnType<TableFormDateType>[] = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'staffName',
        key: 'staffName',
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
        dataIndex: 'cellphone',
        key: 'cellphone',
        width: '20%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '电话为必填项' }],
          };
        },
      },
      {
        title: '角色',
        dataIndex: 'staffType',
        key: 'staffType',
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
              style={{ minWidth: '160px' }}
              placeholder="请选择成员角色"
              options={[
                {
                  label: '普通管理员',
                  value: StaffTypeEnum.Admin,
                },
                {
                  label: '普通成员',
                  value: StaffTypeEnum.Member,
                },
              ]}
            />
          );
        },
        render: (_, record: TableFormDateType) => {
          return <span>{StaffTypeObject[record.staffType as StaffType]}</span>;
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
                action?.startEditable(record.id);
              }}
            >
              编辑
            </a>,

            <Popconfirm
              key="delete"
              title="删除此项"
              onConfirm={() => {
                onDelete(record.id as number);
              }}
            >
              <Button danger type="link">
                删除
              </Button>
            </Popconfirm>,
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
            id: String(Date.now()),
          };
        },
      }}
      columns={columns}
      rowKey="id"
      value={dataSource}
      onChange={value => setDataSource(value as TableFormDateType[])}
      editable={{
        type: 'single',
        editableKeys,
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row);
          onSave(data);
        },
        onChange: setEditableRowKeys,
        onDelete: async key => {
          onDelete(key as number);
        },
      }}
    />
  );
};

export default MemberManage;
