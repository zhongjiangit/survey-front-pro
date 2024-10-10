'use client';

import type { TreeDataNode, TreeProps } from 'antd';
import { Tree } from 'antd';
import { useEffect, useState } from 'react';

const treeData: TreeDataNode[] = [
  {
    title: '四川省',
    key: '0-0',
    children: [
      {
        title: '成都市',
        key: '0-0-0',
        children: [
          {
            title: '双流区',
            key: '0-0-0-0',
          },
          {
            title: '武侯区',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: '德阳市',
        key: '0-0-1',
        children: [
          {
            title: '旌阳区',
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];

interface OrgTreeProps {
  setOrg: (org: React.Key) => void;
}

function OrgTree({ setOrg }: OrgTreeProps) {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const [selectedOrg, setSelectedOrg] = useState<React.Key[]>([]);
  useEffect(() => {
    if (selectedOrg.length > 0) {
      setOrg(selectedOrg[0]);
    }
  }, [selectedOrg, setOrg]);

  return (
    <Tree
      defaultExpandedKeys={['0-0-0', '0-0-1']}
      defaultSelectedKeys={['0-0-0', '0-0-1']}
      defaultCheckedKeys={['0-0-0', '0-0-1']}
      onSelect={onSelect}
      treeData={treeData}
    />
  );
}

export default OrgTree;
