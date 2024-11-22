'use client';

import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { RoleType, StaffTypeEnum } from '@/types/CommonType';
import { useEffect, useState } from 'react';

export function useRoles() {
  const user = useSurveyUserStore(state => state.user);
  const currentSystem = useSurveySystemStore(state => state.currentSystem);
  const currentOrg = useSurveyOrgStore(state => state.currentOrg);
  const [roles, setRoles] = useState<RoleType[]>([]);
  useEffect(() => {
    if (user) {
      const roles: RoleType[] = [
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
          name:
            !!currentSystem?.isSystemManager && currentSystem.systemManagerName,
          id: !!currentSystem?.isSystemManager && currentSystem.systemId,
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
          label: '一般管理员',
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
      setRoles(roles);
    }
  }, [
    currentOrg?.expertId,
    currentOrg?.expertName,
    currentOrg?.isExpert,
    currentOrg?.isStaff,
    currentOrg?.staffId,
    currentOrg?.staffName,
    currentOrg?.staffType,
    currentSystem?.isSystemManager,
    currentSystem?.systemId,
    currentSystem?.systemManagerName,
    user,
  ]);

  return roles;
}
