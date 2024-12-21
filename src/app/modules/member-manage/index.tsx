import Api from '@/api';
import { StaffListResponse } from '@/api/staff/getStaffList';
import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { StaffType, StaffTypeEnum, StaffTypeObject } from '@/types/CommonType';
import {
  EditableProTable,
  type ProColumnType,
} from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Popconfirm, Select, Tag, TreeSelect } from 'antd';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

interface TableFormDateType {
  id: number | string;
  currentOrgId?: number;
  currentRoleId?: number;
  CurrentSystemId?: number;
  staffName?: string;
  cellphone?: string;
  staffType?: StaffType;
  tags?: { key: number; title: string }[];
  tagLabels?: string[];
}

interface MemberManageProps {
  canEdit: boolean;
  orgId: React.Key | undefined;
  memberTags: any;
}

const MemberManage: FunctionComponent<MemberManageProps> = ({
  canEdit,
  orgId,
  memberTags,
}: MemberManageProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<TableFormDateType[]>([]);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const currentRole = useSurveyCurrentRoleStore(state => state.currentRole);
  const [adminStaff, setAdminStaff] = useState<StaffListResponse | null>(null);

  const formatMemberData = useCallback((data: TableFormDateType[]) => {
    return data.map(item => {
      return {
        ...item,
        tags: item.tags?.map(tag => tag.key),
        tagLabels: item.tags?.map(tag => tag.title),
      };
    });
  }, []);
  console.log('dataSource', dataSource);

  const { run: getStaffList } = useRequest(
    () => {
      return Api.getStaffList({
        currentSystemId: currentSystem?.systemId,
        currentOrgId: Number(orgId),
      });
    },
    {
      refreshDeps: [orgId, currentSystem?.systemId],
      onSuccess(response) {
        if (Array.isArray(response?.data)) {
          const adminStaff = response?.data?.filter(
            staff => staff.id === currentRole?.id
          );
          setAdminStaff(adminStaff[0]);
          if (!canEdit) {
            // @ts-expect-error: dataSource is not assignable to type 'SetStateAction<TableFormDateType[]>'.
            setDataSource(formatMemberData(response?.data));
          } else {
            const data = response?.data.filter(item =>
              currentOrg?.staffType === StaffTypeEnum.UnitAdmin
                ? item.staffType !== StaffTypeEnum.UnitAdmin
                : item.staffType === StaffTypeEnum.Member
            );
            // @ts-expect-error: dataSource is not assignable to type 'SetStateAction<TableFormDateType[]>'.
            setDataSource(formatMemberData(data));
          }
        }
      },
    }
  );

  const { run: createStaff } = useRequest(
    params => {
      return Api.createStaff(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          getStaffList();
        }
      },
    }
  );

  const { run: updateStaff } = useRequest(
    params => {
      return Api.updateStaff(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          getStaffList();
        }
      },
    }
  );

  const { run: deleteStaff } = useRequest(
    params => {
      return Api.deleteStaff(params);
    },
    {
      manual: true,
      onSuccess(response) {
        if (response.result === 0) {
          getStaffList();
        }
      },
    }
  );

  const onSave = useCallback(
    (values: any) => {
      // 将tags转成对象数组
      values.tags = values.tags?.map((tag: number) => ({ key: tag }));

      if (currentSystem?.systemId && currentOrg?.orgId) {
        if (typeof values.id === 'number') {
          updateStaff({
            id: values.id,
            currentSystemId: currentSystem?.systemId,
            currentOrgId: currentOrg?.orgId,
            staffName: values.staffName,
            cellphone: values.cellphone,
            staffType: values.staffType,
            tags: values?.tags || [],
          });
        } else {
          createStaff({
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
    [currentSystem?.systemId, currentOrg?.orgId, updateStaff, createStaff]
  );

  const onDelete = useCallback(
    (id: number) => {
      if (currentSystem?.systemId && currentOrg?.orgId) {
        deleteStaff({
          id,
          currentSystemId: currentSystem?.systemId,
          currentOrgId: currentOrg?.orgId,
        });
      }
    },
    [currentSystem, currentOrg, deleteStaff]
  );

  const roleOptions = useMemo(() => {
    if (adminStaff?.staffType === StaffTypeEnum.UnitAdmin) {
      return [
        {
          label: '普通管理员',
          value: StaffTypeEnum.Admin,
        },
        {
          label: '普通成员',
          value: StaffTypeEnum.Member,
        },
      ];
    } else if (adminStaff?.staffType === StaffTypeEnum.Admin) {
      return [
        {
          label: '普通成员',
          value: StaffTypeEnum.Member,
        },
      ];
    } else {
      return [];
    }
  }, [adminStaff?.staffType]);

  const columns: ProColumnType<TableFormDateType>[] = useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'staffName',
        key: 'staffName',
        width: '15%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '姓名为必填项' }],
          };
        },
        // // 第一行不允许编辑
        // editable: (text, record, index) => {
        //   return index !== 0;
        // },
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
              options={roleOptions}
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
        renderFormItem(_, { record }) {
          return (
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择成员标签"
              allowClear
              multiple
              treeDefaultExpandAll
              treeData={memberTags}
              treeCheckable={true}
              showCheckedStrategy={'SHOW_PARENT'}
            />
          );
        },
        render: (_, record: TableFormDateType) => {
          return (
            <span>
              {record.tagLabels?.map((item, index) => {
                return (
                  <Tag key={index} color="success">
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
          if (canEdit) {
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
                <a className="hover:text-red-500">删除</a>
              </Popconfirm>,
            ];
          } else {
            return [<span key="1">-</span>];
          }
        },
      },
    ],
    [roleOptions, memberTags, canEdit, onDelete]
  );

  return (
    <EditableProTable<TableFormDateType>
      recordCreatorProps={
        canEdit
          ? {
              record: () => {
                return {
                  id: String(Date.now()),
                };
              },
            }
          : false
      }
      columns={columns}
      rowKey="id"
      value={dataSource}
      onChange={value => setDataSource(value as TableFormDateType[])}
      editable={{
        type: 'single',
        editableKeys,
        onSave: async (rowKey, data, row) => {
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
