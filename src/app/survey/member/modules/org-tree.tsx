'use client';

import type { TreeDataNode, TreeProps } from 'antd';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

interface OrgTreeProps {
  dataSource: TreeDataNode[];
  setOrg: (org: React.Key) => void;
}

function OrgTree({ dataSource, setOrg }: OrgTreeProps) {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const [selectedOrg, setSelectedOrg] = useState<React.Key[]>([]);
  useEffect(() => {
    if (selectedOrg.length > 0) {
      setOrg(selectedOrg[0]);
    }
  }, [selectedOrg, setOrg]);

  console.log('dataSource', dataSource);

  return (
    <Tree
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultSelectedKeys={['0-0-0', '0-0-1']}
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      onSelect={onSelect}
      treeData={dataSource}
    />
  );
}

export default OrgTree;
