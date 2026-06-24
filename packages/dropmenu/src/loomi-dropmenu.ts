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
  @property() position: "auto" | "left" | "right" = "auto";
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  @state() private open = false;
  @state() private resolvedPosition: "left" | "right" = "left";
  private cleanupOutside?: () => void;
  private cleanupPlacement?: () => void;
  private placementFrame = 0;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupOutside?.();
    this.cleanupPlacement?.();
    cancelAnimationFrame(this.placementFrame);
  }

  private toggle(): void {
    if (this.open) this.closeMenu();
    else this.openMenu();
  }

  private openMenu(): void {
    if (this.open) return;
    this.open = true;
    this.cleanupOutside = onClickOutside(this, () => this.closeMenu());
    this.cleanupPlacement = this.observePlacement();
    this.schedulePlacement();
  }

  private closeMenu(): void {
    this.open = false;
    this.cleanupOutside?.();
    this.cleanupOutside = undefined;
    this.cleanupPlacement?.();
    this.cleanupPlacement = undefined;
    cancelAnimationFrame(this.placementFrame);
  }

  private observePlacement(): () => void {
    const reposition = (): void => this.schedulePlacement();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }

  private schedulePlacement(): void {
    cancelAnimationFrame(this.placementFrame);
    this.placementFrame = requestAnimationFrame(() => {
      void this.updateComplete.then(() => this.resolvePlacement());
    });
  }

  private resolvePlacement(): void {
    if (!this.open) return;
    if (this.position !== "auto") {
      this.resolvedPosition = this.position;
      return;
    }

    const menu = this.renderRoot.querySelector<HTMLElement>(".loomi-menu");
    if (!menu) return;

    const triggerRect = this.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const menuWidth = menuRect.width || 192;
    const margin = 8;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

    const leftAligned = {
      start: triggerRect.left,
      end: triggerRect.left + menuWidth,
    };
    const rightAligned = {
      start: triggerRect.right - menuWidth,
      end: triggerRect.right,
    };

    const visibleWidth = (candidate: { start: number; end: number }): number =>
      Math.max(0, Math.min(candidate.end, viewportWidth - margin) - Math.max(candidate.start, margin));

    const leftVisible = visibleWidth(leftAligned);
    const rightVisible = visibleWidth(rightAligned);
    const leftFits = leftAligned.start >= margin && leftAligned.end <= viewportWidth - margin;
    const rightFits = rightAligned.start >= margin && rightAligned.end <= viewportWidth - margin;

    if (leftFits && !rightFits) {
      this.resolvedPosition = "left";
    } else if (rightFits && !leftFits) {
      this.resolvedPosition = "right";
    } else if (leftVisible !== rightVisible) {
      this.resolvedPosition = leftVisible > rightVisible ? "left" : "right";
    } else {
      this.resolvedPosition = "left";
    }
  }

  private onItemsClick = (e: Event): void => {
    const item = (e.target as HTMLElement).closest("loomi-dropmenu-item") as LoomiDropmenuItem | null;
    if (item && !item.header && !item.divider && this.hideAfterClick) this.closeMenu();
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
          class="loomi-menu ${this.resolvedPosition} ${this.scrollable ? "scrollable" : ""}"
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
