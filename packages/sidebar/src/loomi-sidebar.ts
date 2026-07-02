import { html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import "@loomidev/tooltip/loomi-tooltip.js";
import { componentStyles } from "./generated/styles.css.js";
import {
  findSidebarProvider,
  readSidebarPreference,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_MOBILE_BREAKPOINT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  writeSidebarPreference,
  type SidebarCollapsible,
  type SidebarProviderElement,
  type SidebarSide,
  type SidebarState,
  type SidebarVariant,
} from "./sidebar-context.js";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

const PANEL_LEFT = svg`<rect width="18" height="18" x="3" y="3" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="9" x2="9" y1="3" y2="21" stroke="currentColor" stroke-width="2"/>`;

function provider(node: Node | null): SidebarProviderElement | null {
  return findSidebarProvider(node);
}

/**
 * `<loomi-sidebar-provider>` — wraps a sidebar layout and manages open/collapsed state,
 * keyboard shortcut (⌘/Ctrl+B), and mobile sheet behavior.
 *
 * @slot - `loomi-sidebar`, `loomi-sidebar-inset`, and other layout children.
 */
@customElement("loomi-sidebar-provider")
export class LoomiSidebarProvider extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "default-open", converter: booleanAttribute })
  defaultOpen = true;
  @property({ type: Boolean, reflect: true }) open = readSidebarPreference();
  @property({ type: Boolean, reflect: true, attribute: "open-mobile" }) openMobile = false;
  @property({ reflect: true }) variant: SidebarVariant = "sidebar";
  @property({ reflect: true }) collapsible: SidebarCollapsible = "offcanvas";
  @property({ reflect: true }) side: SidebarSide = "left";

  @state() isMobile = false;

  private mediaQuery: MediaQueryList | null = null;
  private onMediaChange = (): void => {
    this.isMobile = this.mediaQuery?.matches ?? false;
    if (!this.isMobile) this.openMobile = false;
    this.syncHostAttributes();
    this.notifyStateChange();
  };

  get state(): SidebarState {
    return this.open ? "expanded" : "collapsed";
  }

  private notifyStateChange(): void {
    this.dispatchEvent(new CustomEvent("loomi-sidebar-state-change", { bubbles: true }));
  }

  setOpen(next: boolean): void {
    this.open = next;
    writeSidebarPreference(next);
    this.dispatchEvent(new CustomEvent("loomi-sidebar-open-change", { detail: { open: next } }));
    this.notifyStateChange();
  }

  setOpenMobile(next: boolean): void {
    this.openMobile = next;
    this.dispatchEvent(new CustomEvent("loomi-sidebar-open-mobile-change", { detail: { open: next } }));
    this.notifyStateChange();
  }

  toggleSidebar(): void {
    if (this.isMobile) this.setOpenMobile(!this.openMobile);
    else this.setOpen(!this.open);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("open")) this.open = readSidebarPreference() ?? this.defaultOpen;
    this.mediaQuery = window.matchMedia(`(max-width: ${SIDEBAR_MOBILE_BREAKPOINT - 1}px)`);
    this.isMobile = this.mediaQuery.matches;
    this.mediaQuery.addEventListener("change", this.onMediaChange);
    document.addEventListener("keydown", this.onKeyDown);
    this.syncHostAttributes();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.mediaQuery?.removeEventListener("change", this.onMediaChange);
    document.removeEventListener("keydown", this.onKeyDown);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("open") && changed.get("open") !== undefined) writeSidebarPreference(this.open);
    this.syncHostAttributes();
    if (changed.has("open") || changed.has("openMobile") || changed.has("isMobile")) this.notifyStateChange();
  }

  private syncHostAttributes(): void {
    this.dataset.state = this.state;
    this.dataset.mobile = this.isMobile ? "true" : "false";
    this.dataset.collapsible = this.collapsible;
    this.dataset.variant = this.variant;
    this.style.setProperty("--loomi-sidebar-width", SIDEBAR_WIDTH);
    this.style.setProperty("--loomi-sidebar-width-icon", SIDEBAR_WIDTH_ICON);
    this.style.setProperty("--loomi-sidebar-width-mobile", SIDEBAR_WIDTH_MOBILE);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT) return;
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    this.toggleSidebar();
  };

  override render(): TemplateResult {
    return html`<div class="provider-inner"><slot></slot></div>`;
  }
}

