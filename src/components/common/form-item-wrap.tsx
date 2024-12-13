import React from 'react';

export interface FormItemWrapProps {
  id?: string;
  ref?: React.RefObject<HTMLInputElement>;
  value?: any;
  disabled?: boolean;
  onChange?: (...arg: any[]) => void;
  renderChildren: RenderChildren;
}

export interface RenderChildren {
  (props: Omit<FormItemWrapProps, 'renderChildren'>): React.ReactNode;
}

/**
 * 表单项包裹组件, 用于包裹表单项，方便获取表单项的值和修改表单项的值
 */
const FormItemWrap: React.FC<FormItemWrapProps> = ({
  id,
  ref,
  value,
  disabled,
  onChange,
  renderChildren,
}) => {
  return renderChildren({
    id: id!,
    ref: ref!,
    value,
    disabled,
    onChange: onChange!,
  });
};

export default FormItemWrap;
