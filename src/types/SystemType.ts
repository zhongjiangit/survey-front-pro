import { StaffType, ZeroOrOneType } from './CommonType';

export type LevelType = {
  id?: string;
  levelIndex?: number;
  levelName: string;
  systemInfoId: string | number;
};

export interface SystemType {
  id: string;
  validDate: string;
  systemName: string;
  levelCount: number;
  systemStatus: ZeroOrOneType;
  levels: LevelType[];
  leftTimes: number;
  freeTimes: number;
  createDate: string;
  allowSubInitiate: number;
  allowSupCheck: number;
}

export type OrgType = {
  orgId: number;
  orgName: string;
  isStaff: 0 | 1; // 是否是单位成员
  staffId?: number; // 是单位成员，则有单位成员id
  staffName?: string; // 是单位成员，则有单位成员名称
  staffType?: StaffType;
  isExpert: 0 | 1; // 是否是专家
  expertId?: number; // 是专家，则有专家id
  expertName?: string; // 是专家，则有专家名称
};

export interface UserSystemType {
  systemId: number;
  systemName: string;
  isSystemManager: 0 | 1; // 是否是系统管理员
  systemManagerName: string; // 系统管理员名称, 如果是系统管理员则有
  orgs: OrgType[];
}

export interface UserType {
  userId: number;
  isPlatformManager: 0 | 1; // 是否是平台管理员
  platformManagerName?: string; // 平台管理员名称, 如果是平台管理员则有
  systems: UserSystemType[];
}