/**
 * `<loomi-sidebar>` — the main collapsible sidebar panel. Compose with `loomi-sidebar-*` parts.
 *
 * @slot - Header, content, footer, and rail sections.
 * @slot mobile - Optional mobile-only content (defaults to the default slot).
 */
@customElement("loomi-sidebar")
export class LoomiSidebar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ reflect: true }) side: SidebarSide = "left";
  @property({ reflect: true }) variant: SidebarVariant = "sidebar";
  @property({ reflect: true }) collapsible: SidebarCollapsible = "offcanvas";

  private syncProvider(): void {
    const host = provider(this);
    if (!host) return;
    host.collapsible = this.collapsible;
    host.variant = this.variant;
    host.side = this.side;
  }

  private onProviderStateChange = (): void => {
    this.requestUpdate();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncProvider();
    provider(this)?.addEventListener("loomi-sidebar-state-change", this.onProviderStateChange);
  }

  override disconnectedCallback(): void {
    provider(this)?.removeEventListener("loomi-sidebar-state-change", this.onProviderStateChange);
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("collapsible") || changed.has("variant") || changed.has("side")) this.syncProvider();
  }

  override render(): TemplateResult {
    const host = provider(this);
    const state = host?.state ?? "expanded";
    const isMobile = host?.isMobile ?? false;
    const openMobile = host?.openMobile ?? false;

    const inner = html`
      <div
        class="sidebar-inner"
        data-sidebar="sidebar"
        data-state=${state}
        data-collapsible=${this.collapsible}
        data-variant=${this.variant}
        data-side=${this.side}
      >
        <slot></slot>
      </div>
    `;

    if (isMobile) {
      return html`
        ${openMobile
          ? html`<div class="mobile-backdrop" @click=${() => host?.setOpenMobile(false)}></div>`
          : nothing}
        <div
          class="mobile-sheet"
          data-side=${this.side}
          data-open=${openMobile ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-hidden=${openMobile ? "false" : "true"}
        >
          ${inner}
        </div>
      `;
    }

    if (this.collapsible === "none") {
      return html`
        <div class="sidebar-gap" style="width: var(--loomi-sidebar-width)"></div>
        <div class="sidebar-container" data-collapsible="none" data-state=${state} data-variant=${this.variant} data-side=${this.side}>
          ${inner}
        </div>
      `;
    }

    return html`
      <div class="sidebar-gap"></div>
      <div
        class="sidebar-container"
        data-collapsible=${this.collapsible}
        data-state=${state}
        data-variant=${this.variant}
        data-side=${this.side}
      >
        ${inner}
        <slot name="rail"></slot>
      </div>
    `;
  }
}

/** `<loomi-sidebar-header>` — sticky top region for branding or workspace switchers. */
@customElement("loomi-sidebar-header")
export class LoomiSidebarHeader extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="header" data-sidebar="header"><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-footer>` — sticky bottom region for user menus or actions. */
@customElement("loomi-sidebar-footer")
export class LoomiSidebarFooter extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="footer" data-sidebar="footer"><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-content>` — scrollable region between header and footer. */
@customElement("loomi-sidebar-content")
export class LoomiSidebarContent extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="content" data-sidebar="content"><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-separator>` — horizontal divider. */
@customElement("loomi-sidebar-separator")
export class LoomiSidebarSeparator extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="separator" data-sidebar="separator" role="separator"></div>`;
  }
}

