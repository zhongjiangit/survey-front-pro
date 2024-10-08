'use client';

import { CustomTreeDataNode } from '@/components/common/custom-tree';
import { TagType } from '@/interfaces/CommonType';
import { useEffect, useState } from 'react';

export function useFormatToAndTreeData(treeData: TagType) {
  const [TreeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
  useEffect(() => {
    if (treeData) {
      const treeDataList = [treeData];
      // 递归循环，将里面的tagId改为key,tagName改为title,subTags改为children,并将所有数据放到另一个对象中
      const formatTreeData = (data: TagType) => {
        // 如果tagId是数字类型，则不装换tagId
        if (typeof data.tagId !== 'number') {
          data.key = data.tagId;
        }
        data.title = data.tagName;
        if (data.subTags) {
          data.children = data.subTags;
          delete data.subTags;
          data.children.forEach((item: TagType) => {
            formatTreeData(item);
          });
        }
      };
      treeDataList.forEach((item: TagType) => {
        formatTreeData(item);
      });

      // @ts-ignore
      setTreeData(treeDataList);
    }
  }, [treeData]);

  return TreeData;
}

export function useFormatToLocalTreeData(treeData: TagType[]) {
  const [TreeData, setTreeData] = useState<TagType>();
  useEffect(() => {
    if (treeData) {
      // 递归循环，将里面的key改为tagId,title改为tagName,children改为children
      const formatTreeData = (data: TagType) => {
        data.tagId = data.key;
        data.tagName = data.title;
        if (data.children) {
          data.subTags = data.children;
          delete data.children;
          data.subTags.forEach((item: TagType) => {
            formatTreeData(item);
          });
        }
      };
      treeData.forEach((item: TagType) => {
        formatTreeData(item);
      });

      setTreeData(treeData[0]);
    }
  }, [treeData]);

  return TreeData;
}
