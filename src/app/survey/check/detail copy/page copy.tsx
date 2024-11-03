'use client';

import { Table, TableProps } from 'antd';

interface CheckDetailProps {}
interface DataType {
  [key: string]: any;
}
const CheckDetail = () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'key',
      dataIndex: 'key',
      // rowScope: 'rowgroup',
      render: text => {
        return <span>{text?.value}</span>;
      },

      onCell: text => {
        console.log(text, 'text');

        return {
          rowSpan: text.key.rowSpan,
        };
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: text => <a>{text?.value}</a>,
      onCell: text => ({
        rowSpan: text.name.rowSpan,
      }),
    },
    {
      title: 'key2',
      dataIndex: 'key2',
      render: text => <a>{text?.value}</a>,
      onCell: text => ({
        rowSpan: text.key2.rowSpan,
      }),
    },
  ];

  const originData: DataType[] = [
    {
      key: 'key',
      value: 1,

      children: [
        {
          key: 'name',
          value: 'zhongjian',
          children: [{ key: 'key2', value: 'zhongjian' }],
        },
        {
          key: 'name',
          value: 'shili',
          children: [
            { key: 'key2', value: 'shili1' },
            { key: 'key2', value: 'shili2' },
          ],
        },
      ],
    },
    {
      key: 'key',
      value: 2,
      children: [
        {
          key: 'name',
          value: 'zhongjian2',
          children: [{ key: 'key2', value: 'zhongjian2' }],
        },
        {
          key: 'name',
          value: 'shili2',
          children: [
            { key: 'key2', value: 'shili21' },
            { key: 'key2', value: 'shili22' },
          ],
        },
      ],
    },
  ];

  const flatRowSpanArr = (originArr: any): any => {
    const currentArr: any[] = [];
    getRowSpan(originArr);

    function correctRowSpan(originArr: any) {
      // 当前层级的rowSpan大于1时，后面n-1个rowSpan都为0
      let rowSpan = 0;
      originArr?.forEach((element: any, index: number) => {
        Object.keys(element).forEach((key: any) => {
          if (originArr[index - 1][key].rowSpan > 1) {
            element[key].rowSpan = 0;
            for (let i = 1; i < rowSpan; i++) {
              originArr[index + i][key].rowSpan = 0;
            }
          }
        });
      });
    }
    flatArr(originArr);
    function getRowSpan(originArr: any) {
      let leafCount = 0;
      originArr?.forEach((element: any) => {
        if (element.children) {
          leafCount = element.children.length + getRowSpan(element.children);
          element.leafCount = leafCount;
        } else {
          element.leafCount = 1;
          leafCount = 1;
        }
      });
      return leafCount;
    }
    function flatArr(originArr: any, parentObj: any = {}): any {
      originArr?.forEach((item: any, index: number) => {
        const tempObj = {
          [item.key]: {
            value: item.value,
            rowSpan: item.leafCount,
          },
          ...parentObj,
        };
        if (item.children) {
          flatArr(item.children, tempObj);
        } else {
          currentArr.push(tempObj);
        }
      });
    }
    console.log(currentArr, 'currentArr');

    return currentArr;
  };

  const data: DataType[] = [
    {
      key: { value: '1', rowSpan: 5 },
      name: { value: 'Jim Green', rowSpan: 3 },
    },
    {
      key: { value: '1', rowSpan: 0 },
      name: { value: 'Jim Green', rowSpan: 0 },
    },
    {
      key: { value: '1', rowSpan: 0 },
      name: { value: 'Jim Green', rowSpan: 0 },
    },
    {
      key: { value: '1', rowSpan: 0 },
      name: { value: 'Jim Green', rowSpan: 1 },
    },
    {
      key: { value: '1', rowSpan: 0 },
      name: { value: 'Jim Green', rowSpan: 1 },
    },
    {
      key: { value: '11', rowSpan: 1 },
      name: { value: 'Jim Green1', rowSpan: 1 },
    },
  ];
  // console.log(flatRowSpanArr(originData), 'flatRowSpanArr(originData)');

  return (
    <div>
      <Table<DataType>
        columns={columns}
        dataSource={flatRowSpanArr(originData)}
        bordered
      />
    </div>
  );
};

export default CheckDetail;
