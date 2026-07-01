export type DataTableRecord = Record<string, unknown>;

export type DataTableDensity = "compact" | "comfortable" | "spacious";

export type DataTableSortDirection = "asc" | "desc";

export type DataTableFilterOperator =
  | "contains"
  | "equals"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface DataTableColumn<TRecord extends DataTableRecord = DataTableRecord> {
  key: keyof TRecord & string;
  label: string;
  description?: string;
  width?: string;
  minWidth?: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  filterable?: boolean;
  hideable?: boolean;
  hidden?: boolean;
  pinned?: "start" | "end";
  formatter?: (value: TRecord[keyof TRecord], row: TRecord) => string;
}

export interface DataTableSort {
  key: string;
  direction: DataTableSortDirection;
}

export interface DataTableFilter {
  key: string;
  operator: DataTableFilterOperator;
  value: string | number | boolean;
}

export interface DataTableSavedView {
  id: string;
  label: string;
  description?: string;
  visibleColumns?: string[];
  filters?: DataTableFilter[];
  sort?: DataTableSort;
  pageSize?: number;
}

export interface DataTablePageChangeDetail {
  page: number;
  pageSize: number;
}

export interface DataTableSortChangeDetail {
  sort: DataTableSort | null;
}

export interface DataTableSelectionChangeDetail<TRecord extends DataTableRecord = DataTableRecord> {
  selectedKeys: string[];
  selectedRows: TRecord[];
}

export interface DataTableRowActionDetail<TRecord extends DataTableRecord = DataTableRecord> {
  row: TRecord;
  rowKey: string;
}

export interface DataTableExportRequestDetail<TRecord extends DataTableRecord = DataTableRecord> {
  rows: TRecord[];
  columns: DataTableColumn<TRecord>[];
  selectedKeys: string[];
  viewId: string;
}

export interface DataTableViewChangeDetail {
  viewId: string;
  view: DataTableSavedView | null;
}

export interface DataTableColumnVisibilityChangeDetail {
  visibleColumns: string[];
  hiddenColumns: string[];
}
