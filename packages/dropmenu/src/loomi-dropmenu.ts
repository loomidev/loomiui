import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles, onClickOutside } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

const ELLIPSIS = svg`<path d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM21 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="currentColor" />`;

/**
 * `<loomi-dropmenu-item>` — a single menu line. Put links/handlers inside, or set `icon`.
 * @slot - Item content.
 */
@customElement("loomi-dropmenu-item")
export class LoomiDropmenuItem extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() icon = "";
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;
  @property({ type: Boolean }) header = false;
  @property({ type: Boolean }) divider = false;
  @property({ type: Boolean }) hover = true;

  override render(): TemplateResult {
    if (this.divider) return html`<div class="loomi-divider"></div>`;
    const path = this.icon ? getLoomiIcon(this.icon) : undefined;
    const cls = `loomi-item ${this.iconRight ? "right" : ""} ${this.header ? "header" : this.hover ? "hoverable" : ""}`;
    return html`<div class=${cls}>
      ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : nothing}
      <span style="flex:1 1 auto"><slot></slot></span>
    </div>`;
  }
}

/**
 * `<loomi-dropmenu>` — a dropdown action menu. Trigger via the default ellipsis icon, an
 * icon name (`trigger`), or custom markup in the `trigger` slot.
 *
 * @slot - `<loomi-dropmenu-item>` children.
 * @slot trigger - Custom trigger markup.
 */
@customElement("loomi-dropmenu")
export class LoomiDropmenu extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() trigger = "";
  @property({ attribute: "trigger-on" }) triggerOn: "click" | "mouseover" = "click";
  @property({ type: Boolean, reflect: true }) divided = false;
  @property() position: "left" | "right" = "right";
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  @state() private open = false;
  private cleanup?: () => void;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup?.();
  }

  private toggle(): void {
    this.open = !this.open;
    if (this.open) this.cleanup = onClickOutside(this, () => (this.open = false));
    else this.cleanup?.();
  }
  private openMenu(): void {
    if (this.open) return;
    this.open = true;
    this.cleanup = onClickOutside(this, () => (this.open = false));
  }

  private onItemsClick = (e: Event): void => {
    const item = (e.target as HTMLElement).closest("loomi-dropmenu-item") as LoomiDropmenuItem | null;
    if (item && !item.header && !item.divider && this.hideAfterClick) this.open = false;
  };

  override render(): TemplateResult {
    const triggerPath = this.trigger ? getLoomiIcon(this.trigger.replace(/-icon$/, "")) : undefined;
    return html`<button
      class="loomi-trigger"
      aria-haspopup="menu"
      aria-expanded=${this.open ? "true" : "false"}
      @click=${this.triggerOn === "click" ? () => this.toggle() : nothing}
      @mouseenter=${this.triggerOn === "mouseover" ? () => this.openMenu() : nothing}
    >
      <slot name="trigger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          ${triggerPath ?? ELLIPSIS}
        </svg>
      </slot>
    </button>
    ${this.open
      ? html`<div
          class="loomi-menu ${this.position} ${this.scrollable ? "scrollable" : ""}"
          style=${this.scrollable ? `--loomi-menu-height:${this.height}px` : nothing}
          role="menu"
          @click=${this.onItemsClick}
        >
          <slot></slot>
        </div>`
      : nothing}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-dropmenu": LoomiDropmenu;
    "loomi-dropmenu-item": LoomiDropmenuItem;
  }
}
