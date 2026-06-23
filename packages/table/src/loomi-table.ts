import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles, cssColor } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import "@loomi/checkbox/loomi-checkbox.js";
import "@loomi/pagination/loomi-pagination.js";
import { componentStyles } from "./generated/styles.css.js";

type Row = Record<string, unknown>;
export interface LoomiActionIcon {
  icon: string;
  /** Event name dispatched in the `action` event detail (defaults to `icon`). */
  name?: string;
  tip?: string;
  color?: string;
}

const SORT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />`;
const SEARCH = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />`;

/**
 * `<loomi-table>` — a data-driven table with search, sorting, pagination, checkable
 * rows (via `<loomi-checkbox>`) and action icons.
 *
 * @fires row-click - `detail: { row }` when a row is clicked.
 * @fires action - `detail: { name, row }` when an action icon is clicked.
 * @fires selection-change - `detail: { ids }` when checkable selection changes.
 * @fires page-change - `detail: { page }` when the page changes.
 */
@customElement("loomi-table")
export class LoomiTable extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Array }) data: Row[] = [];
  @property({ type: Array }) columns: string[] = [];
  @property({ attribute: "exclude-columns" }) excludeColumns = "";
  @property({ attribute: "include-columns" }) includeColumns = "";
  @property({ type: Object, attribute: "column-aliases" }) columnAliases: Record<string, string> = {};

  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) divided = true;
  @property() divider: "regular" | "thin" = "regular";
  @property({ type: Boolean, attribute: "has-hover" }) hasHover = false;
  @property({ type: Boolean, attribute: "has-shadow" }) hasShadow = true;
  @property({ type: Boolean, attribute: "has-border" }) hasBorder = false;
  @property({ type: Boolean }) compact = false;
  @property({ type: Boolean }) celled = false;
  @property({ type: Boolean }) uppercasing = true;

  @property({ type: Boolean }) searchable = false;
  @property({ attribute: "search-placeholder" }) searchPlaceholder = "Search…";
  @property({ type: Boolean }) sortable = false;
  @property({ attribute: "sortable-columns" }) sortableColumns = "";

  @property({ type: Boolean }) paginated = false;
  @property({ type: Number, attribute: "page-size" }) pageSize = 10;
  @property({ attribute: "pagination-style" }) paginationStyle = "arrows";
  @property({ type: Boolean, attribute: "show-row-numbers" }) showRowNumbers = false;

  @property({ type: Boolean }) checkable = false;
  @property({ attribute: "id-key" }) idKey = "id";
  @property({ attribute: "selected-value" }) selectedValue = "";

  @property({ type: Array, attribute: "action-icons" }) actionIcons: LoomiActionIcon[] = [];
  @property({ attribute: "actions-title" }) actionsTitle = "actions";
  @property({ attribute: "no-data-message" }) noDataMessage = "No records to display";
  @property({ type: Boolean }) clickable = false;

  @state() private query = "";
  @state() private sortKey = "";
  @state() private sortDir: "asc" | "desc" = "asc";
  @state() private page = 1;
  @state() private checked = new Set<string>();
  @state() private initialized = false;

  override willUpdate(): void {
    if (!this.initialized && this.selectedValue) {
      this.checked = new Set(this.selectedValue.split(",").map((s) => s.trim()).filter(Boolean));
      this.initialized = true;
    }
  }

  /** Currently selected row ids (when `checkable`). */
  get selectedIds(): string[] {
    return [...this.checked];
  }

  private get cols(): string[] {
    let cols = this.columns.length
      ? this.columns
      : this.data.length
        ? Object.keys(this.data[0])
        : [];
    if (this.includeColumns) {
      const inc = this.includeColumns.split(",").map((s) => s.trim());
      cols = inc.filter((c) => cols.includes(c));
    } else if (this.excludeColumns) {
      const exc = this.excludeColumns.split(",").map((s) => s.trim());
      cols = cols.filter((c) => !exc.includes(c));
    }
    return cols;
  }

  private heading(col: string): string {
    return this.columnAliases[col] ?? col.replace(/_/g, " ");
  }

  private isSortable(col: string): boolean {
    if (!this.sortable) return false;
    if (!this.sortableColumns) return true;
    return this.sortableColumns.split(",").map((s) => s.trim()).includes(col);
  }

  private rowId(row: Row, i: number): string {
    return String(row[this.idKey] ?? i);
  }

  private get processed(): Row[] {
    let rows = [...this.data];
    if (this.query) {
      const q = this.query.toLowerCase();
      rows = rows.filter((r) => this.cols.some((c) => String(r[c] ?? "").toLowerCase().includes(q)));
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
    const start = (this.page - 1) * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }

  private toggleSort(col: string): void {
    if (this.sortKey === col) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    else {
      this.sortKey = col;
      this.sortDir = "asc";
    }
  }

  private emitSelection(): void {
    this.dispatchEvent(
      new CustomEvent("selection-change", { bubbles: true, composed: true, detail: { ids: [...this.checked] } }),
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

  private renderActionIcon(item: LoomiActionIcon, row: Row): TemplateResult {
    const path = getLoomiIcon(item.icon);
    const style = item.color ? `--_loomi-accent:${cssColor(item.color, 600)}` : nothing;
    return html`<button
      class="loomi-action"
      title=${item.tip ?? nothing}
      aria-label=${item.tip ?? item.icon}
      style=${style}
      @click=${(e: Event) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("action", { bubbles: true, composed: true, detail: { name: item.name ?? item.icon, row } }));
      }}
    >
      ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : item.icon}
    </button>`;
  }

  override render(): TemplateResult {
    const cols = this.cols;
    const rows = this.pageRows;
    const colSpan = cols.length + (this.checkable ? 1 : 0) + (this.showRowNumbers ? 1 : 0) + (this.actionIcons.length ? 1 : 0);
    const tableCls = [
      this.striped ? "striped" : "",
      this.divided ? "divided" : "",
      this.divider === "thin" ? "thin" : "",
      this.hasHover ? "hoverable" : "",
      this.compact ? "compact" : "",
      this.celled ? "celled" : "",
      this.clickable ? "clickable" : "",
    ].join(" ");

    return html`<div class="loomi-wrap">
      ${this.searchable
        ? html`<div class="loomi-searchbar">
            <svg class="loomi-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${SEARCH}</svg>
            <input class="loomi-search" type="text" placeholder=${this.searchPlaceholder}
              .value=${this.query}
              @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; this.page = 1; }} />
          </div>`
        : nothing}

      <div class="loomi-scroll ${this.hasBorder ? "bordered" : ""} ${this.hasShadow ? "shadow" : ""}">
        <table class=${tableCls}>
          <thead>
            <tr>
              ${this.checkable
                ? html`<th class="loomi-check-col"><loomi-checkbox .checked=${this.allChecked} @change=${(e: Event) => this.toggleAll((e.target as HTMLInputElement & { checked: boolean }).checked)}></loomi-checkbox></th>`
                : nothing}
              ${this.showRowNumbers ? html`<th class="loomi-num-col ${this.uppercasing ? "uppercasing" : ""}">#</th>` : nothing}
              ${cols.map((c) => {
                const sortable = this.isSortable(c);
                const active = this.sortKey === c;
                return html`<th
                  class="${this.uppercasing ? "uppercasing" : ""} ${sortable ? "sortable" : ""}"
                  @click=${sortable ? () => this.toggleSort(c) : nothing}
                >
                  <span class="loomi-th-inner">
                    ${this.heading(c)}
                    ${sortable ? html`<svg class="loomi-sort-ico ${active ? "active" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">${SORT}</svg>` : nothing}
                  </span>
                </th>`;
              })}
              ${this.actionIcons.length ? html`<th class="${this.uppercasing ? "uppercasing" : ""}">${this.actionsTitle}</th>` : nothing}
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0
              ? html`<tr><td class="loomi-empty" colspan=${colSpan}>${this.noDataMessage}</td></tr>`
              : rows.map((row, i) => {
                  const id = this.rowId(row, (this.paginated ? (this.page - 1) * this.pageSize : 0) + i);
                  return html`<tr @click=${() => this.dispatchEvent(new CustomEvent("row-click", { bubbles: true, composed: true, detail: { row } }))}>
                    ${this.checkable
                      ? html`<td class="loomi-check-col"><loomi-checkbox no-clearing .checked=${this.checked.has(id)} @click=${(e: Event) => e.stopPropagation()} @change=${(e: Event) => this.toggleRow(id, (e.target as HTMLInputElement & { checked: boolean }).checked)}></loomi-checkbox></td>`
                      : nothing}
                    ${this.showRowNumbers ? html`<td class="loomi-num-col">${(this.paginated ? (this.page - 1) * this.pageSize : 0) + i + 1}</td>` : nothing}
                    ${cols.map((c) => html`<td>${row[c] as string}</td>`)}
                    ${this.actionIcons.length
                      ? html`<td><span class="loomi-actions" @click=${(e: Event) => e.stopPropagation()}>${this.actionIcons.map((a) => this.renderActionIcon(a, row))}</span></td>`
                      : nothing}
                  </tr>`;
                })}
          </tbody>
        </table>
      </div>

      ${this.paginated && this.processed.length > this.pageSize
        ? html`<loomi-pagination
            .total=${this.processed.length}
            .pageSize=${this.pageSize}
            .page=${this.page}
            pagination-style=${this.paginationStyle}
            @page-change=${(e: CustomEvent) => { this.page = e.detail.page; this.dispatchEvent(new CustomEvent("page-change", { bubbles: true, composed: true, detail: e.detail })); }}
          ></loomi-pagination>`
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-table": LoomiTable;
  }
}
