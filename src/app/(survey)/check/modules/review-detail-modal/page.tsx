'use client';

import Circle from '@/components/display/circle';
import { Button, Modal, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
// import { checkDetailData } from '../testData';
import TemplateDetailModal from '@/app/modules/template-detail-modal';

import {
  fullJoinRowSpanData,
  joinRowSpanKeyParamsType,
} from '@/lib/join-rowspan-data';
import { checkDetailData } from '../../testData';
import ProfessorDetail from './modules/professor-detail';

interface ReviewDetailModalProps {}
interface DataType {
  [key: string]: any;
}

const joinRowSpanKey: joinRowSpanKeyParamsType[] = [
  { coKey: 'org1', compareKeys: ['org1'] },
  { coKey: 'org2', compareKeys: ['org2'] },
  { coKey: 'org3', compareKeys: ['org3'] },
  { coKey: 'name', compareKeys: ['name', 'org3'] },
];
const ReviewDetailModal = () => {
  const [dataSource, setDataSource] = useState<any>();

  const [open, setOpen] = useState(false);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '第一层级单位',
      dataIndex: 'org1',
      align: 'center',
      onCell: text => {
        return {
          rowSpan: text.rowSpan?.org1 || 0,
        };
      },
    },
    {
      title: '第二层级单位',
      dataIndex: 'org2',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org2 || 0,
      }),
    },
    {
      title: '第三层级单位',
      dataIndex: 'org3',
      align: 'center',
      onCell: text => ({
        rowSpan: text.rowSpan?.org3 || 0,
      }),
    },
    {
      title: '姓名',
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
      title: (
        <>
          <div> 试卷</div>
          <div> (点击查看详情)</div>
        </>
      ),
      align: 'center',
      dataIndex: 'detail',
      render: text => (
        <div className="flex justify-center">
          <TemplateDetailModal
            title="试卷详情"
            showDom={<Circle value={text} />}
          />
        </div>
      ),
    },
    {
      title: '评审完成度',
      align: 'center',
      dataIndex: 'finishRate',
      render: text => text && <a>{`${text}%`}</a>,
    },
    {
      title: '已通过专家',
      align: 'center',
      dataIndex: 'finishPerson',
      render: (text, record) =>
        text && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '待审核专家',
      align: 'center',
      dataIndex: 'checkingPerson',
      render: (text, record) =>
        text && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '待提交专家',
      align: 'center',
      dataIndex: 'toSubmitPerson',
      render: (text, record) =>
        text && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
    {
      title: '已驳回专家',
      align: 'center',
      dataIndex: 'rejectedPerson',
      render: (text, record) =>
        text && (
          <ProfessorDetail
            buttonText={`${text}人`}
            record={record}
          ></ProfessorDetail>
        ),
    },
  ];

  useEffect(() => {
    setDataSource(
      joinRowSpanKey.reduce((prev: any[] | undefined, keyParams) => {
        return fullJoinRowSpanData(prev, keyParams);
      }, checkDetailData)
    );

    return () => {
      setDataSource(undefined);
    };
  }, [checkDetailData]);

  return (
    <>
      <a
        className="text-blue-500"
        onClick={() => {
          setOpen(true);
        }}
      >
        评审详情
      </a>
      <Modal
        title="专家详情"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        width={1400}
        footer={null}
      >
        <div className="flex justify-end mb-2">
          <Space>
            <Button type="primary">一键通过本页待审核专家</Button>
            <Button type="primary">一键通过所有待审核专家</Button>
          </Space>
        </div>
        <Table<DataType>
          columns={columns}
          dataSource={dataSource}
          bordered

          // pagination={false}
        />
      </Modal>
    </>
  );
};

export default ReviewDetailModal;