/** `<loomi-sidebar-group>` — section within the sidebar. Set `hide-collapsed` to hide in icon mode. */
@customElement("loomi-sidebar-group")
export class LoomiSidebarGroup extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "hide-collapsed", converter: booleanAttribute })
  hideCollapsed = false;

  override render(): TemplateResult {
    return html`<div class="group" data-sidebar="group" ?data-hide-collapsed=${this.hideCollapsed}><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-group-label>` — label for a sidebar group. */
@customElement("loomi-sidebar-group-label")
export class LoomiSidebarGroupLabel extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="group-label" data-sidebar="group-label"><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-group-action>` — optional action button for a group header. */
@customElement("loomi-sidebar-group-action")
export class LoomiSidebarGroupAction extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<button type="button" class="group-action" data-sidebar="group-action"><slot></slot></button>`;
  }
}

/** `<loomi-sidebar-group-content>` — content wrapper inside a group. */
@customElement("loomi-sidebar-group-content")
export class LoomiSidebarGroupContent extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<div class="group-content" data-sidebar="group-content"><slot></slot></div>`;
  }
}

/** `<loomi-sidebar-menu>` — menu list within a group. */
@customElement("loomi-sidebar-menu")
export class LoomiSidebarMenu extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<ul class="menu" data-sidebar="menu"><slot></slot></ul>`;
  }
}

/** `<loomi-sidebar-menu-item>` — single menu entry. */
@customElement("loomi-sidebar-menu-item")
export class LoomiSidebarMenuItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<li class="menu-item" data-sidebar="menu-item"><slot></slot></li>`;
  }
}

/**
 * `<loomi-sidebar-menu-button>` — interactive menu button or link wrapper.
 * Use `tooltip` for a label when the sidebar is collapsed to icons.
 */
@customElement("loomi-sidebar-menu-button")
export class LoomiSidebarMenuButton extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "is-active", converter: booleanAttribute }) isActive = false;
  @property({ type: Boolean, attribute: "as-child", converter: booleanAttribute }) asChild = false;
  @property() tooltip = "";
  @property({ reflect: true }) size: "default" | "sm" | "lg" = "default";
  @property() href = "";

  private onClick = (): void => {
    if (!this.href) return;
    if (/^https?:\/\//.test(this.href)) window.open(this.href, "_blank");
    else location.href = this.href;
  };

  override render(): TemplateResult {
    const host = provider(this);
    const showTooltip = Boolean(this.tooltip) && host?.state === "collapsed" && host?.collapsible === "icon";

    let control: TemplateResult;
    if (this.asChild) {
      control = html`<div
        class="menu-button as-child"
        data-sidebar="menu-button"
        data-size=${this.size}
        data-active=${this.isActive ? "true" : "false"}
      ><slot></slot></div>`;
    } else if (this.href) {
      control = html`<a
        class="menu-button"
        data-sidebar="menu-button"
        data-size=${this.size}
        data-active=${this.isActive ? "true" : "false"}
        href=${this.href}
        aria-current=${this.isActive ? "page" : nothing}
      ><slot></slot></a>`;
    } else {
      control = html`<button
        type="button"
        class="menu-button"
        data-sidebar="menu-button"
        data-size=${this.size}
        data-active=${this.isActive ? "true" : "false"}
        @click=${this.onClick}
      ><slot></slot></button>`;
    }

    if (!showTooltip) return control;

    return html`
      <loomi-tooltip content=${this.tooltip} position="right">
        ${control}
      </loomi-tooltip>
    `;
  }
}

/** `<loomi-sidebar-menu-action>` — secondary action on a menu item. */
@customElement("loomi-sidebar-menu-action")
export class LoomiSidebarMenuAction extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "show-on-hover", converter: booleanAttribute })
  showOnHover = true;

  override render(): TemplateResult {
    return html`<button
      type="button"
      class="menu-action"
      data-sidebar="menu-action"
      data-show-on-hover=${this.showOnHover ? "true" : "false"}
    ><slot></slot></button>`;
  }
}

/** `<loomi-sidebar-menu-badge>` — badge overlay on a menu item. */
@customElement("loomi-sidebar-menu-badge")
export class LoomiSidebarMenuBadge extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<span class="menu-badge" data-sidebar="menu-badge"><slot></slot></span>`;
  }
}

