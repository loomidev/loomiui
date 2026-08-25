import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  LoomiElement,
  loomiDefaultText,
  loomiStyles,
  loomiT,
  accentVars,
  type LoomiColor,
} from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPaginationStyle = "arrows" | "numbers" | "dropdown";

const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;
const DEFAULT_TOTAL_LABEL = "Showing :a to :b of :c";
const booleanConverter = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value !== "false" && value !== "0";
  },
  toAttribute(value: boolean): string {
    return value ? "true" : "false";
  },
};

/**
 * `<loomi-pagination>` — page controls driven by `total`, `page-size` and `page`.
 * Emits `loomi-page-change` (`detail: { page }`). Styles: `arrows`, `numbers`, `dropdown`.
 */
@customElement("loomi-pagination")
export class LoomiPagination extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) total = 0;
  @property({ type: Number, attribute: "page-size" }) pageSize = 10;
  @property({ type: Number }) page = 1;
  @property({ attribute: "pagination-style" }) paginationStyle: LoomiPaginationStyle = "arrows";
  @property({ attribute: "pagination_style" }) paginationStyleAlias: LoomiPaginationStyle | "" = "";
  @property({ converter: booleanConverter, attribute: "show-total" }) showTotal = true;
  @property({ converter: booleanConverter, attribute: "show_total" }) showTotalAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "show-page-number" }) showPageNumber = true;
  @property({ converter: booleanConverter, attribute: "show_page_number" })
  showPageNumberAlias?: boolean;
  @property({ converter: booleanConverter, attribute: "show-total-pages" }) showTotalPages = true;
  @property({ converter: booleanConverter, attribute: "show_total_pages" })
  showTotalPagesAlias?: boolean;
  @property({ attribute: "total-label" }) totalLabel = DEFAULT_TOTAL_LABEL;
  @property({ attribute: "total_label" }) totalLabelAlias = "";
  @property() locale = "";
  @property() color: LoomiColor = "primary" as LoomiColor;

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  private go(page: number): void {
    const clamped = Math.min(this.pageCount, Math.max(1, page));
    if (clamped === this.page) return;
    this.page = clamped;
    this.dispatchEvent(
      new CustomEvent("loomi-page-change", {
        bubbles: true,
        composed: true,
        detail: { page: clamped },
      }),
    );
  }

  private totalText(): string {
    if (this.total === 0) return loomiT("pagination.noRecords", {}, this.locale);
    const a = (this.page - 1) * this.pageSize + 1;
    const b = Math.min(this.total, this.page * this.pageSize);
    return loomiDefaultText(
      this.totalLabelAlias || this.totalLabel,
      DEFAULT_TOTAL_LABEL,
      "pagination.totalLabel",
      this.locale,
    )
      .replace(":a", String(a))
      .replace(":b", String(b))
      .replace(":c", String(this.total));
  }

  /** Page numbers with ellipses, e.g. [1, '…', 4, 5, 6, '…', 20]. */
  private numbers(): (number | "…")[] {
    const n = this.pageCount;
    const cur = this.page;
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
    const out: (number | "…")[] = [1];
    const start = Math.max(2, cur - 1);
    const end = Math.min(n - 1, cur + 1);
    if (start > 2) out.push("…");
    for (let i = start; i <= end; i++) out.push(i);
    if (end < n - 1) out.push("…");
    out.push(n);
    return out;
  }

  private btn(
    content: TemplateResult | string,
    opts: { disabled?: boolean; active?: boolean; onClick: () => void; label?: string },
  ): TemplateResult {
    // Numbered buttons name themselves through their text; the prev/next arrows are
    // icon-only (the svg is aria-hidden), so they need an explicit label or they reach
    // assistive tech as unlabelled buttons.
    return html`<button
      class="loomi-page ${opts.active ? "active" : ""}"
      aria-label=${opts.label ?? nothing}
      ?disabled=${opts.disabled}
      @click=${opts.onClick}
    >${content}</button>`;
  }

  private get prevLabel(): string {
    return loomiT("pagination.previous", {}, this.locale);
  }
  private get nextLabel(): string {
    return loomiT("pagination.next", {}, this.locale);
  }

  private renderControls(): TemplateResult {
    const prev = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg>`;
    const next = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg>`;

    const paginationStyle = this.paginationStyleAlias || this.paginationStyle;
    const showPageNumber = this.showPageNumberAlias ?? this.showPageNumber;
    const showTotalPages = this.showTotalPagesAlias ?? this.showTotalPages;

    if (paginationStyle === "dropdown") {
      return html`<span class="loomi-controls">
        ${this.btn(prev, { disabled: this.page <= 1, label: this.prevLabel, onClick: () => this.go(this.page - 1) })}
        <select class="loomi-select" aria-label=${loomiT("pagination.selectPage", {}, this.locale)} .value=${String(this.page)} @change=${(e: Event) => this.go(Number((e.target as HTMLSelectElement).value))}>
          ${Array.from({ length: this.pageCount }, (_, i) => i + 1).map(
            (p) =>
              html`<option value=${p} ?selected=${p === this.page}>${loomiT("pagination.pageOf", { page: p, pages: this.pageCount }, this.locale)}</option>`,
          )}
        </select>
        ${this.btn(next, { disabled: this.page >= this.pageCount, label: this.nextLabel, onClick: () => this.go(this.page + 1) })}
      </span>`;
    }

    if (paginationStyle === "numbers") {
      return html`<span class="loomi-controls">
        ${this.btn(prev, { disabled: this.page <= 1, label: this.prevLabel, onClick: () => this.go(this.page - 1) })}
        ${this.numbers().map((p) =>
          p === "…"
            ? html`<span class="loomi-ellipsis">…</span>`
            : this.btn(String(p), { active: p === this.page, onClick: () => this.go(p) }),
        )}
        ${this.btn(next, { disabled: this.page >= this.pageCount, label: this.nextLabel, onClick: () => this.go(this.page + 1) })}
      </span>`;
    }

    // arrows
    return html`<span class="loomi-controls">
      ${this.btn(prev, { disabled: this.page <= 1, label: this.prevLabel, onClick: () => this.go(this.page - 1) })}
      ${
        showPageNumber
          ? html`<span class="loomi-total">${showTotalPages ? `${this.page} / ${this.pageCount}` : this.page}</span>`
          : nothing
      }
      ${this.btn(next, { disabled: this.page >= this.pageCount, label: this.nextLabel, onClick: () => this.go(this.page + 1) })}
    </span>`;
  }

  override render(): TemplateResult {
    return html`<div class="loomi-pagination" style=${accentVars(this.color)}>
      ${(this.showTotalAlias ?? this.showTotal) ? html`<span class="loomi-total">${this.totalText()}</span>` : nothing}
      ${this.renderControls()}
    </div>`;
  }
}

export interface LoomiPaginationPageChangeDetail {
  page: number;
}

/** Event map for `<loomi-pagination>`. `loomi-page-change` is dispatched by several
 * loomi components with different detail shapes, so it is typed per package
 * instead of globally on `HTMLElementEventMap`. */
export interface LoomiPaginationEventMap {
  "loomi-page-change": CustomEvent<LoomiPaginationPageChangeDetail>;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-pagination": LoomiPagination;
  }
}
