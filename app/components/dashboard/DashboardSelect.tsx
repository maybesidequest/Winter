import { Select, type SelectProps } from "antd";
import type { CSSProperties, ReactNode } from "react";

export interface DashboardSelectOption<T = any> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  title?: string;
}

export interface DashboardSelectProps<
  ValueType = any,
  OptionType extends DashboardSelectOption<any> = DashboardSelectOption<any>
> extends Omit<SelectProps<ValueType, OptionType>, "options"> {
  options: OptionType[];
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

const defaultSelectStyle: CSSProperties = {
  minHeight: 36,
  fontSize: "0.75rem",
};

export function DashboardSelect<
  ValueType = any,
  OptionType extends DashboardSelectOption<any> = DashboardSelectOption<any>
>({
  options,
  className = "",
  style,
  popupClassName,
  ...props
}: DashboardSelectProps<ValueType, OptionType>) {
  const mergedClassName = `custom-glass-select text-xs ${className}`.trim();
  const mergedPopupClassName = popupClassName
    ? `dashboard-dropdown-panel ${popupClassName}`
    : "dashboard-dropdown-panel";

  return (
    <Select<ValueType, OptionType>
      {...props}
      className={mergedClassName}
      popupClassName={mergedPopupClassName}
      style={{ ...defaultSelectStyle, ...style }}
      options={options}
    />
  );
}
