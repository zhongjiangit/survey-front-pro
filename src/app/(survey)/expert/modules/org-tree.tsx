'use client';

import type { TreeDataNode, TreeProps } from 'antd';
import { Tree } from 'antd';

interface OrgTreeProps {
  selectedOrg: React.Key | undefined;
  dataSource: TreeDataNode[];
  setOrg: (org: React.Key) => void;
}

function OrgTree({ dataSource, setOrg, selectedOrg }: OrgTreeProps) {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setOrg(selectedKeys[0]);
  };

  return (
    <Tree
      defaultExpandAll
      selectedKeys={selectedOrg ? [selectedOrg] : []}
      onSelect={onSelect}
      treeData={dataSource}
    />
  );
}

export default OrgTree;
