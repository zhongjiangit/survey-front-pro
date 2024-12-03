/**
 * 权限枚举
 */
export const Role_Enum = {
  NOT_LOGIN: 'isNotLogin',
  PLATFORM_ADMIN: 'isPlatformManager',
  SYSTEM_ADMIN: 'isSystemManager',
  ORG_ADMIN: 'isOrgManager',
  NORMAL_ADMIN: 'isManager',
  MEMBER: 'isMember',
  EXPERT: 'isExpert',
};

// ----------------- 通用类型 0 | 1 -----------------
// 返回 0 ｜ 1 的类型， 0 代表否，1 代表是 或者 是否允许  0：不允许  1：允许
export type ZeroOrOneType = 0 | 1;

export enum ZeroOrOneTypeEnum {
  Zero = 0,
  One = 1,
}

// ----------------- 通用类型 角色类型 -----------------
export type RoleType = {
  key: string;
  isActive: boolean;
  label: string;
  name: string | boolean | undefined;
  staffType?: StaffType;
  id: number | boolean | undefined;
};

// ----------------- 通用类型 成员类型 -----------------
export type StaffType = 1 | 2 | 3; // 是单位成员，则有单位成员类型 1: 单位管理员 2: 普通管理员 3: 普通成员

// 列举1: 单位管理员 2: 普通管理员 3: 普通成员 的枚举类型
export enum StaffTypeEnum {
  UnitAdmin = 1,
  Admin = 2,
  Member = 3,
}

// 生成单位成员类型对象
export const StaffTypeObject = {
  [StaffTypeEnum.UnitAdmin]: '单位管理员',
  [StaffTypeEnum.Admin]: '普通管理员',
  [StaffTypeEnum.Member]: '普通成员',
};

// ----------------- 通用类型 标签类型 -----------------

// 列举标签类型 1: 单位标签 2：组织人员标签  3: 专家标签 的枚举类型
export enum TagTypeEnum {
  Org = 1,
  Member = 2,
  Expert = 3,
}

export type TagTypeType = 1 | 2 | 3; // 标签类型 1: 单位标签 2：组织人员标签  3: 专家标签

// ----------------- 通用类型 模版类型 -----------------

export type TemplateType = 1 | 2; // 模板类型 1: 资料收集 2: 试题抽检

// 列举模板类型 1: 资料收集 2: 试题抽检 的枚举类型
export enum TemplateTypeEnum {
  Collect = 1,
  Check = 2,
}

// ----------------- 通用类型 表单组件类型 -----------------

export type WidgetType =
  | 'input'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'file'
  | 'tree';

// ----------------- 通用类型 任务状态类型 -----------------
// taskStatus	int		任务状态 0：未开始 1：进行中 2：完成
// todo 看需求ui有已删除状态，接口无
export type TaskStatusType = 0 | 1 | 2;

export enum TaskStatusTypeEnum {
  NotStart = 0,
  Processing = 1,
  Finished = 2,
}

// 生成task类型对象
export const TaskStatusObject = {
  [TaskStatusTypeEnum.NotStart]: '未开始',
  [TaskStatusTypeEnum.Processing]: '进行中',
  [TaskStatusTypeEnum.Finished]: '完成',
};

// ----------------- 通用类型 评估状态类型 -----------------

export enum EvaluateStatusTypeEnum {
  // NOConfig = 0,
  NotStart = 0,
  Processing = 1,
  Finished = 2,
}

// 生成evaluate类型对象
export const EvaluateStatusObject = {
  // [EvaluateStatusTypeEnum.NOConfig]: '未配置',
  [EvaluateStatusTypeEnum.NotStart]: '未开始',
  [EvaluateStatusTypeEnum.Processing]: '进行中',
  [EvaluateStatusTypeEnum.Finished]: '完成',
};

// ----------------- 通用类型 评审状态类型 -----------------
// reviewStatus	int		评审状态 0：未填写 1：未提交 2：已提交 3：已通过 4：驳回 枚举
export type ReviewStatusType = 0 | 1 | 2 | 3 | 4;

export enum ReviewStatusTypeEnum {
  NotFill = 0,
  NotSubmit = 1,
  Submitted = 2,
  Passed = 3,
  Reject = 4,
}

// 生成review类型对象1 2 3 4 5 对应的状态 未填写 未提交 已提交 已通过 驳回
export const ReviewStatusObject = {
  [ReviewStatusTypeEnum.NotFill]: '未填写',
  [ReviewStatusTypeEnum.NotSubmit]: '未提交',
  [ReviewStatusTypeEnum.Submitted]: '已提交',
  [ReviewStatusTypeEnum.Passed]: '已通过',
  [ReviewStatusTypeEnum.Reject]: '驳回',
};

