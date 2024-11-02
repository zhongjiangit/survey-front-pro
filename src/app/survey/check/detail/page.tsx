'use client';

import Circle from '@/components/display/circle';
import { Table, TableProps } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { checkDetailData } from '../testData';

interface CheckDetailProps {}
interface DataType {
  [key: string]: any;
}
const joinRowSpanKey = ['org1', 'org2', 'org3', 'name'];
const CheckDetail = () => {
  const [dataSource, setDataSource] = useState<any>();
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
          <a>
            <Circle value={text} />
          </a>
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
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '待审核专家',
      align: 'center',
      dataIndex: 'checkingPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '待提交专家',
      align: 'center',
      dataIndex: 'toSubmitPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
    {
      title: '已驳回专家',
      align: 'center',
      dataIndex: 'rejectedPerson',
      render: text => text && <a className="text-blue-500">{`${text}人`}</a>,
    },
  ];

  // 处理数据rowSpan函数
  const joinRowSpanData = (
    array: any[] | undefined,
    keyStr: string
  ): undefined | any[] => {
    if (!array || array.length === 0) return;
    let arr = _.cloneDeep(array);
    // 1、startItem(默认rowSpan = 1)记录开始计数的对象
    let startItem: any = arr[0];
    if (startItem.rowSpan) {
      startItem.rowSpan[keyStr] = 1;
    } else {
      startItem.rowSpan = { [keyStr]: 1 };
    }
    // 2、遍历数组，取下一项进行比较，当name相同则startItem的rowSpan+1, 否则设置新的startItem为下一项
    arr.forEach((item: any, index) => {
      let nextItem: any = arr[index + 1] || {};
      if (item[keyStr] === nextItem[keyStr]) {
        startItem.rowSpan[keyStr]++;
      } else {
        startItem = nextItem;
        if (startItem.rowSpan) {
          startItem.rowSpan[keyStr] = 1;
        } else {
          startItem.rowSpan = { [keyStr]: 1 };
        }
      }
    });
    return arr;
  };
  useEffect(() => {
    setDataSource(
      joinRowSpanKey.reduce((prev: any[] | undefined, currentKey: string) => {
        console.log(currentKey, 'currentKey');

        return joinRowSpanData(prev, currentKey);
      }, checkDetailData)
    );

    return () => {
      setDataSource(undefined);
    };
  }, [checkDetailData]);
  console.log(dataSource, 'dataSource');

  return (
    <div>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        bordered
        // table空值时显示 -
        locale={{
          emptyText: '-',
        }}
        // pagination={false}
      />
    </div>
  );
};

export default CheckDetail;
