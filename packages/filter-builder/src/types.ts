export type FilterBuilderFieldType = "text" | "number" | "date" | "boolean" | "select";

export type FilterBuilderOperator =
  | "contains"
  | "equals"
  | "notEquals"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "before"
  | "after"
  | "isTrue"
  | "isFalse";

export type FilterBuilderLogic = "and" | "or";

export interface FilterBuilderOption {
  label: string;
  value: string;
}

export interface FilterBuilderField {
  key: string;
  label: string;
  type: FilterBuilderFieldType;
  operators?: FilterBuilderOperator[];
  options?: FilterBuilderOption[];
  placeholder?: string;
}

export interface FilterBuilderRule {
  id: string;
  field: string;
  operator: FilterBuilderOperator;
  value: string | number | boolean;
}

export interface FilterBuilderValue {
  logic: FilterBuilderLogic;
  rules: FilterBuilderRule[];
}

export interface FilterBuilderChangeDetail {
  value: FilterBuilderValue;
}

export interface FilterBuilderApplyDetail {
  value: FilterBuilderValue;
}