// ----------------- 通用类型 分配类型 -----------------
// publishType 1：分配至单位 2：分配至人
export type PublishTypeType = 1 | 2;
export enum PublishTypeEnum {
  Org = 1,
  Member = 2,
}
// 生成publish类型对象
export const PublishTypeObject = {
  [PublishTypeEnum.Org]: '分配至单位',
  [PublishTypeEnum.Member]: '分配至人',
};

// ----------------- 通用类型 评审状态类型 -----------------
/*
评审状态 
10：未填报
20：未提交
30：待提交专家-数据
40：待审核专家-数据
50：已提交
60：已通过
70：已驳回
80：已通过专家-数据
90：已驳回专家-数据
100：数据丢弃
*/
export type ProcessStatusType =
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100;

export enum ProcessStatusTypeEnum {
  NotFill = 10,
  NotSubmit = 20,
  WaitSubmitExpertData = 30,
  WaitAuditExpertData = 40,
  Submitted = 50,
  Passed = 60,
  Reject = 70,
  PassedExpertData = 80,
  RejectExpertData = 90,
  DataDiscard = 100,
}

// 生成process类型对象
export const ProcessStatusObject = {
  [ProcessStatusTypeEnum.NotFill]: '未填报',
  [ProcessStatusTypeEnum.NotSubmit]: '未提交',
  [ProcessStatusTypeEnum.WaitSubmitExpertData]: '待提交专家-数据',
  [ProcessStatusTypeEnum.WaitAuditExpertData]: '待审核专家-数据',
  [ProcessStatusTypeEnum.Submitted]: '已提交',
  [ProcessStatusTypeEnum.Passed]: '已通过',
  [ProcessStatusTypeEnum.Reject]: '已驳回',
  [ProcessStatusTypeEnum.PassedExpertData]: '已通过专家-数据',
  [ProcessStatusTypeEnum.RejectExpertData]: '已驳回专家-数据',
  [ProcessStatusTypeEnum.DataDiscard]: '数据丢弃',
};

// ----------------- 通用类型 发布类型 -----------------

// 任务发布类型  1：按层级发布   2：指定人员发布
export type publishTypeType = 1 | 2;

export enum publishTypeEnum {
  Level = 1,
  Staff = 2,
}

// 生成publish类型对象
export const publishTypeObject = {
  [publishTypeEnum.Level]: '按层级发布',
  [publishTypeEnum.Staff]: '指定人员发布',
};

// 任务处理状态， 10：待分配 20：未提交 50:已提交 60:已通过 70:已驳回 100：数据丢弃
// getFillProcessDetails	获取任务填报处理详情的状态
/*
"填报状态 
20：未提交
30：未提交至本人
40：需本人审核
50：已提交
60：已通过
70：已驳回
100：数据丢弃"
 */
export type TaskProcessStatusType = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 100;

export enum TaskProcessStatusEnum {
  WaitAssign = 10,
  NotSubmit = 20,
  NotSubmitToSelf = 30,
  NeedSelfAudit = 40,
  Submitted = 50,
  Passed = 60,
  Reject = 70,
  DataDiscard = 100,
}

// 生成taskProcess类型对象
export const TaskProcessStatusObject = {
  [TaskProcessStatusEnum.WaitAssign]: '待分配',
  [TaskProcessStatusEnum.NotSubmit]: '未提交',
  [TaskProcessStatusEnum.NotSubmitToSelf]: '未提交至本人',
  [TaskProcessStatusEnum.NeedSelfAudit]: '需本人审核',
  [TaskProcessStatusEnum.Submitted]: '已提交',
  [TaskProcessStatusEnum.Passed]: '已通过',
  [TaskProcessStatusEnum.Reject]: '已驳回',
  [TaskProcessStatusEnum.DataDiscard]: '数据丢弃',
};

// ----------------- 通用类型 弹窗类型枚举 -----------------
// 弹窗类型 new：新增 edit：编辑 view：查看 delete：删除 copy：复制 allot：分配
export type ModalType = '新增' | '编辑' | '查看' | '删除' | '复制' | '分配';

// 枚举
export enum ModalTypeEnum {
  New = '新增',
  Edit = '编辑',
  View = '查看',
  Delete = '删除',
  Copy = '复制',
  Allot = '分配',
}
