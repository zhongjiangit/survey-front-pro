import { RoleType, StaffTypeEnum } from '@/types/CommonType';

export function getActiveRoles(
  user: any,
  currentOrg: any,
  currentSystem: any
): RoleType[] {
  let roles: RoleType[] = [
    {
      key: 'isPlatformManager',
      isActive: !!user.isPlatformManager,
      label: '平台管理员',
      name: !!user.isPlatformManager && user.platformManagerName,
      id: !!user.isPlatformManager && user.userId,
    },
    {
      key: 'isSystemManager',
      label: '系统管理员',
      isActive: !!currentSystem?.isSystemManager,
      name: !!currentSystem?.isSystemManager && currentSystem.systemManagerName,
      id: !!currentSystem?.isSystemManager && currentOrg.staffId,
    },
    {
      key: 'isExpert',
      label: '专家',
      isActive: !!currentOrg?.isExpert,
      name: !!currentOrg?.isExpert && currentOrg.expertName,
      id: !!currentOrg?.isExpert && currentOrg.expertId,
    },
    {
      key: 'isOrgManager',
      label: '单位管理员',
      isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 1,
      name: currentOrg?.isStaff === 1 && currentOrg.staffName,
      staffType: StaffTypeEnum.UnitAdmin,
      id: currentOrg?.isStaff === 1 && currentOrg.staffId,
    },
    {
      key: 'isManager',
      label: '普通管理员',
      isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 2,
      name: currentOrg?.isStaff === 1 && currentOrg.staffName,
      staffType: StaffTypeEnum.Admin,
      id: currentOrg?.isStaff === 1 && currentOrg.staffId,
    },
    {
      key: 'isMember',
      label: '普通成员',
      isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 3,
      name: currentOrg?.isStaff === 1 && currentOrg.staffName,
      staffType: StaffTypeEnum.Member,
      id: currentOrg?.isStaff === 1 && currentOrg.staffId,
    },
  ];
  // 不是顶级单位，则移除平台管理员和系统管理员
  if (currentOrg?.isTopOrg === 0) {
    roles = roles.filter(
      t => !['isSystemManager', 'isPlatformManager'].includes(t.key)
    );
  }
  return roles;
}
