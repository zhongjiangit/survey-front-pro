// 返回 0 ｜ 1 的类型， 0 代表否，1 代表是
export type ZeroOrOneType = 0 | 1;

export enum ZeroOrOneTypeEnum {
  Zero = 0,
  One = 1,
}

export type RoleType = {
  key: string;
  isActive: boolean;
  label: string;
  name: string | boolean | undefined;
  staffType?: StaffType;
};

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

// 列举标签类型 1: 单位标签 2：组织人员标签  3: 专家标签 的枚举类型
export enum TagTypeEnum {
  Org = 1,
  Member = 2,
  Expert = 3,
}

export type TagTypeType = 1 | 2 | 3; // 标签类型 1: 单位标签 2：组织人员标签  3: 专家标签

export enum TemplateTypeEnum {
  Collect = 1,
  Check = 2,
}

export type TemplateType = 1 | 2; // 模板类型 1: 资料收集 2: 试题抽检

export type WidgetType =
  | 'input'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'file'
  | 'tree';

// taskStatus	int		任务状态 0：未开始 1：进行中 2：完成
// todo 看需求ui有已删除状态，接口无
export type TaskStatusType = 0 | 1 | 2;

export enum EvaluateStatusTypeEnum {
  NOConfig = 0,
  NotStart = 1,
  Processing = 2,
  Finished = 3,
}

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

// processStatus	int		提交状态 0：未提交 1: 已提交 2：驳回
export type ProcessStatusType = 0 | 1 | 2;
export enum ProcessStatusTypeEnum {
  NotSubmit = 0,
  Submitted = 1,
  Reject = 2,
}
// 生成process类型对象
export const ProcessStatusObject = {
  [ProcessStatusTypeEnum.NotSubmit]: '未提交',
  [ProcessStatusTypeEnum.Submitted]: '已提交',
  [ProcessStatusTypeEnum.Reject]: '驳回',
};
