import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, onClickOutside } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

const ELLIPSIS = svg`<path d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM21 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="currentColor" />`;
const CHEVRON_RIGHT = svg`<path d="m9 18 6-6-6-6" />`;

/**
 * `<loomi-dropmenu-item>` — a single menu line. Put links/handlers inside, or set `icon`.
 * @slot - Item content.
 * @slot submenu - Nested `<loomi-dropmenu-item>` children.
 */
@customElement("loomi-dropmenu-item")
export class LoomiDropmenuItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() icon = "";
  @property() shortcut = "";
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;
  @property({ type: Boolean }) header = false;
  @property({ type: Boolean }) divider = false;
  @property({ type: Boolean }) hover = true;

  @state() private hasSubmenuItems = false;
  @state() private menuIconRight = false;
  @state() private submenuOpen = false;

  get hasSubmenu(): boolean {
    return this.hasSubmenuItems;
  }

  get selectable(): boolean {
    return !this.header && !this.divider;
  }

  setMenuIconRight(value: boolean): void {
    this.menuIconRight = value;
  }

  focusItem(): void {
    this.renderRoot.querySelector<HTMLElement>(".loomi-item")?.focus();
  }

  private onSubmenuSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    this.hasSubmenuItems = slot.assignedElements({ flatten: true }).length > 0;
  };

  private onItemClick(): void {
    if (this.hasSubmenuItems) this.submenuOpen = !this.submenuOpen;
  }

  override render(): TemplateResult {
    if (this.divider) return html`<div class="loomi-divider"></div>`;
    const iconRight = this.iconRight || this.menuIconRight;
    const path = this.icon ? getLoomiIcon(this.icon) : undefined;
    const cls = `loomi-item ${iconRight ? "right" : ""} ${this.hasSubmenuItems ? "has-submenu" : ""} ${
      this.header ? "header" : this.hover ? "hoverable" : ""
    }`;
    return html`<div
        class=${cls}
        role=${this.header ? "presentation" : "menuitem"}
        tabindex=${this.header ? nothing : "-1"}
        aria-haspopup=${this.hasSubmenuItems ? "menu" : nothing}
        aria-expanded=${this.hasSubmenuItems ? (this.submenuOpen ? "true" : "false") : nothing}
        @click=${this.onItemClick}
      >
      ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : nothing}
      <span class="loomi-label"><slot></slot></span>
      ${this.shortcut ? html`<kbd class="loomi-shortcut">${this.shortcut}</kbd>` : nothing}
      ${this.hasSubmenuItems
        ? html`<svg class="loomi-submenu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            ${CHEVRON_RIGHT}
          </svg>`
        : nothing}
    </div>
    <div class="loomi-submenu ${this.hasSubmenuItems ? "ready" : ""} ${this.submenuOpen ? "open" : ""}" role="menu">
      <slot name="submenu" @slotchange=${this.onSubmenuSlotChange}></slot>
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
export class LoomiDropmenu extends LoomiElement {
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
  @state() private focusedIndex = -1;
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
    this.focusedIndex = -1;
    this.cleanupOutside = onClickOutside(this, () => this.closeMenu());
    this.cleanupPlacement = this.observePlacement();
    this.schedulePlacement();
  }

  private closeMenu(): void {
    this.open = false;
    this.focusedIndex = -1;
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

  private getTopLevelItems(): LoomiDropmenuItem[] {
    return Array.from(this.children).filter(
      (child): child is LoomiDropmenuItem => child instanceof LoomiDropmenuItem && child.selectable,
    );
  }

  private focusItemAt(index: number): void {
    const items = this.getTopLevelItems();
    if (!items.length) return;
    const nextIndex = (index + items.length) % items.length;
    this.focusedIndex = nextIndex;
    items[nextIndex].focusItem();
  }

  private applyItemDefaults(): void {
    for (const item of this.querySelectorAll("loomi-dropmenu-item")) {
      item.setMenuIconRight(this.iconRight);
    }
  }

  private onSlotChange(): void {
    this.applyItemDefaults();
  }

  private onItemsClick = (e: Event): void => {
    const item = e.composedPath().find((target): target is LoomiDropmenuItem => target instanceof LoomiDropmenuItem);
    if (item && item.selectable && !item.hasSubmenu && this.hideAfterClick) this.closeMenu();
  };

  private onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (!this.open) this.openMenu();
    void this.updateComplete.then(() => this.focusItemAt(event.key === "ArrowUp" ? -1 : 0));
  };

  private onMenuKeyDown = (event: KeyboardEvent): void => {
    if (!this.open) return;
    const items = this.getTopLevelItems();
    if (!items.length) return;

    if (event.key === "Escape") {
      event.preventDefault();
      this.closeMenu();
      this.renderRoot.querySelector<HTMLButtonElement>(".loomi-trigger")?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.focusItemAt(this.focusedIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.focusItemAt(this.focusedIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      this.focusItemAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this.focusItemAt(items.length - 1);
    } else if ((event.key === "Enter" || event.key === " ") && this.focusedIndex >= 0) {
      event.preventDefault();
      items[this.focusedIndex].click();
    }
  };

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("iconRight")) this.applyItemDefaults();
  }

  override render(): TemplateResult {
    const triggerPath = this.trigger ? getLoomiIcon(this.trigger.replace(/-icon$/, "")) : undefined;
    return html`<button
      class="loomi-trigger"
      aria-haspopup="menu"
      aria-expanded=${this.open ? "true" : "false"}
      @click=${this.triggerOn === "click" ? () => this.toggle() : nothing}
      @mouseenter=${this.triggerOn === "mouseover" ? () => this.openMenu() : nothing}
      @keydown=${this.onTriggerKeyDown}
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
          @keydown=${this.onMenuKeyDown}
        >
          <slot @slotchange=${this.onSlotChange}></slot>
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
