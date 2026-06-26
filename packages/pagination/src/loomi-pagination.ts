import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiDefaultText, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPaginationStyle = "arrows" | "numbers" | "dropdown";

const PREV = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />`;
const NEXT = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;
const DEFAULT_TOTAL_LABEL = "Showing :a to :b of :c";

/**
 * `<loomi-pagination>` — page controls driven by `total`, `page-size` and `page`.
 * Emits `page-change` (`detail: { page }`). Styles: `arrows`, `numbers`, `dropdown`.
 */
@customElement("loomi-pagination")
export class LoomiPagination extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) total = 0;
  @property({ type: Number, attribute: "page-size" }) pageSize = 10;
  @property({ type: Number }) page = 1;
  @property({ attribute: "pagination-style" }) paginationStyle: LoomiPaginationStyle = "arrows";
  @property({ type: Boolean, attribute: "show-total" }) showTotal = true;
  @property({ attribute: "total-label" }) totalLabel = DEFAULT_TOTAL_LABEL;
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
      new CustomEvent("page-change", { bubbles: true, composed: true, detail: { page: clamped } }),
    );
  }

  private totalText(): string {
    if (this.total === 0) return loomiT("pagination.noRecords", {}, this.locale);
    const a = (this.page - 1) * this.pageSize + 1;
    const b = Math.min(this.total, this.page * this.pageSize);
    return loomiDefaultText(this.totalLabel, DEFAULT_TOTAL_LABEL, "pagination.totalLabel", this.locale)
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

  private btn(content: TemplateResult | string, opts: { disabled?: boolean; active?: boolean; onClick: () => void }): TemplateResult {
    return html`<button
      class="loomi-page ${opts.active ? "active" : ""}"
      ?disabled=${opts.disabled}
      @click=${opts.onClick}
    >${content}</button>`;
  }

  private renderControls(): TemplateResult {
    const prev = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${PREV}</svg>`;
    const next = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${NEXT}</svg>`;

    if (this.paginationStyle === "dropdown") {
      return html`<span class="loomi-controls">
        ${this.btn(prev, { disabled: this.page <= 1, onClick: () => this.go(this.page - 1) })}
        <select class="loomi-select" .value=${String(this.page)} @change=${(e: Event) => this.go(Number((e.target as HTMLSelectElement).value))}>
          ${Array.from({ length: this.pageCount }, (_, i) => i + 1).map(
            (p) => html`<option value=${p} ?selected=${p === this.page}>${loomiT("pagination.pageOf", { page: p, pages: this.pageCount }, this.locale)}</option>`,
          )}
        </select>
        ${this.btn(next, { disabled: this.page >= this.pageCount, onClick: () => this.go(this.page + 1) })}
      </span>`;
    }

    if (this.paginationStyle === "numbers") {
      return html`<span class="loomi-controls">
        ${this.btn(prev, { disabled: this.page <= 1, onClick: () => this.go(this.page - 1) })}
        ${this.numbers().map((p) =>
          p === "…"
            ? html`<span class="loomi-ellipsis">…</span>`
            : this.btn(String(p), { active: p === this.page, onClick: () => this.go(p) }),
        )}
        ${this.btn(next, { disabled: this.page >= this.pageCount, onClick: () => this.go(this.page + 1) })}
      </span>`;
    }

    // arrows
    return html`<span class="loomi-controls">
      ${this.btn(prev, { disabled: this.page <= 1, onClick: () => this.go(this.page - 1) })}
      <span class="loomi-total">${this.page} / ${this.pageCount}</span>
      ${this.btn(next, { disabled: this.page >= this.pageCount, onClick: () => this.go(this.page + 1) })}
    </span>`;
  }

  override render(): TemplateResult {
    return html`<div class="loomi-pagination" style=${accentVars(this.color)}>
      ${this.showTotal ? html`<span class="loomi-total">${this.totalText()}</span>` : nothing}
      ${this.renderControls()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-pagination": LoomiPagination;
  }
}
