import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import type {
  DataTableColumn,
  DataTableColumnVisibilityChangeDetail,
  DataTableDensity,
  DataTableExportRequestDetail,
  DataTableFilter,
  DataTablePageChangeDetail,
  DataTableRecord,
  DataTableRowActionDetail,
  DataTableSavedView,
  DataTableSelectionChangeDetail,
  DataTableSort,
  DataTableSortChangeDetail,
  DataTableViewChangeDetail
} from "./types.js";

const DEFAULT_PAGE_SIZE = 10;

@customElement("loomi-data-table")
export class LoomiDataTable<TRecord extends DataTableRecord = DataTableRecord> extends LoomiElement {
  static properties = {
    ...LoomiElement.properties,
    columns: { attribute: false },
    data: { attribute: false },
    filters: { attribute: false },
    savedViews: { attribute: false },
    selectedKeys: { attribute: false },
    visibleColumns: { attribute: false },
    rowKey: { attribute: "row-key" },
    currentViewId: { attribute: "current-view-id" },
    density: { reflect: true },
    emptyTitle: { attribute: "empty-title" },
    emptyDescription: { attribute: "empty-description" },
    globalSearch: { attribute: "global-search" },
    page: { type: Number },
    pageSize: { attribute: "page-size", type: Number },
    totalRows: { attribute: "total-rows", type: Number },
    selectable: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    pagination: { type: Boolean, reflect: true },
    serverSide: { attribute: "server-side", type: Boolean, reflect: true },
    showColumnManager: { attribute: "show-column-manager", type: Boolean },
    showExport: { attribute: "show-export", type: Boolean },
    showViewManager: { attribute: "show-view-manager", type: Boolean },
    stickyHeader: { attribute: "sticky-header", type: Boolean, reflect: true },
    _sort: { state: true }
  };

  static override styles = loomiStyles(css`
    :host {
      --loomi-data-table-border: var(--loomi-surface-border, #d9dee3);
      --loomi-data-table-border-subtle: var(--loomi-surface-border-subtle, #edf0f2);
      --loomi-data-table-muted: var(--loomi-text-muted, #62717d);
      --loomi-data-table-faint: var(--loomi-text-faint, #8a97a3);
      --loomi-data-table-surface: var(--loomi-surface, #ffffff);
      --loomi-data-table-surface-muted: var(--loomi-surface-muted, #f6f8fa);
      --loomi-data-table-surface-hover: var(--loomi-surface-hover, #f9fbfc);
      --loomi-data-table-text: var(--loomi-text, #172026);
      --loomi-data-table-text-secondary: var(--loomi-text-secondary, #33424f);
      --loomi-data-table-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
      --loomi-data-table-accent-strong: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
      --loomi-data-table-accent-soft: var(--loomi-primary-100, var(--_loomi-primary-100-default, #dbeafe));
      --loomi-data-table-accent-softer: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
      display: block;
      color: var(--loomi-data-table-text);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .shell {
      overflow: hidden;
      border: 1px solid var(--loomi-data-table-border);
      border-radius: 8px;
      background: var(--loomi-data-table-surface);
    }

    .toolbar,
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid var(--loomi-data-table-border);
      background: var(--loomi-data-table-surface);
    }

    .footer {
      border-top: 1px solid var(--loomi-data-table-border);
      border-bottom: 0;
    }

    .toolbar-group,
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    input,
    select,
    button {
      min-height: 34px;
      border: 1px solid var(--loomi-data-table-border);
      border-radius: 6px;
      background: var(--loomi-data-table-surface);
      color: inherit;
      font: inherit;
    }

    input,
    select {
      padding: 0 10px;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 10px;
      cursor: pointer;
    }

    button:hover {
      border-color: var(--loomi-data-table-accent);
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .selection-count {
      min-height: 28px;
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      background: var(--loomi-data-table-accent-soft);
      color: var(--loomi-data-table-accent-strong);
      padding: 0 10px;
      font-size: 12px;
      font-weight: 600;
    }

    details {
      position: relative;
    }

    summary {
      min-height: 34px;
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--loomi-data-table-border);
      border-radius: 6px;
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
    }

    .column-menu {
      position: absolute;
      z-index: 20;
      min-width: 220px;
      margin-top: 8px;
      padding: 8px;
      border: 1px solid var(--loomi-data-table-border);
      border-radius: 8px;
      background: var(--loomi-data-table-surface);
      box-shadow: 0 16px 40px rgb(15 23 42 / 0.14);
    }

    .column-menu label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px;
      font-size: 14px;
    }

    .table-wrap {
      overflow: auto;
    }

    table {
      width: 100%;
      min-width: 720px;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 14px;
    }

    th,
    td {
      border-bottom: 1px solid var(--loomi-data-table-border);
      padding: 12px;
      text-align: left;
      vertical-align: middle;
      white-space: nowrap;
    }

    :host([density="compact"]) th,
    :host([density="compact"]) td {
      padding: 8px 10px;
    }

    :host([density="spacious"]) th,
    :host([density="spacious"]) td {
      padding: 16px;
    }

    th {
      position: relative;
      background: var(--loomi-data-table-surface-subtle);
      color: var(--loomi-data-table-text-secondary);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    :host([sticky-header]) th {
      position: sticky;
      top: 0;
      z-index: 5;
    }

    tbody tr {
      cursor: default;
    }

    tbody tr:hover {
      background: var(--loomi-data-table-surface-hover);
    }

    tbody tr[data-selected="true"] {
      background: var(--loomi-data-table-accent-softer);
    }

    .align-center {
      text-align: center;
    }

    .align-end {
      text-align: right;
    }

    .empty,
    .loading {
      padding: 48px 24px;
      text-align: center;
      color: var(--loomi-data-table-muted);
    }

    .empty strong,
    .loading strong {
      display: block;
      margin-bottom: 4px;
      color: var(--loomi-data-table-text);
      font-size: 16px;
    }

    .row-count {
      color: var(--loomi-data-table-muted);
      font-size: 13px;
    }
  `);

