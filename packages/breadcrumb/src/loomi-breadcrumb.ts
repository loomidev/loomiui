import { html, nothing, svg, isServer, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiBreadcrumbSeparator = "chevron" | "slash";

const CHEVRON = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />`;

/**
 * `<loomi-breadcrumb-item>` — one segment of a `<loomi-breadcrumb>` trail. Place inside
 * `<loomi-breadcrumb>`; the parent marks whichever item is last as the current page.
 *
 * @slot - Overrides the `label` attribute.
 * @fires loomi-breadcrumb-item-click - `detail: { href, label }`. Cancelable: call
 *   `event.preventDefault()` to handle routing yourself instead of following `href`.
 */
@customElement("loomi-breadcrumb-item")
export class LoomiBreadcrumbItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() href = "";
  @property({ type: Boolean, reflect: true }) last = false;
  @property() separator: LoomiBreadcrumbSeparator = "chevron";
  @property() color: LoomiColor = "primary" as LoomiColor;

  private onSelect(event: Event): void {
    const detail = { href: this.href, label: this.label };
    const selectEvent = new CustomEvent("loomi-breadcrumb-item-click", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
    });
    this.dispatchEvent(selectEvent);
    if (selectEvent.defaultPrevented) event.preventDefault();
  }

  private renderSeparator(): TemplateResult {
    if (this.separator === "slash") return html`<span class="loomi-sep-slash" aria-hidden="true">/</span>`;
    return html`<svg
      class="loomi-sep-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >${CHEVRON}</svg>`;
  }

  private renderControl(): TemplateResult {
    const label = html`<span class="loomi-crumb-label"><slot>${this.label}</slot></span>`;
    if (this.last || !this.href) {
      return html`<span
        class="loomi-crumb-control ${this.last ? "current" : ""}"
        aria-current=${this.last ? "page" : nothing}
      >${label}</span>`;
    }
    return html`<a class="loomi-crumb-control" href=${this.href} @click=${this.onSelect}>${label}</a>`;
  }

  override render(): TemplateResult {
    return html`<div class="loomi-crumb" role="listitem" style=${accentVars(this.color)}>
      ${this.renderControl()}
      ${this.last ? nothing : html`<span class="loomi-crumb-separator">${this.renderSeparator()}</span>`}
    </div>`;
  }
}

/**
 * `<loomi-breadcrumb>` — a navigation trail showing the current page's location.
 * Place `<loomi-breadcrumb-item>` children inside; the last one is treated as the
 * current page (rendered as plain text with `aria-current="page"`, never a link,
 * even if it has an `href`).
 *
 * @slot - `<loomi-breadcrumb-item>` children.
 */
@customElement("loomi-breadcrumb")
export class LoomiBreadcrumb extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() separator: LoomiBreadcrumbSeparator = "chevron";
  /** Accessible name for the `<nav>` landmark. Falls back to a translated "Breadcrumb". */
  @property() label = "";
  @property() locale = "";
  @property() color: LoomiColor = "primary" as LoomiColor;

  private get accessibleName(): string {
    return this.label || loomiT("breadcrumb.label", {}, this.locale);
  }

  private get items(): LoomiBreadcrumbItem[] {
    // Light DOM is not readable during server rendering; hydration fills this in on the client.
    if (isServer) return [];
    return Array.from(this.querySelectorAll("loomi-breadcrumb-item"));
  }

  private syncItems = (): void => {
    const items = this.items;
    items.forEach((item, index) => {
      item.last = index === items.length - 1;
      item.separator = this.separator;
      if (!item.hasAttribute("color")) item.color = this.color;
    });
  };

  override willUpdate(): void {
    this.syncItems();
  }

  override firstUpdated(): void {
    this.syncItems();
  }

  override render(): TemplateResult {
    return html`<nav aria-label=${this.accessibleName} style=${accentVars(this.color)}>
      <div class="loomi-breadcrumb" role="list">
        <slot @slotchange=${this.syncItems}></slot>
      </div>
    </nav>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-breadcrumb": LoomiBreadcrumb;
    "loomi-breadcrumb-item": LoomiBreadcrumbItem;
  }

  interface HTMLElementEventMap {
    "loomi-breadcrumb-item-click": CustomEvent<{ href: string; label: string }>;
  }
}
