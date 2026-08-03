import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  nextMenuFocusIndex,
  onClickOutside,
  onExitAnimationEnd,
  positionFloatingPanel,
  positionFloatingSubmenu,
  supportsPopover,
  type LoomiPanelPlacement,
  type LoomiResolvedSide,
  type LoomiSubmenuSide,
} from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

const ELLIPSIS = svg`<path d="M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM21 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" fill="currentColor" />`;
const CHEVRON_RIGHT = svg`<path d="m9 18 6-6-6-6" />`;
const CHECK = svg`<path d="M20 6 9 17l-5-5" />`;

export type LoomiDropmenuItemVariant = "default" | "destructive";

/**
 * Where the panel sits relative to the trigger.
 *
 * `left`/`right` are the original horizontal-alignment names — which edge of the panel
 * lines up with the trigger — and stay supported. The `bottom-*`/`top-*` names are the
 * shared vocabulary the rest of the library's floating panels use (`<loomi-split-button>`,
 * `<loomi-popover>`), and additionally pick the side the panel opens on.
 *
 * Every value is a *preference*: a panel that would leave the viewport still flips or
 * swaps its alignment, because a menu clipped by the screen edge is no better than one
 * clipped by an ancestor's `overflow`.
 */
export type LoomiDropmenuPlacement = "auto" | "left" | "right" | LoomiPanelPlacement;

/**
 * `auto` and `left` both mean "line the panel's left edge up with the trigger, unless
 * that runs off the right of the screen" — which is exactly what the shared helper does
 * with `bottom-start`. (The helper's own `auto` prefers *end* alignment, the natural
 * default for a caret at the end of a button pair; a dropmenu's small icon trigger has
 * always aligned the other way, so it maps explicitly rather than passing `auto` through.)
 */
const PLACEMENT_ALIASES: Record<string, LoomiPanelPlacement> = {
  auto: "bottom-start",
  left: "bottom-start",
  right: "bottom-end",
};

