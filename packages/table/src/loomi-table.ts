import { html, nothing, render as litRender, svg, type PropertyValues, type TemplateResult } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, accentVars, loomiDefaultText, loomiStyles, cssColor } from "@loomidev/core";
import { getLoomiIcon, type LoomiIconVariant } from "@loomidev/icons";
import "@loomidev/checkbox/loomi-checkbox.js";
import "@loomidev/input/loomi-input.js";
import "@loomidev/pagination/loomi-pagination.js";
import { componentStyles } from "./generated/styles.css.js";

type Row = Record<string, unknown>;

export interface LoomiActionIcon {
  icon: string;
  /** Event name dispatched in the `action` event detail (defaults to `icon`). */
  name?: string;
  tip?: string;
  color?: string;
  click?: string;
  iconType?: LoomiIconVariant;
  icon_type?: LoomiIconVariant;
  buttonOutline?: boolean;
  button_outline?: boolean;
}

const SORT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />`;
const DEFAULT_SEARCH_PLACEHOLDER = "Search table below...";
const DEFAULT_ACTIONS_TITLE = "actions";
const DEFAULT_NO_DATA_MESSAGE = "No records to display";
const DEFAULT_TOTAL_LABEL = "Showing :a to :b of :c records";

const booleanConverter = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false" && value !== "0";
  },
  toAttribute(value: boolean): string {
    return value ? "true" : "false";
  },
};

function csv(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fillTemplate(template: string, row: Row): string {
  return template.replace(/\{([\w.-]+)\}/g, (_, key: string) => escapeHtml(row[key]));
}

/**
 * `<loomi-table>` — a BladewindUI-inspired data table with manual slots, dynamic
 * rows, search, sorting, grouping, selection, checkboxes, pagination, empty states,
 * custom row templates and action icons.
 *
 * @slot header - Manual `<th>` cells, or a `<template>` for custom layout headings.
 * @slot row - Optional `<template>` used when `layout="custom"` and `data` is set.
 * @slot - Manual `<tr>` rows when not using `data`.
 * @fires row-click - `detail: { row, id }` when a row is clicked.
 * @fires action - `detail: { name, row, action, click }` when an action icon is clicked.
 * @fires action-call - `detail: { name, row, action, click, resolvedClick }` for Bladewind-style click strings.
 * @fires selection-change - `detail: { ids, rows, selectedValue }` when selected rows change.
 * @fires empty-action - `detail: { action }` when the empty-state button is clicked.
 * @fires page-change - `detail: { page }` when the page changes.
 */
@customElement("loomi-table")
export class LoomiTable extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() name = "";
  @property({ type: Array }) data: Row[] = [];
  @property({ type: Array }) columns: string[] = [];
  @property({ attribute: "exclude-columns" }) excludeColumns = "";
  @property({ attribute: "exclude_columns" }) excludeColumnsAlias = "";
  @property({ attribute: "include-columns" }) includeColumns = "";
  @property({ attribute: "include_columns" }) includeColumnsAlias = "";
  @property({ type: Object, attribute: "column-aliases" }) columnAliases: Record<string, string> = {};
  @property({ type: Object, attribute: "column_aliases" }) columnAliasesAlias?: Record<string, string>;
  @property() layout: "auto" | "custom" = "auto";
  @property({ attribute: "row-template" }) rowTemplate = "";
  @property({ attribute: "row_template" }) rowTemplateAlias = "";

  @property({ converter: booleanConverter }) striped = false;
  @property({ converter: booleanConverter }) divided = true;
  @property() divider: "regular" | "thin" = "regular";
  @property({ converter: booleanConverter, attribute: "has-hover" }) hasHover = false;
  @property({ converter: booleanConverter, attribute: "has_hover" }) hasHoverAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "has-shadow" }) hasShadow = true;
  @property({ converter: booleanConverter, attribute: "has_shadow" }) hasShadowAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "has-border" }) hasBorder = false;
  @property({ converter: booleanConverter, attribute: "has_border" }) hasBorderAlias?: boolean;
  @property({ converter: booleanConverter }) compact = false;
  @property({ converter: booleanConverter }) celled = false;
  @property({ converter: booleanConverter }) transparent = false;
  @property({ converter: booleanConverter }) uppercasing = true;

  @property({ converter: booleanConverter }) searchable = false;
  @property({ attribute: "search-container" }) searchContainer = "";
  @property({ attribute: "search-placeholder" }) searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER;
  @property({ attribute: "search_placeholder" }) searchPlaceholderAlias = "";
  @property() locale = "";
  @property({ converter: booleanConverter }) sortable = false;
  @property({ attribute: "sortable-columns" }) sortableColumns = "";
  @property({ attribute: "sortable_columns" }) sortableColumnsAlias = "";

  @property({ converter: booleanConverter }) paginated = false;
  @property({ type: Number, attribute: "page-size" }) pageSize = 25;
  @property({ type: Number, attribute: "page_size" }) pageSizeAlias?: number;
  @property({ attribute: "pagination-style" }) paginationStyle = "arrows";
  @property({ attribute: "pagination_style" }) paginationStyleAlias = "";
  @property({ converter: booleanConverter, attribute: "show-row-numbers" }) showRowNumbers = false;
  @property({ converter: booleanConverter, attribute: "show_row_numbers" }) showRowNumbersAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "show-total" }) showTotal = true;
  @property({ converter: booleanConverter, attribute: "show_total" }) showTotalAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "show-page-number" }) showPageNumber = true;
  @property({ converter: booleanConverter, attribute: "show_page_number" }) showPageNumberAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "show-total-pages" }) showTotalPages = false;
  @property({ converter: booleanConverter, attribute: "show_total_pages" }) showTotalPagesAlias?: boolean;
  @property({ type: Number, attribute: "default-page" }) defaultPage = 1;
  @property({ type: Number, attribute: "default_page" }) defaultPageAlias?: number;
  @property({ type: Number }) limit = 0;
  @property({ attribute: "total-label" }) totalLabel = DEFAULT_TOTAL_LABEL;
  @property({ attribute: "total_label" }) totalLabelAlias = "";

  @property({ converter: booleanConverter }) selectable = false;
  @property({ converter: booleanConverter }) checkable = false;
  @property({ attribute: "id-key" }) idKey = "id";
  @property({ attribute: "id_key" }) idKeyAlias = "";
  @property({ attribute: "selected-value" }) selectedValue = "";
  @property({ attribute: "selected_value" }) selectedValueAlias = "";

  @property({ type: Array, attribute: "action-icons" }) actionIcons: LoomiActionIcon[] = [];
  @property({ type: Array, attribute: "action_icons" }) actionIconsAlias?: LoomiActionIcon[];
  @property({ attribute: "actions-title" }) actionsTitle = DEFAULT_ACTIONS_TITLE;
  @property({ attribute: "actions_title" }) actionsTitleAlias = "";
  @property({ attribute: "no-data-message" }) noDataMessage = DEFAULT_NO_DATA_MESSAGE;
  @property({ attribute: "no_data_message" }) noDataMessageAlias = "";
  @property({ converter: booleanConverter, attribute: "message-as-empty-state" }) messageAsEmptyState = false;
  @property({ converter: booleanConverter, attribute: "message_as_empty_state" }) messageAsEmptyStateAlias?: boolean;
  @property() image = "empty-state.svg";
  @property() heading = "";
  @property({ attribute: "button-label" }) buttonLabel = "";
  @property({ attribute: "button_label" }) buttonLabelAlias = "";
  @property({ converter: booleanConverter, attribute: "show-image" }) showImage = true;
  @property({ converter: booleanConverter, attribute: "show_image" }) showImageAlias?: boolean;
  @property({ attribute: "onclick" }) emptyOnclick = "";
  @property({ attribute: "groupby" }) groupBy = "";
  @property({ attribute: "group-by" }) groupByAlias = "";
  @property({ converter: booleanConverter }) clickable = false;
  @property() nonce = "";

  @state() private query = "";
  @state() private sortKey = "";
  @state() private sortDir: "asc" | "desc" = "asc";
  @state() private page = 1;
  @state() private checked = new Set<string>();
  @state() private initialized = false;
  private externalSearchMount?: HTMLDivElement;

  override willUpdate(): void {
    if (!this.initialized) {
      const selected = this.selectedValueAlias || this.selectedValue;
      if (selected) this.checked = new Set(csv(selected));
      this.page = this.effectiveDefaultPage;
      this.initialized = true;
    }
  }

  /** Currently selected row ids. */
  get selectedIds(): string[] {
    return [...this.checked];
  }

  /** Currently selected row objects. */
  get selectedRows(): Row[] {
    return this.sourceRows.filter((row, i) => this.checked.has(this.rowId(row, i)));
  }

  private get effectiveColumns(): string[] {
    let cols = this.columns.length
      ? this.columns
      : this.data.length
        ? Object.keys(this.data[0])
        : Object.keys(this.effectiveColumnAliases);
    const include = this.includeColumnsAlias || this.includeColumns;
    const exclude = this.excludeColumnsAlias || this.excludeColumns;
    if (include) {
      const inc = csv(include);
      cols = inc.filter((c) => cols.includes(c) || this.effectiveColumnAliases[c]);
    } else if (exclude) {
      const exc = csv(exclude);
      cols = cols.filter((c) => !exc.includes(c));
    }
    return cols;
  }

  private get effectiveColumnAliases(): Record<string, string> {
    return this.columnAliasesAlias ?? this.columnAliases ?? {};
  }

  private get effectiveActions(): LoomiActionIcon[] {
    return this.actionIconsAlias ?? this.actionIcons ?? [];
  }

  private get effectivePageSize(): number {
    return Math.max(1, Number(this.pageSizeAlias ?? this.pageSize) || 25);
  }

  private get effectiveDefaultPage(): number {
    return Math.max(1, Number(this.defaultPageAlias ?? this.defaultPage) || 1);
  }

  private get effectiveIdKey(): string {
    return this.idKeyAlias || this.idKey;
  }

  private get sourceRows(): Row[] {
    const limit = Number(this.limit) || 0;
    return limit > 0 ? this.data.slice(0, limit) : this.data;
  }

  private headingText(col: string): string {
    return this.effectiveColumnAliases[col] ?? col.replace(/_/g, " ");
  }

  private isSortable(col: string): boolean {
    if (!this.sortable) return false;
    const sortableColumns = this.sortableColumnsAlias || this.sortableColumns;
    if (!sortableColumns) return true;
    return csv(sortableColumns).includes(col);
  }

  private rowId(row: Row, i: number): string {
    return String(row[this.effectiveIdKey] ?? i);
  }

  private get processed(): Row[] {
    let rows = [...this.sourceRows];
    if (this.query) {
      const q = this.query.toLowerCase();
      rows = rows.filter((r) => this.effectiveColumns.some((c) => String(r[c] ?? "").toLowerCase().includes(q)));
    }
    if (this.sortKey) {
      const k = this.sortKey;
      rows.sort((a, b) => {
        const av = a[k], bv = b[k];
        const an = Number(av), bn = Number(bv);
        let cmp: number;
        if (!Number.isNaN(an) && !Number.isNaN(bn)) cmp = an - bn;
        else cmp = String(av ?? "").localeCompare(String(bv ?? ""));
        return this.sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }

  private get pageRows(): Row[] {
    const rows = this.processed;
    if (!this.paginated) return rows;
    const start = (this.page - 1) * this.effectivePageSize;
    return rows.slice(start, start + this.effectivePageSize);
  }

  private get rowTemplateHtml(): string {
    const template = this.querySelector<HTMLTemplateElement>('template[slot="row"]');
    return template?.innerHTML || this.rowTemplateAlias || this.rowTemplate;
  }

  private get headerTemplateHtml(): string {
    const template = this.querySelector<HTMLTemplateElement>('template[slot="header"]');
    return template?.innerHTML || "";
  }

  private get hasManualRows(): boolean {
    return [...this.children].some((child) => {
      if (child instanceof HTMLTemplateElement) return false;
      const slot = child.getAttribute("slot") || "";
      return slot !== "header" && slot !== "row";
    });
  }

  private toggleSort(col: string): void {
    if (this.sortKey === col) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    else {
      this.sortKey = col;
      this.sortDir = "asc";
    }
  }

  private emitSelection(): void {
    this.selectedValue = [...this.checked].join(",");
    this.dispatchEvent(
      new CustomEvent("selection-change", {
        bubbles: true,
        composed: true,
        detail: { ids: this.selectedIds, rows: this.selectedRows, selectedValue: this.selectedValue },
      }),
    );
  }

  private toggleRow(id: string, on: boolean): void {
    const next = new Set(this.checked);
    if (on) next.add(id);
    else next.delete(id);
    this.checked = next;
    this.emitSelection();
  }

  private toggleAll(on: boolean): void {
    const next = new Set(this.checked);
    this.processed.forEach((r, i) => {
      const id = this.rowId(r, i);
      if (on) next.add(id);
      else next.delete(id);
    });
    this.checked = next;
    this.emitSelection();
  }

  private get allChecked(): boolean {
    const rows = this.processed;
    return rows.length > 0 && rows.every((r, i) => this.checked.has(this.rowId(r, i)));
  }

  private resolveClick(click: string, row: Row): string {
    return click.replace(/\{([\w.-]+)\}/g, (_, key: string) => String(row[key] ?? ""));
  }

  private callNamedAction(action: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent("action-call", { bubbles: true, composed: true, detail }));
    const match = action.match(/^([A-Za-z_$][\w$]*)\(\)$/);
    if (!match) return;
    const fn = (globalThis as unknown as Record<string, unknown>)[match[1]];
    if (typeof fn === "function") (fn as () => void)();
  }

  private renderActionIcon(item: LoomiActionIcon, row: Row): TemplateResult {
    const variant = item.iconType ?? item.icon_type ?? "outline";
    const path = getLoomiIcon(item.icon, variant);
    const filled = (item.buttonOutline ?? item.button_outline) === false;
    const style = `${accentVars(item.color || "secondary")}--_loomi-accent-bg:${cssColor(item.color || "secondary", 600)}`;
    return html`<button
      class="loomi-action ${filled ? "filled" : ""}"
      title=${item.tip ?? nothing}
      aria-label=${item.tip ?? item.icon}
      style=${style}
      @click=${(e: Event) => {
        e.stopPropagation();
        const name = item.name ?? item.icon;
        const resolvedClick = item.click ? this.resolveClick(item.click, row) : "";
        this.dispatchEvent(new CustomEvent("action", { bubbles: true, composed: true, detail: { name, row, action: item, click: item.click, resolvedClick } }));
        if (resolvedClick) this.callNamedAction(resolvedClick, { name, row, action: item, click: item.click, resolvedClick });
      }}
    >
      ${path
        ? html`<svg viewBox="0 0 24 24" fill=${variant === "solid" ? "currentColor" : "none"} stroke=${variant === "solid" ? "none" : "currentColor"} stroke-width="1.6" aria-hidden="true">${path}</svg>`
        : item.icon}
    </button>`;
  }

  private onRowClick(row: Row, id: string): void {
    if (this.selectable) this.toggleRow(id, !this.checked.has(id));
    this.dispatchEvent(new CustomEvent("row-click", { bubbles: true, composed: true, detail: { row, id } }));
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("searchContainer")) this.removeExternalSearch();
    this.renderExternalSearch();
  }

  override disconnectedCallback(): void {
    this.removeExternalSearch();
    super.disconnectedCallback();
  }

  private get searchField(): TemplateResult {
    const searchPlaceholder = loomiDefaultText(
      this.searchPlaceholderAlias || this.searchPlaceholder,
      DEFAULT_SEARCH_PLACEHOLDER,
      "table.searchPlaceholder",
      this.locale,
    );
    return html`<loomi-input
      class="loomi-search-input"
      type="search"
      size="small"
      no-clearing
      clearable
      prefix-icon="magnifying-glass"
      .placeholder=${searchPlaceholder}
      .value=${this.query}
      .locale=${this.locale}
      @input=${(e: Event) => {
        this.query = (e.target as HTMLElement & { value: string }).value;
        this.page = 1;
      }}
    ></loomi-input>`;
  }

  private removeExternalSearch(): void {
    if (!this.externalSearchMount) return;
    litRender(nothing, this.externalSearchMount);
    this.externalSearchMount.remove();
    this.externalSearchMount = undefined;
  }

  private renderExternalSearch(): void {
    if (!this.searchable || !this.searchContainer) {
      this.removeExternalSearch();
      return;
    }

    const container = document.querySelector<HTMLElement>(this.searchContainer);
    if (!container) {
      this.removeExternalSearch();
      return;
    }

    if (!this.externalSearchMount || this.externalSearchMount.parentElement !== container) {
      this.removeExternalSearch();
      this.externalSearchMount = document.createElement("div");
      this.externalSearchMount.className = "loomi-table-search-container";
      container.append(this.externalSearchMount);
    }
    litRender(this.searchField, this.externalSearchMount);
  }

  private renderEmpty(colSpan: number, noDataMessage: string): TemplateResult {
    const messageAsEmptyState = this.messageAsEmptyStateAlias ?? this.messageAsEmptyState;
    if (!messageAsEmptyState) return html`<tr><td class="loomi-empty" colspan=${colSpan}>${noDataMessage}</td></tr>`;
    const showImage = this.showImageAlias ?? this.showImage;
    const buttonLabel = this.buttonLabelAlias || this.buttonLabel;
    return html`<tr><td class="loomi-empty" colspan=${colSpan}>
      <div class="loomi-empty-state">
        ${showImage ? html`<img src=${this.image} alt="" />` : nothing}
        ${this.heading ? html`<div class="loomi-empty-heading">${this.heading}</div>` : nothing}
        <div>${noDataMessage}</div>
        ${buttonLabel
          ? html`<button class="loomi-empty-button" type="button" @click=${() => {
              const action = this.emptyOnclick;
              this.dispatchEvent(new CustomEvent("empty-action", { bubbles: true, composed: true, detail: { action } }));
              if (action) this.callNamedAction(action, { action });
            }}>${buttonLabel}</button>`
          : nothing}
      </div>
    </td></tr>`;
  }

  private renderHeadingCell(col: string): TemplateResult {
    const sortable = this.isSortable(col);
    const active = this.sortKey === col;
    return html`<th
      class="${this.uppercasing ? "uppercasing" : ""} ${sortable ? "sortable" : ""}"
      @click=${sortable ? () => this.toggleSort(col) : nothing}
    >
      <span class="loomi-th-inner">
        ${this.headingText(col)}
        ${sortable ? html`<svg class="loomi-sort-ico ${active ? "active" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${SORT}</svg>` : nothing}
      </span>
    </th>`;
  }

  private renderAutoRow(row: Row, id: string, index: number, selected: boolean): TemplateResult {
    const cols = this.effectiveColumns;
    const offset = this.paginated ? (this.page - 1) * this.effectivePageSize : 0;
    return html`<tr class=${selected ? "selected" : ""} data-id=${id} @click=${() => this.onRowClick(row, id)}>
      ${this.checkable
        ? html`<td class="loomi-check-col"><loomi-checkbox no-clearing .checked=${selected} @click=${(e: Event) => e.stopPropagation()} @change=${(e: Event) => this.toggleRow(id, (e.target as HTMLInputElement & { checked: boolean }).checked)}></loomi-checkbox></td>`
        : nothing}
      ${(this.showRowNumbersAlias ?? this.showRowNumbers) ? html`<td class="loomi-num-col">${offset + index + 1}</td>` : nothing}
      ${cols.map((c) => html`<td data-row-id=${id} data-column=${c}>${row[c] as string}</td>`)}
      ${this.effectiveActions.length
        ? html`<td class="loomi-actions-col"><span class="loomi-actions" @click=${(e: Event) => e.stopPropagation()}>${this.effectiveActions.map((a) => this.renderActionIcon(a, row))}</span></td>`
        : nothing}
    </tr>`;
  }

  private renderCustomRows(): TemplateResult {
    const template = this.rowTemplateHtml;
    if (!template) return html`<slot></slot>`;
    return html`${this.pageRows.map((row) => unsafeHTML(fillTemplate(template, row)))}`;
  }

  private renderBody(colSpan: number, noDataMessage: string): TemplateResult[] | TemplateResult {
    if (this.data.length === 0 && this.hasManualRows) return html`<slot></slot>`;

    if (this.layout === "custom") {
      if (this.pageRows.length === 0 && this.data.length > 0) return this.renderEmpty(colSpan, noDataMessage);
      if (this.data.length === 0 && this.rowTemplateHtml) return this.renderEmpty(colSpan, noDataMessage);
      return this.renderCustomRows();
    }

    const rows = this.pageRows;
    if (rows.length === 0) return this.renderEmpty(colSpan, noDataMessage);

    const groupBy = this.groupByAlias || this.groupBy;
    const out: TemplateResult[] = [];
    const offset = this.paginated ? (this.page - 1) * this.effectivePageSize : 0;
    const indexedRows = rows.map((row, i) => ({ row, pageIndex: i, absoluteIndex: offset + i }));
    if (groupBy) {
      const groups = new Map<unknown, typeof indexedRows>();
      indexedRows.forEach((entry) => {
        const key = entry.row[groupBy] ?? "";
        groups.set(key, [...(groups.get(key) ?? []), entry]);
      });
      groups.forEach((entries, groupValue) => {
        out.push(html`<tr class="loomi-group-row"><td colspan=${colSpan}>${groupValue as string}</td></tr>`);
        entries.forEach(({ row, pageIndex, absoluteIndex }) => {
          const id = this.rowId(row, absoluteIndex);
          out.push(this.renderAutoRow(row, id, pageIndex, this.checked.has(id)));
        });
      });
      return out;
    }
    indexedRows.forEach(({ row, pageIndex, absoluteIndex }) => {
      const id = this.rowId(row, absoluteIndex);
      out.push(this.renderAutoRow(row, id, pageIndex, this.checked.has(id)));
    });
    return out;
  }

  override render(): TemplateResult {
    const cols = this.effectiveColumns;
    const actionsTitle = loomiDefaultText(this.actionsTitleAlias || this.actionsTitle, DEFAULT_ACTIONS_TITLE, "table.actionsTitle", this.locale);
    const noDataMessage = loomiDefaultText(
      this.noDataMessageAlias || this.noDataMessage,
      DEFAULT_NO_DATA_MESSAGE,
      "table.noDataMessage",
      this.locale,
    );
    const colSpan = Math.max(1, cols.length + (this.checkable ? 1 : 0) + ((this.showRowNumbersAlias ?? this.showRowNumbers) ? 1 : 0) + (this.effectiveActions.length ? 1 : 0));
    const tableCls = [
      this.striped ? "striped" : "",
      this.divided ? "divided" : "",
      this.divider === "thin" ? "thin" : "",
      (this.hasHoverAlias ?? this.hasHover) ? "hoverable" : "",
      this.compact ? "compact" : "",
      this.celled ? "celled" : "",
      (this.selectable || this.clickable) ? "clickable" : "",
      this.transparent ? "transparent" : "",
    ].join(" ");
    const hasData = this.data.length > 0;
    const hasTemplateHeader = !!this.headerTemplateHtml;

    const shellCls = [
      (this.hasBorderAlias ?? this.hasBorder) ? "bordered" : "",
      (this.hasShadowAlias ?? this.hasShadow) ? "shadow" : "",
    ].join(" ");

    return html`<div class="loomi-wrap">
      <div class="loomi-shell ${shellCls}">
        ${this.searchable
          ? this.searchContainer
            ? nothing
            : html`<div class="loomi-toolbar">${this.searchField}</div>`
          : nothing}

        <div class="loomi-scroll">
          <table class=${tableCls} data-current-page=${this.page}>
            <thead>
              <tr>
                ${this.checkable && hasData
                  ? html`<th class="loomi-check-col"><loomi-checkbox no-clearing .checked=${this.allChecked} @change=${(e: Event) => this.toggleAll((e.target as HTMLInputElement & { checked: boolean }).checked)}></loomi-checkbox></th>`
                  : nothing}
                ${(this.showRowNumbersAlias ?? this.showRowNumbers) && hasData ? html`<th class="loomi-num-col ${this.uppercasing ? "uppercasing" : ""}">#</th>` : nothing}
                ${hasTemplateHeader
                  ? unsafeHTML(this.headerTemplateHtml)
                  : cols.length
                    ? cols.map((c) => this.renderHeadingCell(c))
                    : html`<slot name="header"></slot>`}
                ${this.effectiveActions.length && hasData ? html`<th class="loomi-actions-col ${this.uppercasing ? "uppercasing" : ""}">${actionsTitle}</th>` : nothing}
              </tr>
            </thead>
            <tbody>
              ${this.renderBody(colSpan, noDataMessage)}
            </tbody>
          </table>
        </div>

        ${this.paginated && this.processed.length > this.effectivePageSize
          ? html`<div class="loomi-footer">
              <loomi-pagination
                .total=${this.processed.length}
                .pageSize=${this.effectivePageSize}
                .page=${this.page}
                .locale=${this.locale}
                .paginationStyle=${this.paginationStyleAlias || this.paginationStyle}
                .showTotal=${this.showTotalAlias ?? this.showTotal}
                .showPageNumber=${this.showPageNumberAlias ?? this.showPageNumber}
                .showTotalPages=${this.showTotalPagesAlias ?? this.showTotalPages}
                .totalLabel=${this.totalLabelAlias || this.totalLabel}
                @page-change=${(e: CustomEvent) => { this.page = e.detail.page; this.dispatchEvent(new CustomEvent("page-change", { bubbles: true, composed: true, detail: e.detail })); }}
              ></loomi-pagination>
            </div>`
          : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-table": LoomiTable;
  }
}
