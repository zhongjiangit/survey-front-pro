import { DimensionsType } from '@/api/template/create-details';
import {
  EditableProTable,
  type ProColumnType,
} from '@ant-design/pro-components';
import { InputNumber, Popconfirm } from 'antd';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface TableFormDateType {
  id: number;
  dimensionName: string;
  score: number;
  guideline: string;
}

interface MemberManageProps {
  setDimensions: (value: DimensionsType[]) => void;
  canEdit?: boolean;
  dataSource?: TableFormDateType[];
}

const ScoreTable: FunctionComponent<MemberManageProps> = ({
  setDimensions,
  canEdit = true,
  dataSource,
}: MemberManageProps) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const onDelete = useCallback(
    (id: number) => {
      if (dataSource) {
        setDimensions(dataSource.filter(item => item.id !== id));
      }
    },
    [dataSource, setDimensions]
  );

  const columns: ProColumnType<TableFormDateType>[] = useMemo(
    () => [
      {
        title: '序号',
        width: '10%',
        renderText: (text, record, index) => `${index + 1}`,
        editable: false,
      },
      {
        title: '指标',
        dataIndex: 'dimensionName',
        key: 'dimensionName',
        width: '20%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '指标为必填项' }],
          };
        },
      },
      {
        title: '最高分值',
        dataIndex: 'score',
        key: 'score',
        width: '20%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '最高分值为必选项' }],
          };
        },
        renderFormItem() {
          return <InputNumber className="w-full" min={1} />;
        },
      },
      {
        title: '准则',
        dataIndex: 'guideline',
        key: 'guideline',
        width: '30%',
        formItemProps: (form, { rowIndex }) => {
          return {
            rules: [{ required: true, message: '指标为必填项' }],
          };
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
    [canEdit]
  );

  return (
    <EditableProTable<TableFormDateType>
      recordCreatorProps={
        canEdit
          ? {
              record: () => {
                return {
                  id: Date.now(),
                  dimensionName: '',
                  score: 10,
                  guideline: '',
                };
              },
            }
          : false
      }
      columns={columns}
      rowKey="id"
      value={dataSource}
      onChange={value => setDimensions(value as TableFormDateType[])}
      editable={{
        type: 'single',
        editableKeys,
        onChange: setEditableRowKeys,
      }}
    />
  );
};

export default ScoreTable;
