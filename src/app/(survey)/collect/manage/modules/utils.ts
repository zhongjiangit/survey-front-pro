import { CustomTreeDataNode } from '@/components/common/custom-tree';
import React from 'react';
import { GetStaffListByTagsResponse } from '@/api/staff/listByTags';

/**
 * 更新人员树结构数据
 * @param list
 * @param key
 * @param children
 */
export function updateTreeData(
  list: CustomTreeDataNode[],
  key: React.Key,
  children: CustomTreeDataNode[]
): CustomTreeDataNode[] {
  return list.map(node => {
    if (node.key === key) {
      return { ...node, children };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

/**
 * 更新组织树结构数据
 * @param orgs
 * @param orgMembers
 */
export function updateTreeDataV2(
  orgs: CustomTreeDataNode[],
  orgMembers: { [k: string | number]: CustomTreeDataNode[] }
): CustomTreeDataNode[] {
  return orgs.map(node => {
    return { ...node, children: orgMembers[node.key] };
  });
}

/**
 * 将人员数据转换为树形结构数据
 * @param members
 */
export function membersToNode(members: GetStaffListByTagsResponse[]) {
  return members.map(item => ({
    key: item.id,
    id: item.id,
    title: `${item.staffName} (${item.cellphone})`,
    type: 'member',
    isLeaf: true,
  }));
}

/**
 * 获取已选中人员数量
 * @param selectedKeys
 * @param children
 */
export function getSelectedNum(
  selectedKeys: (string | number)[],
  children: CustomTreeDataNode[]
) {
  return children.filter(t => selectedKeys.includes(t.key)).length;
}

/**
 * 选中下发人员
 * @param member
 * @param checked
 * @param node
 * @param getOrgMembers
 */
export async function selectMember(
  member: number[],
  checked: boolean,
  node: any,
  getOrgMembers: (id: number) => Promise<CustomTreeDataNode[]>
) {
  if (node.isLeaf) {
    if (checked) {
      return member.concat(node.key);
    } else {
      return member.filter(item => item !== node.key);
    }
  } else {
    const children = node.children
      ? node.children
      : await getOrgMembers(node.key);
    const keys = children.map((t: CustomTreeDataNode) => t.key);
    member = member.filter(t => !keys.includes(t));
    if (checked) {
      member = member.concat(keys);
    }
    return member;
  }
}
