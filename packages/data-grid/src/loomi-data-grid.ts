import { html, nothing, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import { LoomiElement, loomiStyles, watchDarkMode } from "@loomidev/core";
import { dataGridStyles } from "./data-grid-styles.js";
import type { DataGridHost, GridCellCoordinates, GridModule, GridModuleContext } from "./grid-module.js";
import { formatCellValue, getRowMeta, resolveRowKey, orderPinnedColumns, computeColumnPinLayout, SELECTION_COLUMN_WIDTH_PX, type ColumnPinLayout } from "./grid-utils.js";
import type {
  DataGridActiveCell,
  DataGridCellEditDetail,
  DataGridColumn,
  DataGridColumnResizeDetail,
  DataGridDensity,
  DataGridPageChangeDetail,
  DataGridRecord,
  DataGridRowActionDetail,
  DataGridSelectionChangeDetail,
  DataGridSort,
  DataGridSortChangeDetail
} from "./types.js";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_MIN_COLUMN_WIDTH = 60;

@customElement("loomi-data-grid")
export class LoomiDataGrid<TRecord extends DataGridRecord = DataGridRecord>
  extends LoomiElement
  implements DataGridHost<TRecord>
{
  static properties = {
    ...LoomiElement.properties,
    columns: { attribute: false },
    data: { attribute: false },
    modules: { attribute: false },
    selectedKeys: { attribute: false },
    rowKey: { attribute: "row-key" },
    density: { reflect: true },
    emptyTitle: { attribute: "empty-title" },
    emptyDescription: { attribute: "empty-description" },
    maxHeight: { attribute: "max-height" },
    page: { type: Number },
    pageSize: { attribute: "page-size", type: Number },
    totalRows: { attribute: "total-rows", type: Number },
    selectable: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    pagination: { type: Boolean, reflect: true },
    serverSide: { attribute: "server-side", type: Boolean, reflect: true },
    stickyHeader: { attribute: "sticky-header", type: Boolean, reflect: true },
    sort: { attribute: false },
    columnWidths: { attribute: false },
    _activeCell: { state: true },
    _resizingKey: { state: true }
  };

  static override styles = loomiStyles(dataGridStyles);

  columns: DataGridColumn<TRecord>[] = [];
  data: TRecord[] = [];
  /** Opt-in feature modules — filtering, row grouping, tree data, export, and more. See `@loomidev/data-grid/modules/*`. */
  modules: GridModule<TRecord>[] = [];
  selectedKeys: string[] = [];
  rowKey = "id";
  density: DataGridDensity = "comfortable";
  emptyTitle = "No rows found";
  emptyDescription = "Try changing the filters or search term.";
  /** CSS max-height for the scroll container, e.g. `"420px"`. Pairs with `sticky-header` and virtual scrolling. */
  maxHeight = "";
  page = 1;
  pageSize = DEFAULT_PAGE_SIZE;
  totalRows = 0;
  selectable = false;
  loading = false;
  pagination = true;
  serverSide = false;
  stickyHeader = true;

  /** Current sort. Settable up front for an initial sort, or externally for a controlled grid. */
  sort: DataGridSort | null = null;
  /** Per-column widths (px strings), keyed by column key. Populated by drag-resize; settable to restore saved widths. */
  columnWidths: Record<string, string> = {};
  private _activeCell: DataGridActiveCell | null = null;
  private _resizingKey: string | null = null;

  /** Modules currently attached (`attach()` called); reconciled against `modules` on every update. */
  private attachedModules: GridModule<TRecord>[] = [];
  /** Snapshot of the rows/columns from the most recent render, for handlers outside the template. */
  private renderedRows: TRecord[] = [];
  private renderedColumns: DataGridColumn<TRecord>[] = [];
  /** Full processed row set (post filter + sort + shape), exposed to modules via `ctx.rows`. */
  private processedRowsSnapshot: TRecord[] = [];
  private focusPending = false;

  private cleanupDarkWatch?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanupDarkWatch = watchDarkMode((isDark) => {
      this.classList.toggle("is-dark", isDark);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupDarkWatch?.();
    for (const module of this.attachedModules) {
      module.detach?.(this.moduleContext);
    }
    this.attachedModules = [];
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    this.reconcileModules();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (this.focusPending) {
      this.focusPending = false;
      this.focusActiveCell();
    }
  }

  private reconcileModules(): void {
    if (this.modules === this.attachedModules) {
      return;
    }
    for (const module of this.attachedModules) {
      module.detach?.(this.moduleContext);
    }
    this.attachedModules = this.modules;
    for (const module of this.attachedModules) {
      module.attach?.(this.moduleContext);
    }
  }

  private get moduleContext(): GridModuleContext<TRecord> {
    return {
      grid: this,
      columns: this.renderedColumns.length > 0 ? this.renderedColumns : this.columns,
      rows: this.processedRowsSnapshot,
      requestUpdate: () => this.requestUpdate(),
      dispatch: (name, detail) => this.dispatchGridEvent(name, detail),
      getRowKey: (row) => this.getRowKey(row)
    };
  }

  render() {
    const processedRows = this.getProcessedRows(this.moduleContext);
    this.processedRowsSnapshot = processedRows;
    const columns = this.getVisibleColumns(this.moduleContext);
    this.renderedColumns = columns;
    // Rebuild after the snapshots above are current, so toolbar/cell/body hooks see final rows+columns.
    const ctx = this.moduleContext;

    const bodyModule = this.attachedModules.find((module) => module.renderBody);
    const rows = bodyModule ? processedRows : this.getPageRows(processedRows);
    this.renderedRows = rows;

    const totalRows = this.getTotalRows(processedRows);
    const totalPages = this.getTotalPages(totalRows);
    const selectedCount = this.selectedKeys.length;
    const showPagination = this.pagination && !bodyModule;
    const belowTable = this.attachedModules
      .map((module) => module.renderBelowTable?.(processedRows, ctx))
      .filter((content) => content !== undefined);
    const pinLayout = computeColumnPinLayout(
      columns,
      this.columnWidths,
      this.selectable ? SELECTION_COLUMN_WIDTH_PX : 0
    );

    return html`
      <section class="shell" aria-busy=${this.loading ? "true" : "false"}>
        ${this.renderToolbar(selectedCount, ctx)}
        <div class="grid-wrap" style=${this.maxHeight ? `max-height:${this.maxHeight}` : ""}>
          ${this.loading
            ? this.renderLoading()
            : processedRows.length === 0
              ? this.renderEmpty()
              : this.renderTable(columns, rows, bodyModule, ctx, pinLayout)}
        </div>
        ${belowTable.length > 0 ? html`<div class="below-table">${belowTable}</div>` : nothing}
        ${showPagination ? this.renderFooter(totalRows, totalPages) : nothing}
      </section>
    `;
  }

  private renderToolbar(selectedCount: number, ctx: GridModuleContext<TRecord>) {
    const startExtras = this.attachedModules
      .map((module) => module.renderToolbarStart?.(ctx))
      .filter((content) => content !== undefined);
    const endExtras = this.attachedModules
      .map((module) => module.renderToolbarEnd?.(ctx))
      .filter((content) => content !== undefined);

    if (startExtras.length === 0 && endExtras.length === 0 && selectedCount === 0) {
      return nothing;
    }

    return html`
      <div class="toolbar">
        <div class="toolbar-group">${startExtras}</div>
        <div class="toolbar-group">
          ${selectedCount > 0 ? html`<span class="selection-count">${selectedCount} selected</span>` : nothing}
          ${endExtras}
        </div>
      </div>
    `;
  }

  private renderLoading() {
    return html`
      <div class="loading" role="status">
        <strong>Loading rows</strong>
        <span>Fetching the latest grid data.</span>
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

  private renderTable(
    columns: DataGridColumn<TRecord>[],
    rows: TRecord[],
    bodyModule: GridModule<TRecord> | undefined,
    ctx: GridModuleContext<TRecord>,
    pinLayout: ColumnPinLayout
  ) {
    const renderRow = (row: TRecord, rowIndex: number) => this.renderRow(columns, row, rowIndex, pinLayout);

    return html`
      <table @keydown=${this.handleGridKeydown}>
        <colgroup>
          ${this.selectable ? html`<col style="width: ${SELECTION_COLUMN_WIDTH_PX}px" />` : nothing}
          ${columns.map((column) => html`<col style=${this.getColumnWidthStyle(column)} />`)}
        </colgroup>
        <thead>
          <tr>
            ${this.selectable
              ? html`
                  <th class="pin-select-column">
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      .checked=${this.areAllVisibleRowsSelected(rows)}
                      @change=${(event: Event) => this.handleSelectAll(event, rows)}
                    />
                  </th>
                `
              : nothing}
            ${columns.map((column) => this.renderHeaderCell(column, pinLayout))}
          </tr>
        </thead>
        <tbody>
          ${bodyModule ? bodyModule.renderBody!(rows, columns, renderRow, ctx) : rows.map(renderRow)}
        </tbody>
      </table>
    `;
  }

  private renderHeaderCell(column: DataGridColumn<TRecord>, pinLayout: ColumnPinLayout) {
    const sortIndicator = this.sort?.key === column.key ? (this.sort.direction === "asc" ? "▲" : "▼") : "";
    const className = [this.getAlignClass(column), this.getPinCellClass(column, pinLayout)].filter(Boolean).join(" ");
    const pinStyle = this.getPinCellStyle(column, pinLayout);
    const resizable = column.resizable !== false;
    const extra = this.attachedModules
      .map((module) => module.renderHeaderExtra?.(column, this.moduleContext))
      .filter((content) => content !== undefined);

    return html`
      <th
        class=${className || nothing}
        style=${[this.getColumnWidthStyle(column), pinStyle].filter(Boolean).join("; ")}
        title=${column.description ?? nothing}
      >
        <div class="th-content">
          ${column.sortable
            ? html`
                <button type="button" class="sort-button" @click=${() => this.handleSort(column)}>
                  <span>${column.label}</span>
                  <span class="sort-indicator">${sortIndicator}</span>
                </button>
              `
            : html`<span>${column.label}</span>`}
        </div>
        ${extra}
        ${resizable
          ? html`
              <div
                class=${`resize-handle${this._resizingKey === column.key ? " resizing" : ""}`}
                @pointerdown=${(event: PointerEvent) => this.startResize(event, column)}
              ></div>
            `
          : nothing}
      </th>
    `;
  }

  private renderRow(
    columns: DataGridColumn<TRecord>[],
    row: TRecord,
    rowIndex: number,
    pinLayout: ColumnPinLayout
  ) {
    const meta = getRowMeta(row);

    if (meta?.type === "group" || meta?.type === "pivot-header") {
      return this.renderGroupRow(row, columns.length + (this.selectable ? 1 : 0));
    }

    const rowKeyValue = this.getRowKey(row);
    const selected = this.selectedKeys.includes(rowKeyValue);
    const extraRowClass = this.attachedModules
      .map((module) => module.getRowClass?.(row, rowIndex, this.moduleContext))
      .filter((value): value is string => Boolean(value))
      .join(" ");

    return html`
      <tr
        class=${extraRowClass || nothing}
        data-selected=${selected ? "true" : "false"}
        @click=${() => this.emitRowAction(row, rowKeyValue)}
      >
        ${this.selectable
          ? html`
              <td class="pin-select-column">
                <input
                  type="checkbox"
                  aria-label=${`Select row ${rowKeyValue}`}
                  .checked=${selected}
                  @click=${(event: Event) => event.stopPropagation()}
                  @change=${(event: Event) => this.handleRowSelect(event, row)}
                />
              </td>
            `
          : nothing}
        ${columns.map((column, columnIndex) => this.renderDataCell(column, row, rowIndex, columnIndex, pinLayout))}
      </tr>
    `;
  }

  private renderGroupRow(row: TRecord, columnCount: number) {
    const meta = getRowMeta(row)!;
    const aggregateEntries = meta.aggregates ? Object.entries(meta.aggregates) : [];

    return html`
      <tr class="loomi-grid-row-group">
        <td colspan=${columnCount} style=${`padding-left: ${12 + (meta.depth ?? 0) * 16}px`}>
          ${meta.hasChildren !== false
            ? html`
                <button
                  type="button"
                  class="group-toggle"
                  aria-expanded=${meta.expanded ? "true" : "false"}
                  @click=${() => this.toggleRow(row)}
                >
                  ${meta.expanded ? "▾" : "▸"}
                </button>
              `
            : nothing}
          <strong>${meta.groupLabel}</strong>
          ${meta.count != null ? html`<span class="row-count">(${meta.count})</span>` : nothing}
          ${aggregateEntries.map(
            ([key, value]) => html`<span class="row-count">&nbsp;· ${key}: ${formatCellValue(value)}</span>`
          )}
        </td>
      </tr>
    `;
  }

  private renderDataCell(
    column: DataGridColumn<TRecord>,
    row: TRecord,
    rowIndex: number,
    columnIndex: number,
    pinLayout: ColumnPinLayout
  ) {
    const cell: GridCellCoordinates<TRecord> = { row, rowIndex, columnIndex, column };
    const activeCell = this._activeCell ?? { rowIndex: 0, columnIndex: 0 };
    const isActive = activeCell.rowIndex === rowIndex && activeCell.columnIndex === columnIndex;
    const extraCellClass = this.attachedModules
      .map((module) => module.getCellClass?.(cell, this.moduleContext))
      .filter((value): value is string => Boolean(value))
      .join(" ");
    const className = [this.getAlignClass(column), extraCellClass, this.getPinCellClass(column, pinLayout)]
      .filter(Boolean)
      .join(" ");
    const pinStyle = this.getPinCellStyle(column, pinLayout);

    return html`
      <td
        class=${className || nothing}
        style=${pinStyle || nothing}
        tabindex=${isActive ? 0 : -1}
        data-row-index=${rowIndex}
        data-col-index=${columnIndex}
        data-active-cell=${isActive ? "true" : "false"}
        @focus=${() => this.setActiveCell(rowIndex, columnIndex)}
        @pointerdown=${(event: PointerEvent) => this.handleCellPointerDown(cell, event)}
        @pointerenter=${(event: PointerEvent) => this.handleCellPointerEnter(cell, event)}
        @dblclick=${(event: MouseEvent) => {
          for (const module of this.attachedModules) {
            module.onCellDblClick?.(cell, event, this.moduleContext);
          }
        }}
      >
        ${columnIndex === 0 ? this.renderFirstCellContent(column, row, rowIndex) : this.renderCellContent(column, cell)}
      </td>
    `;
  }

  private renderFirstCellContent(column: DataGridColumn<TRecord>, row: TRecord, rowIndex: number) {
    const meta = getRowMeta(row);
    const content = this.renderCellContent(column, { row, rowIndex, columnIndex: 0, column });

    if (!meta || meta.depth == null) {
      return content;
    }

    return html`
      <span class="tree-indent" style=${`width: ${meta.depth * 16}px`}></span>
      ${meta.hasChildren
        ? html`
            <button
              type="button"
              class="group-toggle"
              aria-expanded=${meta.expanded ? "true" : "false"}
              @click=${(event: Event) => {
                event.stopPropagation();
                this.toggleRow(row);
              }}
            >
              ${meta.expanded ? "▾" : "▸"}
            </button>
          `
        : nothing}
      ${content}
    `;
  }

  private renderCellContent(column: DataGridColumn<TRecord>, cell: GridCellCoordinates<TRecord>) {
    for (const module of this.attachedModules) {
      const rendered = module.renderCell?.(cell.row[column.key], cell, this.moduleContext);
      if (rendered !== undefined) {
        return rendered;
      }
    }

    if (column.cellRenderer) {
      return column.cellRenderer({ value: cell.row[column.key], row: cell.row, rowIndex: cell.rowIndex, column });
    }

    if (column.formatter) {
      return column.formatter(cell.row[column.key] as TRecord[keyof TRecord], cell.row);
    }

    return formatCellValue(cell.row[column.key]);
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

  // ---- Column resizing ----------------------------------------------------

  private getColumnWidthStyle(column: DataGridColumn<TRecord>) {
    const width = this.columnWidths[column.key] ?? column.width;
    const styles: string[] = [];
    if (width) {
      styles.push(`width: ${width}`);
    }
    if (column.minWidth) {
      styles.push(`min-width: ${column.minWidth}`);
    }
    if (column.maxWidth) {
      styles.push(`max-width: ${column.maxWidth}`);
    }
    return styles.join("; ");
  }

  private startResize = (event: PointerEvent, column: DataGridColumn<TRecord>): void => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const headerCell = handle.closest("th") as HTMLElement | null;
    const startX = event.clientX;
    const startWidth = headerCell?.getBoundingClientRect().width ?? DEFAULT_MIN_COLUMN_WIDTH;
    const minWidth = column.minWidth ? parseFloat(column.minWidth) : DEFAULT_MIN_COLUMN_WIDTH;

    this._resizingKey = column.key;
    handle.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      const nextWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
      this.columnWidths = { ...this.columnWidths, [column.key]: `${nextWidth}px` };
    };

    const onUp = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      this._resizingKey = null;
      const width = parseFloat(this.columnWidths[column.key] ?? String(startWidth));
      this.dispatchGridEvent<DataGridColumnResizeDetail>("loomi-column-resize", { key: column.key, width });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  // ---- Keyboard navigation -------------------------------------------------

  private handleGridKeydown = (event: KeyboardEvent): void => {
    if (!this._activeCell) {
      return;
    }

    const { rowIndex, columnIndex } = this._activeCell;
    const row = this.renderedRows[rowIndex];
    const column = this.renderedColumns[columnIndex];
    if (!row || !column) {
      return;
    }

    const cell: GridCellCoordinates<TRecord> = { row, rowIndex, columnIndex, column };
    for (const module of this.attachedModules) {
      if (module.onCellKeydown?.(event, cell, this.moduleContext)) {
        event.preventDefault();
        return;
      }
    }

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.moveActiveCell(-1, 0);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.moveActiveCell(1, 0);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.moveActiveCell(0, -1);
        break;
      case "ArrowRight":
        event.preventDefault();
        this.moveActiveCell(0, 1);
        break;
      case "Home":
        event.preventDefault();
        this.setActiveCell(rowIndex, 0);
        break;
      case "End":
        event.preventDefault();
        this.setActiveCell(rowIndex, this.renderedColumns.length - 1);
        break;
      case "PageUp":
        event.preventDefault();
        this.setPage(this.page - 1);
        break;
      case "PageDown":
        event.preventDefault();
        this.setPage(this.page + 1);
        break;
      case " ":
        if (this.selectable) {
          event.preventDefault();
          this.toggleRowSelection(row);
        }
        break;
      case "Enter":
        event.preventDefault();
        this.emitRowAction(row, this.getRowKey(row));
        break;
      default:
        break;
    }
  };

  private moveActiveCell(rowDelta: number, columnDelta: number): void {
    const current = this._activeCell ?? { rowIndex: 0, columnIndex: 0 };
    const nextRow = Math.max(0, Math.min(this.renderedRows.length - 1, current.rowIndex + rowDelta));
    const nextColumn = Math.max(0, Math.min(this.renderedColumns.length - 1, current.columnIndex + columnDelta));
    this.setActiveCell(nextRow, nextColumn);
  }

  private setActiveCell(rowIndex: number, columnIndex: number): void {
    this._activeCell = { rowIndex, columnIndex };
    this.focusPending = true;
  }

  private focusActiveCell(): void {
    if (!this._activeCell) {
      return;
    }
    const selector = `td[data-row-index="${this._activeCell.rowIndex}"][data-col-index="${this._activeCell.columnIndex}"]`;
    const cell = this.shadowRoot?.querySelector<HTMLElement>(selector);
    cell?.focus();
  }

  // ---- Pointer hooks (spreadsheet range selection etc.) --------------------

  private handleCellPointerDown(cell: GridCellCoordinates<TRecord>, event: PointerEvent): void {
    this.setActiveCell(cell.rowIndex, cell.columnIndex);
    for (const module of this.attachedModules) {
      module.onCellPointerDown?.(cell, event, this.moduleContext);
    }
  }

  private handleCellPointerEnter(cell: GridCellCoordinates<TRecord>, event: PointerEvent): void {
    for (const module of this.attachedModules) {
      module.onCellPointerEnter?.(cell, event, this.moduleContext);
    }
  }

  // ---- Sorting --------------------------------------------------------------

  private handleSort(column: DataGridColumn<TRecord>): void {
    if (!column.sortable) {
      return;
    }

    if (this.sort?.key !== column.key) {
      this.sort = { key: column.key, direction: "asc" };
    } else if (this.sort.direction === "asc") {
      this.sort = { key: column.key, direction: "desc" };
    } else {
      this.sort = null;
    }

    this.page = 1;
    this.dispatchGridEvent<DataGridSortChangeDetail>("loomi-sort-change", { sort: this.sort });
  }

  // ---- Selection --------------------------------------------------------------

  private handleRowSelect(event: Event, row: TRecord): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.setRowSelected(row, checked);
  }

  private toggleRowSelection(row: TRecord): void {
    const rowKeyValue = this.getRowKey(row);
    this.setRowSelected(row, !this.selectedKeys.includes(rowKeyValue));
  }

  private setRowSelected(row: TRecord, isSelected: boolean): void {
    const rowKeyValue = this.getRowKey(row);
    const selected = new Set(this.selectedKeys);
    if (isSelected) {
      selected.add(rowKeyValue);
    } else {
      selected.delete(rowKeyValue);
    }
    this.selectedKeys = [...selected];
    this.emitSelectionChange();
  }

  private handleSelectAll(event: Event, rows: TRecord[]): void {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set(this.selectedKeys);

    for (const row of rows) {
      const rowKeyValue = this.getRowKey(row);
      if (checked) {
        selected.add(rowKeyValue);
      } else {
        selected.delete(rowKeyValue);
      }
    }

    this.selectedKeys = [...selected];
    this.emitSelectionChange();
  }

  private areAllVisibleRowsSelected(rows: TRecord[]): boolean {
    const selectableRows = rows.filter((row) => getRowMeta(row)?.type == null || getRowMeta(row)?.type === "data");
    return selectableRows.length > 0 && selectableRows.every((row) => this.selectedKeys.includes(this.getRowKey(row)));
  }

  // ---- Pagination --------------------------------------------------------------

  private setPage(page: number): void {
    const totalPages = this.getTotalPages(this.getTotalRows(this.getProcessedRows(this.moduleContext)));
    this.page = Math.max(1, Math.min(page, totalPages));
    this.emitPageChange();
  }

  private handlePageSizeChange = (event: Event): void => {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.page = 1;
    this.emitPageChange();
  };

  private emitPageChange(): void {
    this.dispatchGridEvent<DataGridPageChangeDetail>("loomi-page-change", { page: this.page, pageSize: this.pageSize });
  }

  // ---- Row grouping / tree toggling (generic; modules react via onGridEvent) --

  private toggleRow(row: TRecord): void {
    const meta = getRowMeta(row);
    this.dispatchGridEvent("loomi-grid-toggle-row", {
      rowKey: this.getRowKey(row),
      row,
      expanded: !(meta?.expanded ?? false)
    });
  }

  private emitRowAction(row: TRecord, rowKeyValue: string): void {
    if (getRowMeta(row)) {
      return;
    }
    this.dispatchGridEvent<DataGridRowActionDetail<TRecord>>("loomi-row-action", { row, rowKey: rowKeyValue });
  }

  // ---- Row processing pipeline --------------------------------------------

  private getVisibleColumns(ctx: GridModuleContext<TRecord>): DataGridColumn<TRecord>[] {
    let columns = this.columns.filter((column) => !column.hidden);
    for (const module of this.attachedModules) {
      if (module.transformColumns) {
        columns = module.transformColumns(columns, ctx);
      }
    }
    return orderPinnedColumns(columns);
  }

  private getProcessedRows(ctx: GridModuleContext<TRecord>): TRecord[] {
    if (this.serverSide) {
      return this.data;
    }

    let rows = this.data;
    for (const module of this.attachedModules) {
      if ((module.stage ?? "filter") === "filter" && module.transformRows) {
        rows = module.transformRows(rows, ctx);
      }
    }

    rows = this.sortRows(rows);

    for (const module of this.attachedModules) {
      if (module.stage === "shape" && module.transformRows) {
        rows = module.transformRows(rows, ctx);
      }
    }

    return rows;
  }

  private sortRows(rows: TRecord[]): TRecord[] {
    if (!this.sort) {
      return rows;
    }

    const direction = this.sort.direction === "asc" ? 1 : -1;
    const sortKey = this.sort.key;

    return [...rows].sort((first, second) => {
      const firstValue = first[sortKey];
      const secondValue = second[sortKey];

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return (firstValue - secondValue) * direction;
      }

      return formatCellValue(firstValue).localeCompare(formatCellValue(secondValue)) * direction;
    });
  }

  private getPageRows(rows: TRecord[]): TRecord[] {
    if (this.serverSide || !this.pagination) {
      return rows;
    }
    const start = (this.page - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }

  private getTotalRows(processedRows: TRecord[]): number {
    return this.serverSide ? this.totalRows || this.data.length : processedRows.length;
  }

  private getTotalPages(totalRows: number): number {
    return Math.max(1, Math.ceil(totalRows / this.pageSize));
  }

  private getAlignClass(column: DataGridColumn<TRecord>): string {
    if (column.align === "center") {
      return "align-center";
    }
    if (column.align === "end") {
      return "align-end";
    }
    return "";
  }

  private getPinCellClass(column: DataGridColumn<TRecord>, pinLayout: ColumnPinLayout): string {
    const classes: string[] = [];
    if (column.pinned === "start") {
      classes.push("pinned-start");
      if (column.key === pinLayout.lastStartKey) {
        classes.push("pin-edge-start");
      }
    }
    if (column.pinned === "end") {
      classes.push("pinned-end");
      if (column.key === pinLayout.firstEndKey) {
        classes.push("pin-edge-end");
      }
    }
    return classes.join(" ");
  }

  private getPinCellStyle(column: DataGridColumn<TRecord>, pinLayout: ColumnPinLayout): string {
    const start = pinLayout.startOffsets.get(column.key);
    if (start != null) {
      return `left: ${start}px`;
    }
    const end = pinLayout.endOffsets.get(column.key);
    if (end != null) {
      return `right: ${end}px`;
    }
    return "";
  }

  // ---- DataGridHost surface (used by modules) ------------------------------

  getRowKey(row: TRecord): string {
    return resolveRowKey(row, this.rowKey);
  }

  dispatchGridEvent<TDetail>(name: string, detail: TDetail): void {
    this.dispatchEvent(new CustomEvent<TDetail>(name, { bubbles: true, composed: true, detail }));
    for (const module of this.attachedModules) {
      module.onGridEvent?.(name, detail, this.moduleContext);
    }
  }

  updateCellValue(rowKeyValue: string, columnKey: string, value: unknown): void {
    const index = this.data.findIndex((row) => this.getRowKey(row) === rowKeyValue);
    if (index === -1) {
      return;
    }

    const previousValue = (this.data[index] as DataGridRecord)[columnKey];
    const nextRow = { ...this.data[index], [columnKey]: value } as TRecord;
    const nextData = [...this.data];
    nextData[index] = nextRow;
    this.data = nextData;

    this.dispatchGridEvent<DataGridCellEditDetail<TRecord>>("loomi-cell-edit", {
      row: nextRow,
      rowKey: rowKeyValue,
      columnKey,
      previousValue,
      value
    });
  }

  private emitSelectionChange(): void {
    const selectedRows = this.data.filter((row) => this.selectedKeys.includes(this.getRowKey(row)));
    this.dispatchGridEvent<DataGridSelectionChangeDetail<TRecord>>("loomi-selection-change", {
      selectedKeys: this.selectedKeys,
      selectedRows
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-data-grid": LoomiDataGrid;
  }
}
