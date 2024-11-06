'use client';

import { useSurveyOrgStore } from '@/contexts/useSurveyOrgStore';
import { useSurveySystemStore } from '@/contexts/useSurveySystemStore';
import { useSurveyUserStore } from '@/contexts/useSurveyUserStore';
import { RoleType } from '@/types/CommonType';
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
        },
        {
          key: 'isSystemManager',
          label: '系统管理员',
          isActive: !!currentSystem?.isSystemManager,
          name:
            !!currentSystem?.isSystemManager && currentSystem.systemManagerName,
        },
        {
          key: 'isExpert',
          label: '专家',
          isActive: !!currentOrg?.isExpert,
          name: !!currentOrg?.isExpert && currentOrg.expertName,
        },
        {
          key: 'isOrgManager',
          label: '单位管理员',
          isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 1,
          name: currentOrg?.isStaff === 1 && currentOrg.staffName,
        },
        {
          key: 'isManager',
          label: '一般管理员',
          isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 2,
          name: currentOrg?.isStaff === 1 && currentOrg.staffName,
        },
        {
          key: 'isMember',
          label: '普通成员',
          isActive: currentOrg?.isStaff === 1 && currentOrg?.staffType === 3,
          name: currentOrg?.isStaff === 1 && currentOrg.staffName,
        },
      ];
      setRoles(roles);
    }
  }, [
    currentOrg?.isExpert,
    currentOrg?.isStaff,
    currentOrg?.staffType,
    currentSystem?.isSystemManager,
    user,
  ]);
  return roles;
}