/**
 * `<loomi-dropmenu-item>` — a single menu line. Put links/handlers inside, or set `icon`.
 * Set `checkbox` or `radio` to turn it into a toggle row (see `checked`, `group`).
 * @slot - Item content.
 * @slot submenu - Nested `<loomi-dropmenu-item>` children.
 * @csspart submenu - The floating submenu panel; `data-side` is the side it opened on.
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
  @state() private submenuClosing = false;
  @state() private submenuSide: LoomiSubmenuSide = "right";

  private submenuCloseTimer = 0;
  private submenuFrame = 0;
  private cleanupSubmenu?: () => void;
  private cancelSubmenuExit?: () => void;

  @query(".loomi-item") private itemEl?: HTMLElement;
  @query(".loomi-submenu") private submenuEl?: HTMLElement;

  get hasSubmenu(): boolean {
    return this.hasSubmenuItems;
  }

  /** Which side this item's submenu opened on — nested submenus follow it. */
  get resolvedSubmenuSide(): LoomiSubmenuSide {
    return this.submenuSide;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardownSubmenu();
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

  // ---------------------------------------------------------------- submenu

  /**
   * Opening is JS rather than a `:host(:hover)` rule because the panel has to be measured
   * and placed once it's visible — and promoted to the top layer, which is what keeps it
   * clear of a `scrollable` menu's own `overflow`.
   */
  private async openSubmenu(): Promise<void> {
    if (!this.hasSubmenuItems || this.disabled) return;
    clearTimeout(this.submenuCloseTimer);
    // Re-hovered mid-close: drop the pending exit rather than letting it hide the panel.
    this.cancelSubmenuExit?.();
    this.cancelSubmenuExit = undefined;
    this.submenuClosing = false;
    if (this.submenuOpen) {
      this.positionSubmenu();
      return;
    }
    this.submenuOpen = true;
    this.cleanupSubmenu = this.observeSubmenu();

    await this.updateComplete;
    const panel = this.submenuEl;
    if (!panel || !this.submenuOpen) return;
    if (supportsPopover(panel) && !panel.matches(":popover-open")) {
      try {
        panel.showPopover();
      } catch {
        // Already open, or detached mid-flight — either way, nothing to do.
      }
    }
    this.positionSubmenu();
  }

  /** Close this item's submenu. The parent menu calls this when it closes. */
  closeSubmenu(): void {
    if (!this.submenuOpen) return;
    this.submenuOpen = false;
    clearTimeout(this.submenuCloseTimer);
    cancelAnimationFrame(this.submenuFrame);
    this.cleanupSubmenu?.();
    this.cleanupSubmenu = undefined;

    const panel = this.submenuEl;
    if (!panel) {
      this.hideSubmenuPanel();
      return;
    }
    this.submenuClosing = true;
    void this.updateComplete.then(() => {
      if (!this.submenuClosing) return;
      this.cancelSubmenuExit = onExitAnimationEnd(panel, () => {
        this.cancelSubmenuExit = undefined;
        this.submenuClosing = false;
        this.hideSubmenuPanel();
      });
    });
  }

  private hideSubmenuPanel(): void {
    const panel = this.submenuEl;
    if (panel && supportsPopover(panel) && panel.matches(":popover-open")) {
      try {
        panel.hidePopover();
      } catch {
        // Already hidden — nothing to do.
      }
    }
  }

  private teardownSubmenu(): void {
    clearTimeout(this.submenuCloseTimer);
    cancelAnimationFrame(this.submenuFrame);
    this.cleanupSubmenu?.();
    this.cleanupSubmenu = undefined;
    this.cancelSubmenuExit?.();
    this.cancelSubmenuExit = undefined;
    this.submenuClosing = false;
    this.hideSubmenuPanel();
  }

  /**
   * Crossing the gap between a row and its submenu leaves both boxes for an instant. The
   * grace period is what keeps that from closing the menu under the pointer — the reason
   * the old CSS-only `:host(:hover)` version was fiddly to use.
   */
  private scheduleSubmenuClose(): void {
    clearTimeout(this.submenuCloseTimer);
    this.submenuCloseTimer = window.setTimeout(() => this.closeSubmenu(), 150);
  }

  private observeSubmenu(): () => void {
    const reposition = (): void => {
      cancelAnimationFrame(this.submenuFrame);
      this.submenuFrame = requestAnimationFrame(() => this.positionSubmenu());
    };
    window.addEventListener("resize", reposition);
    // Capture phase so scrolling the menu body itself repositions the submenu, which is in
    // the top layer and won't move with it.
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }

  private positionSubmenu(): void {
    const panel = this.submenuEl;
    const row = this.itemEl;
    if (!panel || !row || !this.submenuOpen) return;
    const parent = this.parentElement;
    this.submenuSide = positionFloatingSubmenu(row, panel, {
      prefer: parent instanceof LoomiDropmenuItem ? parent.resolvedSubmenuSide : undefined,
    });
  }

  private onItemPointerEnter = (): void => {
    void this.openSubmenu();
  };

  private onItemFocusIn = (): void => {
    void this.openSubmenu();
  };

  private onItemFocusOut = (event: FocusEvent): void => {
    // Focus moving into a submenu item retargets to that item's host, which is a child of
    // this one — that isn't leaving.
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.scheduleSubmenuClose();
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
      if (this.submenuOpen) this.closeSubmenu();
      else void this.openSubmenu();
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
        @mouseenter=${this.hasSubmenuItems ? this.onItemPointerEnter : nothing}
        @mouseleave=${this.hasSubmenuItems ? () => this.scheduleSubmenuClose() : nothing}
        @focusin=${this.hasSubmenuItems ? this.onItemFocusIn : nothing}
        @focusout=${this.hasSubmenuItems ? this.onItemFocusOut : nothing}
      >
        ${
          this.isToggle
            ? html`<span class="loomi-indicator" aria-hidden="true">
              ${
                this.checked
                  ? this.radio
                    ? html`<span class="loomi-radio-dot"></span>`
                    : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      ${CHECK}
                    </svg>`
                  : nothing
              }
            </span>`
            : nothing
        }
        ${
          path
            ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              ${path}
            </svg>`
            : nothing
        }
        <span class="loomi-label"><slot></slot></span>
        ${this.shortcut ? html`<kbd class="loomi-shortcut">${this.shortcut}</kbd>` : nothing}
        ${
          this.hasSubmenuItems
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
            : nothing
        }
      </div>
      <div
        class="loomi-submenu ${this.submenuOpen || this.submenuClosing ? "open" : ""} ${
          this.submenuClosing ? "closing" : ""
        }"
        part="submenu"
        popover="manual"
        role="menu"
        data-side=${this.submenuSide}
        @mouseenter=${this.hasSubmenuItems ? () => clearTimeout(this.submenuCloseTimer) : nothing}
        @mouseleave=${this.hasSubmenuItems ? () => this.scheduleSubmenuClose() : nothing}
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
 * The panel is promoted to the **top layer** via the popover API and positioned against
 * the viewport, so it is never clipped by an ancestor's `overflow` — that's what makes it
 * usable from a row deep inside a scrolling table — and it flips above the trigger when
 * there isn't room below.
 *
 * @slot - `<loomi-dropmenu-item>` children.
 * @slot trigger - Custom trigger markup.
 * @csspart menu - The floating menu panel.
 */
