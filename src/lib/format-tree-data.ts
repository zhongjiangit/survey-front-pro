export function formatTreeData(params: any, pushUnType?: boolean) {
  if (!params) {
    return [];
  }
  // 将[{key: **, title: **}]树形数据递归转换为[{ label: '**', value: '**' }]树形数据
  return format(params);
  function format(data: any) {
    return data?.map((item: any) => {
      return {
        label: item.title,
        text: item.title,
        value: item.key,
        children: item.children ? format(item.children) : [],
      };
    });
  }
}