  columns: DataTableColumn<TRecord>[] = [];
  data: TRecord[] = [];
  filters: DataTableFilter[] = [];
  savedViews: DataTableSavedView[] = [];
  selectedKeys: string[] = [];
  visibleColumns: string[] = [];
  rowKey = "id";
  currentViewId = "default";
  density: DataTableDensity = "comfortable";
  emptyTitle = "No rows found";
  emptyDescription = "Try changing the filters or search term.";
  globalSearch = "";
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  totalRows = 0;
  selectable = false;
  loading = false;
  pagination = true;
  serverSide = false;
  showColumnManager = true;
  showExport = true;
  showViewManager = true;
  stickyHeader = true;
  private _sort: DataTableSort | null = null;

  render() {
    const visibleColumns = this.getVisibleColumns();
    const rows = this.getPageRows();
    const totalRows = this.getTotalRows();
    const totalPages = this.getTotalPages(totalRows);
    const selectedCount = this.selectedKeys.length;

    return html`
      <section class="shell" aria-busy=${this.loading ? "true" : "false"}>
        ${this.renderToolbar(visibleColumns, selectedCount)}
        <div class="table-wrap">
          ${this.loading
            ? this.renderLoading()
            : rows.length === 0
              ? this.renderEmpty()
              : this.renderTable(visibleColumns, rows)}
        </div>
        ${this.pagination ? this.renderFooter(totalRows, totalPages) : nothing}
      </section>
    `;
  }

