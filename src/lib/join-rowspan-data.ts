import _ from 'lodash';
export interface joinRowSpanKeyParamsType {
  coKey: string; //添加rowspan的key
  compareKeys: string[]; //比较的key的集合
}
// 处理数据rowSpan函数
export const joinRowSpanData = (
  array: any[] | undefined,
  keyStr: string
): undefined | any[] => {
  if (!array || array.length === 0) return;
  const arr = _.cloneDeep(array);
  // 1、startItem(默认rowSpan = 1)记录开始计数的对象
  let startItem: any = arr[0];
  if (startItem.rowSpan) {
    startItem.rowSpan[keyStr] = 1;
  } else {
    startItem.rowSpan = { [keyStr]: 1 };
  }
  // 2、遍历数组，取下一项进行比较，当name相同则startItem的rowSpan+1, 否则设置新的startItem为下一项
  arr.forEach((item: any, index) => {
    const nextItem: any = arr[index + 1] || {};
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

export const fullJoinRowSpanData = (
  array: any[] | undefined,
  params: joinRowSpanKeyParamsType
): undefined | any[] => {
  if (!array || array.length === 0) return;
  const arr = _.cloneDeep(array);
  // 1、startItem(默认rowSpan = 1)记录开始计数的对象
  let startItem: any = arr[0];
  if (startItem.rowSpan) {
    startItem.rowSpan[params.coKey] = 1;
  } else {
    startItem.rowSpan = { [params.coKey]: 1 };
  }
  // 2、遍历数组，取下一项进行比较，当name相同则startItem的rowSpan+1, 否则设置新的startItem为下一项
  arr.forEach((item: any, index) => {
    const nextItem: any = arr[index + 1] || {};
    const isEqual = params.compareKeys.every(
      key => item[key] === nextItem[key]
    );
    if (isEqual) {
      startItem.rowSpan[params.coKey]++;
    } else {
      startItem = nextItem;
      if (startItem.rowSpan) {
        startItem.rowSpan[params.coKey] = 1;
      } else {
        startItem.rowSpan = { [params.coKey]: 1 };
      }
    }
  });
  return arr;
};

// 处理数据rowSpan函数
export const joinRowSpanDataChild = (
  array: any[] | undefined,
  keyStr: string,
  childKey: string
): undefined | any[] => {
  if (!array || array.length === 0) return;
  const arr = _.cloneDeep(array);
  // 1、startItem(默认rowSpan = 1)记录开始计数的对象
  let startItem: any = arr[0];
  if (startItem.rowSpan) {
    startItem.rowSpan[keyStr] = 1;
  } else {
    startItem.rowSpan = { [keyStr]: 1 };
  }
  // 2、遍历数组，取下一项进行比较，当name相同则startItem的rowSpan+1, 否则设置新的startItem为下一项
  arr.forEach((item: any, index) => {
    const nextItem: any = arr[index + 1] || {};
    if (item[keyStr]?.[childKey] === nextItem[keyStr]?.[childKey]) {
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
