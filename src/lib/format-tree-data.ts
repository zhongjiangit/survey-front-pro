export function formatTreeData(params: any) {
  // 将[{key: **, title: **}]树形数据递归转换为[{ label: '**', value: '**' }]树形数据
  const formatTreeData = (data: any) => {
    return data?.map((item: any) => {
      return {
        label: item.title,
        text: item.title,
        value: item.key,
        children: item.children ? formatTreeData(item.children) : [],
      };
    });
  };
  if (params[0]) {
    return formatTreeData(params);
  } else {
    return [];
  }
}
