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
