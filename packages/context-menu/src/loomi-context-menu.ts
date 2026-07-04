import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, onClickOutside } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

const CHEVRON_RIGHT = svg`<path d="m9 18 6-6-6-6" />`;

export type LoomiContextMenuPlacement = "auto" | "left" | "right";

/**
 * `<loomi-context-menu-item>` — a single right-click menu line. Put links/handlers
 * inside, or set `icon`.
 *
 * @slot - Item content.
 * @slot submenu - Nested `<loomi-context-menu-item>` children.
 */
@customElement("loomi-context-menu-item")
export class LoomiContextMenuItem extends LoomiElement {
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
 * `<loomi-context-menu>` — a right-click action menu for target content.
 *
 * @slot target - The region that opens the menu on contextmenu, ContextMenu, or Shift+F10.
 * @slot - `<loomi-context-menu-item>` children.
 */
@customElement("loomi-context-menu")
export class LoomiContextMenu extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) divided = false;
  @property() placement: LoomiContextMenuPlacement = "auto";
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  @state() private open = false;
  @state() private resolvedPlacement: "left" | "right" = "left";
  @state() private focusedIndex = -1;
  @state() private menuX = 0;
  @state() private menuY = 0;
  private anchorX = 0;
  private anchorY = 0;
  private cleanupOutside?: () => void;
  private cleanupListeners?: () => void;
  private placementFrame = 0;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupOutside?.();
    this.cleanupListeners?.();
    cancelAnimationFrame(this.placementFrame);
  }

  showAt(clientX: number, clientY: number): void {
    if (this.disabled) return;
    this.anchorX = clientX;
    this.anchorY = clientY;
    this.open = true;
    this.focusedIndex = -1;
    this.cleanupOutside?.();
    this.cleanupListeners?.();
    this.cleanupOutside = onClickOutside(this, () => this.hide());
    this.cleanupListeners = this.observePlacement();
    this.schedulePlacement();
  }

  hide(): void {
    this.open = false;
    this.focusedIndex = -1;
    this.cleanupOutside?.();
    this.cleanupOutside = undefined;
    this.cleanupListeners?.();
    this.cleanupListeners = undefined;
    cancelAnimationFrame(this.placementFrame);
  }

  private observePlacement(): () => void {
    const reposition = (): void => this.schedulePlacement();
    const onOutsideContextMenu = (event: MouseEvent): void => {
      if (!event.composedPath().includes(this)) this.hide();
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("contextmenu", onOutsideContextMenu, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("contextmenu", onOutsideContextMenu, true);
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
    const menu = this.renderRoot.querySelector<HTMLElement>(".loomi-menu");
    if (!menu) return;

    const menuRect = menu.getBoundingClientRect();
    const menuWidth = menuRect.width || 216;
    const menuHeight = menuRect.height || 160;
    const margin = 8;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const leftFits = this.anchorX + menuWidth <= viewportWidth - margin;
    const rightFits = this.anchorX - menuWidth >= margin;

    if (this.placement !== "auto") {
      this.resolvedPlacement = this.placement;
    } else if (leftFits && !rightFits) {
      this.resolvedPlacement = "left";
    } else if (rightFits && !leftFits) {
      this.resolvedPlacement = "right";
    } else if (rightFits && this.anchorX > viewportWidth / 2) {
      this.resolvedPlacement = "right";
    } else {
      this.resolvedPlacement = "left";
    }

    const desiredX = this.resolvedPlacement === "right" ? this.anchorX - menuWidth : this.anchorX;
    const maxX = Math.max(margin, viewportWidth - margin - menuWidth);
    const maxY = Math.max(margin, viewportHeight - margin - menuHeight);
    this.menuX = Math.min(Math.max(margin, desiredX), maxX);
    this.menuY = Math.min(Math.max(margin, this.anchorY), maxY);
  }

  private getTopLevelItems(): LoomiContextMenuItem[] {
    return Array.from(this.children).filter(
      (child): child is LoomiContextMenuItem => child instanceof LoomiContextMenuItem && child.selectable,
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
    for (const item of this.querySelectorAll("loomi-context-menu-item")) {
      item.setMenuIconRight(this.iconRight);
    }
  }

  private onSlotChange(): void {
    this.applyItemDefaults();
  }

  private onTargetContextMenu = (event: MouseEvent): void => {
    if (this.disabled) return;
    event.preventDefault();
    this.showAt(event.clientX, event.clientY);
  };

  private onTargetKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;
    if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
    event.preventDefault();
    const target = this.renderRoot.querySelector<HTMLElement>(".loomi-target");
    const rect = target?.getBoundingClientRect();
    this.showAt(rect ? rect.left + Math.min(rect.width / 2, 24) : 0, rect ? rect.top + Math.min(rect.height, 32) : 0);
    void this.updateComplete.then(() => this.focusItemAt(0));
  };

  private onItemsClick = (event: Event): void => {
    const item = event.composedPath().find((target): target is LoomiContextMenuItem => target instanceof LoomiContextMenuItem);
    if (item && item.selectable && !item.hasSubmenu && this.hideAfterClick) this.hide();
  };

  private onMenuKeyDown = (event: KeyboardEvent): void => {
    if (!this.open) return;
    const items = this.getTopLevelItems();
    if (!items.length) return;

    if (event.key === "Escape") {
      event.preventDefault();
      this.hide();
      this.renderRoot.querySelector<HTMLElement>(".loomi-target")?.focus();
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
    if (changedProperties.has("disabled") && this.disabled) this.hide();
  }

  override render(): TemplateResult {
    return html`<span
      class="loomi-target"
      tabindex=${this.disabled ? nothing : "0"}
      aria-haspopup="menu"
      aria-expanded=${this.open ? "true" : "false"}
      @contextmenu=${this.onTargetContextMenu}
      @keydown=${this.onTargetKeyDown}
    >
      <slot name="target"></slot>
    </span>
    ${this.open
      ? html`<div
          class="loomi-menu ${this.resolvedPlacement} ${this.scrollable ? "scrollable" : ""}"
          style=${`--loomi-context-menu-x:${this.menuX}px;--loomi-context-menu-y:${this.menuY}px;${
            this.scrollable ? `--loomi-menu-height:${this.height}px` : ""
          }`}
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
    "loomi-context-menu": LoomiContextMenu;
    "loomi-context-menu-item": LoomiContextMenuItem;
  }
}