@customElement("loomi-dropmenu")
export class LoomiDropmenu extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() trigger = "";
  /**
   * Names the trigger and the menu panel for assistive technology.
   *
   * Required whenever the trigger is the default icon glyph, which carries no
   * text: the button lives in this component's shadow root, so an `aria-label`
   * placed on the host does not reach it and the control is left unnamed. A
   * trigger slotted with visible text names itself and needs nothing here.
   */
  @property() label = "";
  @property({ attribute: "trigger-on" }) triggerOn: "click" | "mouseover" = "click";
  @property({ type: Boolean, reflect: true }) divided = false;
  @property() placement: LoomiDropmenuPlacement = "auto";
  @property({ type: Boolean }) scrollable = false;
  @property({ type: Number }) height = 200;
  @property({ type: Boolean, attribute: "hide-after-click" }) hideAfterClick = true;
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

  @state() private open = false;
  @state() private closing = false;
  @state() private resolvedSide: LoomiResolvedSide = "bottom";
  @state() private focusedIndex = -1;
  private cleanupOutside?: () => void;
  private cleanupPlacement?: () => void;
  private cancelExit?: () => void;
  private placementFrame = 0;

  @query(".loomi-menu") private menuEl?: HTMLElement;
  @query(".loomi-trigger") private triggerEl?: HTMLButtonElement;

  /** `true` while the menu panel is open. */
  get isOpen(): boolean {
    return this.open;
  }

  /**
   * Focus the trigger. The trigger is a `<button>` in the shadow root, which the
   * inherited `focus()` can't reach — so without this a consumer had no way to hand
   * focus back to a row's menu button (after closing a dialog the menu opened, say),
   * which is the kind of thing that forces a hand-rolled menu instead.
   */
  override focus(options?: FocusOptions): void {
    this.triggerEl?.focus(options);
  }

  override blur(): void {
    this.triggerEl?.blur();
  }

  /** Open the menu. */
  show(): void {
    void this.openMenu();
  }

  /** Close the menu. */
  hide(): void {
    this.closeMenu();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.teardownOpenState();
  }

  private toggle(): void {
    if (this.open) this.closeMenu();
    else void this.openMenu();
  }

  private async openMenu(): Promise<void> {
    if (this.open) return;
    // Reopened mid-close: drop the pending exit so it can't hide the panel we're about to
    // show, and clear the class so the entrance plays from the top.
    this.cancelExit?.();
    this.cancelExit = undefined;
    this.closing = false;
    this.open = true;
    this.focusedIndex = -1;
    this.cleanupOutside = onClickOutside(this, () => this.closeMenu());
    this.cleanupPlacement = this.observePlacement();

    await this.updateComplete;
    const menu = this.menuEl;
    if (!menu || !this.open) return;
    // Promote to the top layer *before* measuring, so the panel has a real size — and in
    // the same task as positioning it, so no frame ever paints it at the UA's default
    // centered position.
    if (supportsPopover(menu) && !menu.matches(":popover-open")) {
      try {
        menu.showPopover();
      } catch {
        // Already open, or the element was detached mid-flight — either way, nothing to do.
      }
    }
    this.positionMenu();
  }

  private closeMenu(options: { restoreFocus?: boolean } = {}): void {
    if (!this.open) return;
    this.open = false;
    this.focusedIndex = -1;
    // Listeners, submenus and focus are released immediately — only the panel's own
    // visibility waits, so a closing menu never keeps reacting to clicks or scrolls.
    this.releaseOpenState();
    if (options.restoreFocus) this.triggerEl?.focus();
    this.startExit();
  }

  /**
   * Keeps the panel rendered and in the top layer while it plays its `-out` keyframe,
   * then hides it for real.
   */
  private startExit(): void {
    const menu = this.menuEl;
    if (!menu) {
      this.hidePanel();
      return;
    }
    this.closing = true;
    // Wait for the `closing` class to land before listening: the entrance animation is
    // replaced (not finished) by the exit, so listening any earlier could catch the
    // entrance's own `animationend` on a menu that was opened and closed in quick
    // succession, and cut the exit short.
    void this.updateComplete.then(() => {
      if (!this.closing) return;
      this.cancelExit = onExitAnimationEnd(menu, () => {
        this.cancelExit = undefined;
        this.closing = false;
        this.hidePanel();
      });
    });
  }

  private releaseOpenState(): void {
    // Submenus are in the top layer in their own right, so hiding the panel that holds
    // them isn't enough — each one has to be told to close.
    for (const item of this.querySelectorAll("loomi-dropmenu-item")) item.closeSubmenu();
    this.cleanupOutside?.();
    this.cleanupOutside = undefined;
    this.cleanupPlacement?.();
    this.cleanupPlacement = undefined;
    cancelAnimationFrame(this.placementFrame);
  }

  private hidePanel(): void {
    const menu = this.menuEl;
    if (menu && supportsPopover(menu) && menu.matches(":popover-open")) {
      try {
        menu.hidePopover();
      } catch {
        // Already hidden — nothing to do.
      }
    }
  }

  private teardownOpenState(): void {
    this.cancelExit?.();
    this.cancelExit = undefined;
    this.closing = false;
    this.releaseOpenState();
    this.hidePanel();
  }

  private observePlacement(): () => void {
    const reposition = (): void => this.schedulePlacement();
    window.addEventListener("resize", reposition);
    // Capture phase so scrolling *any* ancestor (the table this menu sits in, say)
    // repositions the panel — it's in the top layer and won't move with them.
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }

  private schedulePlacement(): void {
    cancelAnimationFrame(this.placementFrame);
    this.placementFrame = requestAnimationFrame(() => this.positionMenu());
  }

  private positionMenu(): void {
    const menu = this.menuEl;
    const trigger = this.triggerEl;
    if (!menu || !trigger || !this.open) return;

    const placement = PLACEMENT_ALIASES[this.placement] ?? (this.placement as LoomiPanelPlacement);
    this.resolvedSide = positionFloatingPanel(trigger, menu, placement);

    // The arrow points at the trigger's center, expressed relative to wherever the panel
    // landed. That's read back from the inline `left` the helper just wrote rather than
    // from a rect, which would still carry the entrance animation's transform.
    const triggerRect = trigger.getBoundingClientRect();
    const menuLeft = Number.parseFloat(menu.style.left) || 0;
    const arrowX = triggerRect.left + triggerRect.width / 2 - menuLeft;
    menu.style.setProperty("--loomi-dropmenu-arrow-x", `${Math.round(arrowX)}px`);
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
    const item = e
      .composedPath()
      .find((target): target is LoomiDropmenuItem => target instanceof LoomiDropmenuItem);
    if (item && item.selectable && !item.hasSubmenu && !item.isToggle && this.hideAfterClick) {
      this.closeMenu({ restoreFocus: true });
    }
  };

  private async openAndFocus(index: number): Promise<void> {
    if (!this.open) await this.openMenu();
    await this.updateComplete;
    this.focusItemAt(index);
  }

  private onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    void this.openAndFocus(event.key === "ArrowUp" ? -1 : 0);
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
    return [
      "loomi-menu",
      `place-${this.resolvedSide}`,
      this.scrollable && "scrollable",
      (this.open || this.closing) && "open",
      this.closing && "closing",
    ]
      .filter(Boolean)
      .join(" ");
  }

  override render(): TemplateResult {
    const triggerPath = this.trigger ? getLoomiIcon(this.trigger.replace(/-icon$/, "")) : undefined;

    return html`
      <button
        class="loomi-trigger"
        aria-label=${this.label || nothing}
        aria-haspopup="menu"
        aria-expanded=${this.open ? "true" : "false"}
        @click=${this.triggerOn === "click" ? () => this.toggle() : nothing}
        @mouseenter=${this.triggerOn === "mouseover" ? () => void this.openMenu() : nothing}
        @keydown=${this.onTriggerKeyDown}
      >
        <slot name="trigger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            ${triggerPath ?? ELLIPSIS}
          </svg>
        </slot>
      </button>
      <div
        class=${this.menuClass}
        part="menu"
        popover="manual"
        role="menu"
        aria-label=${this.label || nothing}
        @click=${this.onItemsClick}
        @keydown=${this.onMenuKeyDown}
      >
        <div
          class="loomi-viewport"
          style=${this.scrollable ? `--loomi-menu-height:${this.height}px` : nothing}
        >
          <slot @slotchange=${this.onSlotChange}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-dropmenu": LoomiDropmenu;
    "loomi-dropmenu-item": LoomiDropmenuItem;
  }
}