/** `<loomi-sidebar-menu-sub>` — nested submenu list. */
@customElement("loomi-sidebar-menu-sub")
export class LoomiSidebarMenuSub extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<ul class="menu-sub" data-sidebar="menu-sub"><slot></slot></ul>`;
  }
}

/** `<loomi-sidebar-menu-sub-item>` — single submenu entry. */
@customElement("loomi-sidebar-menu-sub-item")
export class LoomiSidebarMenuSubItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<li class="menu-sub-item" data-sidebar="menu-sub-item"><slot></slot></li>`;
  }
}

/** `<loomi-sidebar-menu-sub-button>` — link/button for a submenu entry. */
@customElement("loomi-sidebar-menu-sub-button")
export class LoomiSidebarMenuSubButton extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, attribute: "is-active", converter: booleanAttribute }) isActive = false;
  @property() href = "";
  @property({ reflect: true }) size: "sm" | "md" = "md";

  override render(): TemplateResult {
    return html`<a
      class="menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size=${this.size}
      data-active=${this.isActive ? "true" : "false"}
      href=${this.href || "#"}
      aria-current=${this.isActive ? "page" : nothing}
    ><slot></slot></a>`;
  }
}

/** `<loomi-sidebar-inset>` — wraps the main content area beside the sidebar. */
@customElement("loomi-sidebar-inset")
export class LoomiSidebarInset extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  override render(): TemplateResult {
    return html`<main class="inset" data-sidebar="inset"><slot></slot></main>`;
  }
}

/** `<loomi-sidebar-rail>` — edge control to toggle the sidebar. */
@customElement("loomi-sidebar-rail")
export class LoomiSidebarRail extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  private toggle = (): void => {
    provider(this)?.toggleSidebar();
  };

  override render(): TemplateResult {
    const side = provider(this)?.side ?? "left";
    return html`<button
      type="button"
      class="rail"
      data-sidebar="rail"
      data-side=${side}
      aria-label="Toggle sidebar"
      @click=${this.toggle}
    ></button>`;
  }
}

/** `<loomi-sidebar-trigger>` — button that toggles the sidebar (desktop and mobile). */
@customElement("loomi-sidebar-trigger")
export class LoomiSidebarTrigger extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  private toggle = (): void => {
    provider(this)?.toggleSidebar();
  };

  override render(): TemplateResult {
    return html`<button type="button" class="trigger" data-sidebar="trigger" @click=${this.toggle}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${PANEL_LEFT}</svg>
      <span class="sr-only">Toggle Sidebar</span>
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-sidebar-provider": LoomiSidebarProvider;
    "loomi-sidebar": LoomiSidebar;
    "loomi-sidebar-header": LoomiSidebarHeader;
    "loomi-sidebar-footer": LoomiSidebarFooter;
    "loomi-sidebar-content": LoomiSidebarContent;
    "loomi-sidebar-separator": LoomiSidebarSeparator;
    "loomi-sidebar-group": LoomiSidebarGroup;
    "loomi-sidebar-group-label": LoomiSidebarGroupLabel;
    "loomi-sidebar-group-action": LoomiSidebarGroupAction;
    "loomi-sidebar-group-content": LoomiSidebarGroupContent;
    "loomi-sidebar-menu": LoomiSidebarMenu;
    "loomi-sidebar-menu-item": LoomiSidebarMenuItem;
    "loomi-sidebar-menu-button": LoomiSidebarMenuButton;
    "loomi-sidebar-menu-action": LoomiSidebarMenuAction;
    "loomi-sidebar-menu-badge": LoomiSidebarMenuBadge;
    "loomi-sidebar-menu-sub": LoomiSidebarMenuSub;
    "loomi-sidebar-menu-sub-item": LoomiSidebarMenuSubItem;
    "loomi-sidebar-menu-sub-button": LoomiSidebarMenuSubButton;
    "loomi-sidebar-inset": LoomiSidebarInset;
    "loomi-sidebar-rail": LoomiSidebarRail;
    "loomi-sidebar-trigger": LoomiSidebarTrigger;
  }
}