  private renderToolbar(columns: DataTableColumn<TRecord>[], selectedCount: number) {
    return html`
      <div class="toolbar">
        <div class="toolbar-group">
          <input
            type="search"
            aria-label="Search rows"
            placeholder="Search rows"
            .value=${this.globalSearch}
            @input=${this.handleSearchInput}
          />
          ${this.showViewManager && this.savedViews.length > 0 ? this.renderViewSelect() : nothing}
          ${this.showColumnManager ? this.renderColumnManager() : nothing}
        </div>
        <div class="toolbar-group">
          ${selectedCount > 0
            ? html`<span class="selection-count">${selectedCount} selected</span>`
            : nothing}
          ${this.showExport
            ? html`<button type="button" @click=${() => this.handleExport(columns)}>Export</button>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderViewSelect() {
    return html`
      <select aria-label="Saved table view" .value=${this.currentViewId} @change=${this.handleViewChange}>
        <option value="default">Default view</option>
        ${this.savedViews.map((view) => html`<option value=${view.id}>${view.label}</option>`)}
      </select>
    `;
  }

  private renderColumnManager() {
    return html`
      <details>
        <summary>Columns</summary>
        <div class="column-menu">
          ${this.columns
            .filter((column) => column.hideable !== false)
            .map((column) => {
              const checked = this.getVisibleColumnKeys().includes(column.key);
              return html`
                <label>
                  <input
                    type="checkbox"
                    .checked=${checked}
                    @change=${(event: Event) => this.handleColumnToggle(event, column.key)}
                  />
                  <span>${column.label}</span>
                </label>
              `;
            })}
        </div>
      </details>
    `;
  }

  private renderLoading() {
    return html`
      <div class="loading" role="status">
        <strong>Loading rows</strong>
        <span>Fetching the latest table data.</span>
      </div>
    `;
  }

  private renderEmpty() {
    return html`
      <div class="empty">
        <strong>${this.emptyTitle}</strong>
        <span>${this.emptyDescription}</span>
      </div>
    `;
  }

  private renderTable(columns: DataTableColumn<TRecord>[], rows: TRecord[]) {
    return html`
      <table>
        <thead>
          <tr>
            ${this.selectable
              ? html`
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      .checked=${this.areAllVisibleRowsSelected(rows)}
                      @change=${(event: Event) => this.handleSelectAll(event, rows)}
                    />
                  </th>
                `
              : nothing}
            ${columns.map((column) => this.renderHeaderCell(column))}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => this.renderRow(columns, row))}
        </tbody>
      </table>
    `;
  }

  private renderHeaderCell(column: DataTableColumn<TRecord>) {
    const sortIndicator = this._sort?.key === column.key ? (this._sort.direction === "asc" ? "^" : "v") : "";
    const className = this.getAlignClass(column);

    return html`
      <th class=${className} style=${this.getColumnStyle(column)}>
        ${column.sortable
          ? html`<button type="button" @click=${() => this.handleSort(column)}>${column.label} ${sortIndicator}</button>`
          : column.label}
      </th>
    `;
  }

  private renderRow(columns: DataTableColumn<TRecord>[], row: TRecord) {
    const rowKey = this.getRowKey(row);
    const selected = this.selectedKeys.includes(rowKey);

    return html`
      <tr data-selected=${selected ? "true" : "false"} @click=${() => this.emitRowAction(row, rowKey)}>
        ${this.selectable
          ? html`
              <td>
                <input
                  type="checkbox"
                  aria-label=${`Select row ${rowKey}`}
                  .checked=${selected}
                  @click=${(event: Event) => event.stopPropagation()}
                  @change=${(event: Event) => this.handleRowSelect(event, row)}
                />
              </td>
            `
          : nothing}
        ${columns.map((column) => {
          const value = row[column.key];
          return html`
            <td class=${this.getAlignClass(column)}>
              ${column.formatter ? column.formatter(value, row) : this.formatCellValue(value)}
            </td>
          `;
        })}
      </tr>
    `;
  }

  private renderFooter(totalRows: number, totalPages: number) {
    return html`
      <div class="footer">
        <span class="row-count">${totalRows} rows</span>
        <div class="pagination">
          <button type="button" ?disabled=${this.page <= 1} @click=${() => this.setPage(this.page - 1)}>
            Previous
          </button>
          <span>Page ${this.page} of ${totalPages}</span>
          <button type="button" ?disabled=${this.page >= totalPages} @click=${() => this.setPage(this.page + 1)}>
            Next
          </button>
          <select aria-label="Rows per page" .value=${String(this.pageSize)} @change=${this.handlePageSizeChange}>
            ${[10, 25, 50, 100].map((size) => html`<option value=${size}>${size} rows</option>`)}
          </select>
        </div>
      </div>
    `;
  }

  private handleSearchInput = (event: Event) => {
    this.globalSearch = (event.target as HTMLInputElement).value;
    this.page = 1;
    this.emitPageChange();
  };

  private handleViewChange = (event: Event) => {
    const viewId = (event.target as HTMLSelectElement).value;
    const view = this.savedViews.find((savedView) => savedView.id === viewId) ?? null;

    this.currentViewId = viewId;

    if (view) {
      this.visibleColumns = view.visibleColumns ?? this.visibleColumns;
      this.filters = view.filters ?? this.filters;
      this._sort = view.sort ?? this._sort;
      this.pageSize = view.pageSize ?? this.pageSize;
      this.page = 1;
    }

    this.dispatchTableEvent<DataTableViewChangeDetail>("loomi-view-change", { viewId, view });
  };

  private handleColumnToggle(event: Event, columnKey: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const visibleKeys = new Set(this.getVisibleColumnKeys());

    if (checked) {
      visibleKeys.add(columnKey);
    } else {
      visibleKeys.delete(columnKey);
    }

    this.visibleColumns = this.columns.map((column) => column.key).filter((key) => visibleKeys.has(key));

    const detail: DataTableColumnVisibilityChangeDetail = {
      visibleColumns: this.visibleColumns,
      hiddenColumns: this.columns.map((column) => column.key).filter((key) => !visibleKeys.has(key))
    };

    this.dispatchTableEvent("loomi-column-visibility-change", detail);
  }

  private handleSort(column: DataTableColumn<TRecord>) {
    if (!column.sortable) {
      return;
    }

    if (this._sort?.key !== column.key) {
      this._sort = { key: column.key, direction: "asc" };
    } else if (this._sort.direction === "asc") {
      this._sort = { key: column.key, direction: "desc" };
    } else {
      this._sort = null;
    }

    this.page = 1;
    this.dispatchTableEvent<DataTableSortChangeDetail>("loomi-sort-change", { sort: this._sort });
  }

  private handleRowSelect(event: Event, row: TRecord) {
    const checked = (event.target as HTMLInputElement).checked;
    const rowKey = this.getRowKey(row);
    const selected = new Set(this.selectedKeys);

    if (checked) {
      selected.add(rowKey);
    } else {
      selected.delete(rowKey);
    }

    this.selectedKeys = [...selected];
    this.emitSelectionChange();
  }

  private handleSelectAll(event: Event, rows: TRecord[]) {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set(this.selectedKeys);

    for (const row of rows) {
      const rowKey = this.getRowKey(row);
      if (checked) {
        selected.add(rowKey);
      } else {
        selected.delete(rowKey);
      }
    }

    this.selectedKeys = [...selected];
    this.emitSelectionChange();
  }

  private handlePageSizeChange = (event: Event) => {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
    this.emitPageChange();
  };

  private handleExport(columns: DataTableColumn<TRecord>[]) {
    const detail: DataTableExportRequestDetail<TRecord> = {
      rows: this.getProcessedRows(),
      columns,
      selectedKeys: this.selectedKeys,
      viewId: this.currentViewId
    };

    this.dispatchTableEvent("loomi-export-request", detail);
  }

  private setPage(page: number) {
    const totalPages = this.getTotalPages(this.getTotalRows());
    this.page = Math.max(1, Math.min(page, totalPages));
    this.emitPageChange();
  }

  private emitPageChange() {
    this.dispatchTableEvent<DataTablePageChangeDetail>("loomi-page-change", {
      page: this.page,
      pageSize: this.pageSize
    });
  }

  private emitSelectionChange() {
    const selectedRows = this.data.filter((row) => this.selectedKeys.includes(this.getRowKey(row)));

    this.dispatchTableEvent<DataTableSelectionChangeDetail<TRecord>>("loomi-selection-change", {
      selectedKeys: this.selectedKeys,
      selectedRows
    });
  }

  private emitRowAction(row: TRecord, rowKey: string) {
    this.dispatchTableEvent<DataTableRowActionDetail<TRecord>>("loomi-row-action", { row, rowKey });
  }

  private dispatchTableEvent<TDetail>(name: string, detail: TDetail) {
    this.dispatchEvent(
      new CustomEvent<TDetail>(name, {
        bubbles: true,
        composed: true,
        detail
      })
    );
  }

  private getVisibleColumns() {
    const visibleKeys = this.getVisibleColumnKeys();
    return this.columns.filter((column) => visibleKeys.includes(column.key));
  }

  private getVisibleColumnKeys() {
    if (this.visibleColumns.length > 0) {
      return this.visibleColumns;
    }

    return this.columns.filter((column) => !column.hidden).map((column) => column.key);
  }

  private getPageRows() {
    if (this.serverSide || !this.pagination) {
      return this.getProcessedRows();
    }

    const start = (this.page - 1) * this.pageSize;
    return this.getProcessedRows().slice(start, start + this.pageSize);
  }

  private getProcessedRows() {
    if (this.serverSide) {
      return this.data;
    }

    return this.sortRows(this.filterRows(this.data));
  }

  private filterRows(rows: TRecord[]) {
    const search = this.globalSearch.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        search.length === 0 ||
        this.columns.some((column) => this.formatCellValue(row[column.key]).toLowerCase().includes(search));

      const matchesFilters = this.filters.every((filter) => this.matchesFilter(row, filter));

      return matchesSearch && matchesFilters;
    });
  }

  private matchesFilter(row: TRecord, filter: DataTableFilter) {
    const rawValue = row[filter.key];
    const value = this.formatCellValue(rawValue).toLowerCase();
    const filterValue = String(filter.value).toLowerCase();
    const numericValue = Number(rawValue);
    const numericFilter = Number(filter.value);

    switch (filter.operator) {
      case "equals":
        return value === filterValue;
      case "startsWith":
        return value.startsWith(filterValue);
      case "endsWith":
        return value.endsWith(filterValue);
      case "gt":
        return numericValue > numericFilter;
      case "gte":
        return numericValue >= numericFilter;
      case "lt":
        return numericValue < numericFilter;
      case "lte":
        return numericValue <= numericFilter;
      case "contains":
      default:
        return value.includes(filterValue);
    }
  }

  private sortRows(rows: TRecord[]) {
    if (!this._sort) {
      return rows;
    }

    const direction = this._sort.direction === "asc" ? 1 : -1;
    const sortKey = this._sort.key;

    return [...rows].sort((first, second) => {
      const firstValue = first[sortKey];
      const secondValue = second[sortKey];

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return (firstValue - secondValue) * direction;
      }

      return this.formatCellValue(firstValue).localeCompare(this.formatCellValue(secondValue)) * direction;
    });
  }

  private getTotalRows() {
    return this.serverSide ? this.totalRows || this.data.length : this.getProcessedRows().length;
  }

  private getTotalPages(totalRows: number) {
    return Math.max(1, Math.ceil(totalRows / this.pageSize));
  }

  private getRowKey(row: TRecord) {
    const value = row[this.rowKey];
    return value == null ? JSON.stringify(row) : String(value);
  }

  private getColumnStyle(column: DataTableColumn<TRecord>) {
    const styles: string[] = [];

    if (column.width) {
      styles.push(`width: ${column.width}`);
    }

    if (column.minWidth) {
      styles.push(`min-width: ${column.minWidth}`);
    }

    return styles.join("; ");
  }

  private getAlignClass(column: DataTableColumn<TRecord>) {
    if (column.align === "center") {
      return "align-center";
    }

    if (column.align === "end") {
      return "align-end";
    }

    return "";
  }

  private formatCellValue(value: unknown) {
    if (value == null) {
      return "";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
  }

  private areAllVisibleRowsSelected(rows: TRecord[]) {
    return rows.length > 0 && rows.every((row) => this.selectedKeys.includes(this.getRowKey(row)));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-data-table": LoomiDataTable;
  }
}
