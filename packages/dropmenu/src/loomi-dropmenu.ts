import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, nextMenuFocusIndex, onClickOutside } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

const ELLIPSIS = svg`<path d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM21 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="currentColor" />`;
const CHEVRON_RIGHT = svg`<path d="m9 18 6-6-6-6" />`;
const CHECK = svg`<path d="M20 6 9 17l-5-5" />`;

export type LoomiDropmenuItemVariant = "default" | "destructive";

/**
 * `<loomi-dropmenu-item>` — a single menu line. Put links/handlers inside, or set `icon`.
 * Set `checkbox` or `radio` to turn it into a toggle row (see `checked`, `group`).
 * @slot - Item content.
 * @slot submenu - Nested `<loomi-dropmenu-item>` children.
 * @fires change - Fired when a `checkbox` or `radio` item's `checked` state changes (composed).
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
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() variant: LoomiDropmenuItemVariant = "default";
  @property({ type: Boolean }) checkbox = false;
  @property({ type: Boolean }) radio = false;
  @property() group = "";
  @property() value = "";
  @property({ type: Boolean, reflect: true }) checked = false;

  @state() private hasSubmenuItems = false;
  @state() private menuIconRight = false;
  @state() private submenuOpen = false;

  get hasSubmenu(): boolean {
    return this.hasSubmenuItems;
  }

  /** `true` for `checkbox`/`radio` items — clicking one shouldn't auto-close the menu. */
  get isToggle(): boolean {
    return this.checkbox || this.radio;
  }

  get selectable(): boolean {
    return !this.header && !this.divider && !this.disabled;
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

  private uncheckRadioSiblings(): void {
    const root = (this.getRootNode() as Document | ShadowRoot) ?? document;
    for (const sibling of root.querySelectorAll<LoomiDropmenuItem>("loomi-dropmenu-item[radio]")) {
      if (sibling !== this && sibling.group === this.group) sibling.checked = false;
    }
  }

  private onItemClick = (event: Event): void => {
    if (this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    if (this.hasSubmenuItems) {
      this.submenuOpen = !this.submenuOpen;
      return;
    }
    if (this.checkbox) {
      this.checked = !this.checked;
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      return;
    }
    if (this.radio) {
      if (this.checked) return;
      this.uncheckRadioSiblings();
      this.checked = true;
      this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }
  };

  private get itemClass(): string {
    const iconRight = this.iconRight || this.menuIconRight;
    return [
      "loomi-item",
      iconRight && "right",
      this.hasSubmenuItems && "has-submenu",
      this.variant === "destructive" && "destructive",
      this.disabled && "disabled",
      this.header ? "header" : this.hover && "hoverable",
    ]
      .filter(Boolean)
      .join(" ");
  }

  private get itemRole(): string {
    if (this.header) return "presentation";
    if (this.checkbox) return "menuitemcheckbox";
    if (this.radio) return "menuitemradio";
    return "menuitem";
  }

  override render(): TemplateResult {
    if (this.divider) return html`<div class="loomi-divider"></div>`;

    const path = this.icon ? getLoomiIcon(this.icon) : undefined;

    return html`
      <div
        class=${this.itemClass}
        role=${this.itemRole}
        tabindex=${this.header || this.disabled ? nothing : "-1"}
        aria-haspopup=${this.hasSubmenuItems ? "menu" : nothing}
        aria-expanded=${this.hasSubmenuItems ? (this.submenuOpen ? "true" : "false") : nothing}
        aria-checked=${this.isToggle ? (this.checked ? "true" : "false") : nothing}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this.onItemClick}
      >
        ${this.isToggle
          ? html`<span class="loomi-indicator" aria-hidden="true">
              ${this.checked
                ? this.radio
                  ? html`<span class="loomi-radio-dot"></span>`
                  : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      ${CHECK}
                    </svg>`
                : nothing}
            </span>`
          : nothing}
        ${path
          ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              ${path}
            </svg>`
          : nothing}
        <span class="loomi-label"><slot></slot></span>
        ${this.shortcut ? html`<kbd class="loomi-shortcut">${this.shortcut}</kbd>` : nothing}
        ${this.hasSubmenuItems
          ? html`<svg
              class="loomi-submenu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              ${CHEVRON_RIGHT}
            </svg>`
          : nothing}
      </div>
      <div
        class="loomi-submenu ${this.hasSubmenuItems ? "ready" : ""} ${this.submenuOpen ? "open" : ""}"
        role="menu"
      >
        <slot name="submenu" @slotchange=${this.onSubmenuSlotChange}></slot>
      </div>
    `;
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
  @property() placement: "auto" | "left" | "right" = "auto";
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  @state() private open = false;
  @state() private resolvedPlacement: "left" | "right" = "left";
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

  private closeMenu(options: { restoreFocus?: boolean } = {}): void {
    this.open = false;
    this.focusedIndex = -1;
    this.cleanupOutside?.();
    this.cleanupOutside = undefined;
    this.cleanupPlacement?.();
    this.cleanupPlacement = undefined;
    cancelAnimationFrame(this.placementFrame);
    if (options.restoreFocus) {
      this.renderRoot.querySelector<HTMLButtonElement>(".loomi-trigger")?.focus();
    }
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
    if (this.placement !== "auto") {
      this.resolvedPlacement = this.placement;
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
      this.resolvedPlacement = "left";
    } else if (rightFits && !leftFits) {
      this.resolvedPlacement = "right";
    } else if (leftVisible !== rightVisible) {
      this.resolvedPlacement = leftVisible > rightVisible ? "left" : "right";
    } else {
      this.resolvedPlacement = "left";
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
    if (item && item.selectable && !item.hasSubmenu && !item.isToggle && this.hideAfterClick) {
      this.closeMenu({ restoreFocus: true });
    }
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
      this.closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key === "Tab") {
      // Menu items are tabindex="-1" (roving focus via Arrow keys), so a bare Tab would
      // otherwise jump focus to whatever's next in the document while leaving the panel
      // visibly open. Close it and let the browser's own Tab motion continue — mirrors
      // the standard menu-button pattern (Tab is not trapped, unlike a true modal).
      this.closeMenu();
      return;
    }

    const target = nextMenuFocusIndex(event, this.focusedIndex, items.length);
    if (target !== undefined) {
      event.preventDefault();
      this.focusItemAt(target);
    } else if ((event.key === "Enter" || event.key === " ") && this.focusedIndex >= 0) {
      event.preventDefault();
      items[this.focusedIndex].click();
    }
  };

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("iconRight")) this.applyItemDefaults();
  }

  private get menuClass(): string {
    return ["loomi-menu", this.resolvedPlacement, this.scrollable && "scrollable"].filter(Boolean).join(" ");
  }

  override render(): TemplateResult {
    const triggerPath = this.trigger ? getLoomiIcon(this.trigger.replace(/-icon$/, "")) : undefined;

    return html`
      <button
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
            class=${this.menuClass}
            style=${this.scrollable ? `--loomi-menu-height:${this.height}px` : nothing}
            role="menu"
            @click=${this.onItemsClick}
            @keydown=${this.onMenuKeyDown}
          >
            <div class="loomi-viewport">
              <slot @slotchange=${this.onSlotChange}></slot>
            </div>
          </div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-dropmenu": LoomiDropmenu;
    "loomi-dropmenu-item": LoomiDropmenuItem;
  }
}
