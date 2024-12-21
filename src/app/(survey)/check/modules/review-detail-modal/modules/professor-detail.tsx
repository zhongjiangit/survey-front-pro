import { Button, Modal, Space, Table, TableProps } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';

import { joinRowSpanData } from '@/lib/join-rowspan-data';
import { checkDetailProfessorData } from '../../../testData';

interface ProfessorDetailProps {
  buttonText: string;
  [key: string]: any;
}

const statusObj: any = {
  processing: '待评审',
  submit: '已提交',
  passed: '已通过',
  rejected: '已驳回',
};

const ProfessorDetail: FunctionComponent<ProfessorDetailProps> = ({
  buttonText,
  record,
}) => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState<any>();
  const joinRowSpanKey = ['name', 'target', 'paper', 'rate'];

  const buttons: any = {
    pass: (
      <a className="text-blue-500" type="primary">
        通过
      </a>
    ),
    reject: (
      <a className="text-blue-500" type="primary">
        驳回
      </a>
    ),
    rejectInfo: (
      <a className="text-blue-500" type="primary">
        驳回履历
      </a>
    ),
  };
  const operationButtons: any = {
    submit: [buttons.pass, buttons.reject],
    passed: [buttons.reject],
  };

  const columns: TableProps['columns'] = [
    {
      title: '专家信息',
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{text}</div>
          <a className="text-blue-500">{record.phone}</a>
        </>
      ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '评审对象',
      dataIndex: 'target',
      align: 'center',
      render: (text, record) => (
        <>
          <div>{record.org3}</div>
          <div>{text}</div>
          <div>{record.targetPhone}</div>
        </>
      ),
      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '评审试卷',
      dataIndex: 'paper',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.paper || 0,
      }),
      render: text => text && <a className="text-blue-500">详情</a>,
    },
    {
      title: '专家评分',
      dataIndex: 'rate',
      align: 'center',

      onCell: text => ({
        rowSpan: text.rowSpan?.name || 0,
      }),
    },
    {
      title: '评价维度',
      align: 'center',
      dataIndex: 'dimension',
    },
    {
      title: '维度评分',
      align: 'center',
      dataIndex: 'dimensionRate',
      render: text => text && <a>{`${text}%`}</a>,
    },

    {
      title: '评审状态',
      align: 'center',
      dataIndex: 'status',
      render: (text: string) => text && <a>{`${statusObj[text]}`}</a>,
    },
    {
      title: '专家点评',
      align: 'center',
      dataIndex: 'professorComment',
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      render: (text, record: any) => (
        <Space>
          {[
            ...(operationButtons[record.status] || []),
            record.rejectInfo && buttons.rejectInfo,
          ]}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (checkDetailProfessorData) {
      setDataSource(
        joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
          return joinRowSpanData(prev, currentKey);
        }, checkDetailProfessorData)
      );
    }
    return () => {
      setDataSource(undefined);
    };
  }, [checkDetailProfessorData]);
  return (
    <>
      <a
        onClick={() => {
          setOpen(true);
        }}
        className="text-blue-500"
      >
        {buttonText}
      </a>
      <Modal
        title={<div className="mx-5 mt-2">专家评审详情</div>}
        open={open}
        maskClosable={false}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        footer={null}
      >
        <div className="m-5 mb-0">
          <div className="flex justify-end mb-2 ">
            <Button type="primary">一键通过</Button>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{
              total: dataSource?.length,
              showSizeChanger: true,
              showQuickJumper: true,
              // current: pageNumber,
              // pageSize: pageSize,
              showTotal: total => `总共 ${total} 条`,
              // onChange: (page, pageSize) => {
              //   setPageNumber(page);
              //   setPageSize(pageSize);
              // },
            }}
          ></Table>
        </div>
      </Modal>
    </>
  );
};

export default ProfessorDetail;
