export interface DateRangeValue {
  startDate: string;
  endDate: string;
  compareStartDate?: string;
  compareEndDate?: string;
}

export type DateRangePresetKind =
  | "today"
  | "yesterday"
  | "last-7-days"
  | "last-30-days"
  | "this-month"
  | "last-month"
  | "custom";

export interface DateRangePreset {
  id: DateRangePresetKind | string;
  label: string;
  startDate: string;
  endDate: string;
  compareStartDate?: string;
  compareEndDate?: string;
}

export interface DateRangeChangeDetail {
  value: DateRangeValue;
  presetId: string;
}

export interface DateRangeApplyDetail {
  value: DateRangeValue;
  presetId: string;
}

export interface DateRangeOpenChangeDetail {
  open: boolean;
}
