import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import type { LoomiIconSource } from "@loomidev/icons";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiBottomNavActiveStyle =
  | "pill"
  | "underline"
  | "top-line"
  | "background"
  | "icon-only"
  | "dot"
  | "border"
  | "minimal";

export type LoomiBottomNavVariant = "fixed" | "floating";

/**
 * `<loomi-bottom-nav-item>` — a single destination inside a `<loomi-bottom-nav>`.
 *
 * Set `href` to render a real anchor (native links, Laravel routes, full page nav).
 * Omit it and set `value` (or rely on `name`) to render a `<button>` instead — the item
 * then behaves as a pure emitter for client-side routers. Either way, clicking always
 * fires `loomi-change`, so React Router / Vue Router / SvelteKit / Astro can intercept
 * navigation by calling `event.preventDefault()` on that event (or by setting the static
 * `prevent-default` attribute). `target="_blank"` always keeps native new-tab behavior.
 *
 * @slot - The item's label text (used when the `label` attribute is absent).
 * @csspart link - The underlying `<a>`/`<button>`.
 * @csspart icon - The `<loomi-icon>` element.
 * @csspart label - The label wrapper.
 * @csspart badge - The badge/count pill (only rendered when `badge` is set).
 * @csspart active-indicator - The underline/top-line/dot marker (only visible for those `active-style`s).
 * @fires loomi-change - Bubbles + composed, cancelable. `detail: { item, value, name, href }`.
 */
@customElement("loomi-bottom-nav-item")
export class LoomiBottomNavItem extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Label text. Falls back to slot text if empty. */
  @property() label = "";

  /** Built-in icon name (same registry as `<loomi-icon>`). */
  @property() icon = "";

  /** Icon set override for just this item. Empty = inherit from the parent `icon-source`. */
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource | "" = "";

  /** Badge content — a count or short string (e.g. `"3"`, `"9+"`). Empty = no badge. */
  @property() badge = "";

  /** Disable this item: no navigation, no click/keyboard activation. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Identifier matched against the parent's `active` attribute. Falls back to `name`, then slot text. */
  @property() value = "";

  /** Renders an `<a>` instead of a `<button>` and enables native/SPA-router navigation. */
  @property() href = "";

  /** Anchor `target`. `_blank` always keeps native new-tab behavior, even with `prevent-default`. */
  @property() target = "";

  /** Anchor `rel`. Defaults to `noopener noreferrer` when `target="_blank"` and `rel` is unset. */
  @property() rel = "";

  /** Always call `event.preventDefault()` on click, even for a real `href` — for apps that
   * want every navigation to go through the `loomi-change` event instead of a real link. */
  @property({ type: Boolean, attribute: "prevent-default" }) preventDefaultNav = false;

  /** Whether this is the active item. Normally set by the parent — set directly only when
   * using this element outside a `<loomi-bottom-nav>`. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Active visual treatment. Normally pushed down by the parent's `active-style`. */
  @property({ attribute: "active-style", reflect: true }) activeStyle: LoomiBottomNavActiveStyle = "pill";

  /** Fallback icon source inherited from the parent. Set internally — not a public API. */
  @property({ attribute: false }) hostIconSource: LoomiIconSource = "heroicons";

  @query(".loomi-bnavi-link") private linkEl?: HTMLAnchorElement | HTMLButtonElement;

  /** Delegates focus to the internal `<a>`/`<button>` — the host itself holds no focus. */
  override focus(options?: FocusOptions): void {
    this.linkEl?.focus(options);
  }

  /** The identifier compared against the parent's `active` attribute. */
  get itemValue(): string {
    return this.value || this.name || this.textContent?.trim() || "";
  }

  private get effectiveIconSource(): LoomiIconSource {
    return (this.iconSource || this.hostIconSource || "heroicons") as LoomiIconSource;
  }

  private get effectiveRel(): string | undefined {
    if (this.rel) return this.rel;
    return this.target === "_blank" ? "noopener noreferrer" : undefined;
  }

  private onClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const changeEvent = new CustomEvent("loomi-change", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { item: this, value: this.itemValue, name: this.itemValue, href: this.href || undefined },
    });
    const notCanceled = this.dispatchEvent(changeEvent);

    // Real anchor: let native navigation happen unless the consumer opted out (statically
    // via `prevent-default`, or dynamically by canceling the `loomi-change` event above) —
    // `target="_blank"` always wins, since intercepting a new-tab open makes no sense.
    if (this.href && this.target !== "_blank" && (this.preventDefaultNav || !notCanceled)) {
      event.preventDefault();
    }
  };

  private renderBadge(): TemplateResult | typeof nothing {
    if (!this.badge) return nothing;
    return html`<span class="loomi-bnavi-badge" part="badge">${this.badge}</span>`;
  }

  private renderInner(): TemplateResult {
    return html`
      <span class="loomi-bnavi-icon-wrap">
        ${this.icon
          ? html`<loomi-icon
              class="loomi-bnavi-icon"
              part="icon"
              name=${this.icon}
              source=${this.effectiveIconSource}
              size="1.4rem"
            ></loomi-icon>`
          : nothing}
        ${this.renderBadge()}
      </span>
      <span class="loomi-bnavi-label" part="label"><slot>${this.label}</slot></span>
      <span class="loomi-bnavi-indicator" part="active-indicator" aria-hidden="true"></span>
    `;
  }

  override render(): TemplateResult {
    if (this.href) {
      return html`<a
        class="loomi-bnavi-link"
        part="link"
        href=${ifDefined(this.disabled ? undefined : this.href)}
        target=${ifDefined(this.target || undefined)}
        rel=${ifDefined(this.effectiveRel)}
        aria-current=${this.active ? "page" : nothing}
        aria-disabled=${this.disabled ? "true" : nothing}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this.onClick}
        >${this.renderInner()}</a
      >`;
    }

    return html`<button
      class="loomi-bnavi-link"
      part="link"
      type="button"
      ?disabled=${this.disabled}
      aria-current=${this.active ? "page" : nothing}
      @click=${this.onClick}
    >
      ${this.renderInner()}
    </button>`;
  }
}

/**
 * `<loomi-bottom-nav>` — a mobile bottom navigation bar. Fixed to the viewport bottom by
 * default (safe-area aware); set `variant="floating"` for a detached, rounded, elevated
 * island instead. Set `mobile-only` to hide it at tablet width and up.
 *
 * `active` is a controlled identifier — set it to a child's `value`/`name` (or update it
 * from a router) and every `<loomi-bottom-nav-item>` recomputes its own active state.
 * Clicking an (enabled) item also updates `active` locally for immediate feedback, and
 * always fires `loomi-change` so a router can take over.
 *
 * @slot - `<loomi-bottom-nav-item>` children (3–5 recommended).
 * @csspart nav - The internal `<nav>` element.
 * @fires loomi-change - Re-fired (bubbled through) from the clicked item — see
 *   `<loomi-bottom-nav-item>`. `detail: { item, value, name, href }`.
 */
@customElement("loomi-bottom-nav")
export class LoomiBottomNav extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** The active item's `value`/`name`. Set this from your router to control which item is highlighted. */
  @property({ reflect: true }) active = "";

  /** Visual treatment for the active item. */
  @property({ attribute: "active-style", reflect: true }) activeStyle: LoomiBottomNavActiveStyle = "pill";

  /** `fixed` docks edge-to-edge at the viewport bottom (default); `floating` detaches into a rounded, elevated island. */
  @property({ reflect: true }) variant: LoomiBottomNavVariant = "fixed";

  /** Accent used for the active item's color/background/border/dot. */
  @property() color: LoomiColor = "primary" as LoomiColor;

  /** Default icon set for every item — overridable per-item via `<loomi-bottom-nav-item icon-source>`. */
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource = "heroicons";

  /** Accessible label for the `<nav>` landmark. */
  @property() label = "Primary";

  /** Hide this bar at tablet width (768px) and up — bottom navs are typically mobile-only. */
  @property({ type: Boolean, attribute: "mobile-only", reflect: true }) mobileOnly = false;

  private get items(): LoomiBottomNavItem[] {
    return Array.from(this.querySelectorAll<LoomiBottomNavItem>("loomi-bottom-nav-item"));
  }

  private syncItems(): void {
    for (const item of this.items) {
      item.active = !!this.active && item.itemValue === this.active;
      item.activeStyle = this.activeStyle;
      item.hostIconSource = this.iconSource;
    }
  }

  // Runs before every render (including the first — light DOM children are already parsed
  // by the time Lit's first render fires, unlike connectedCallback) so items always reflect
  // the current `active`/`active-style`/`icon-source` before paint.
  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("active") || changed.has("activeStyle") || changed.has("iconSource")) {
      this.syncItems();
    }
  }

  private onSlotchange = (): void => {
    this.syncItems();
    this.requestUpdate();
  };

  private onItemChange = (event: Event): void => {
    const detail = (event as CustomEvent<{ item?: LoomiBottomNavItem; value?: string }>).detail;
    if (!detail?.item || detail.item.disabled) return;
    this.active = detail.value ?? this.active;
  };

  /** Arrow/Home/End roving focus across items (manual activation — Enter/Space/click still
   * do the actual navigating, per the WAI-ARIA APG toolbar pattern). */
  private onKeydown = (event: KeyboardEvent): void => {
    const enabled = this.items.filter((item) => !item.disabled);
    if (!enabled.length) return;

    const current = event
      .composedPath()
      .find((el): el is LoomiBottomNavItem => el instanceof LoomiBottomNavItem);
    const currentIndex = current ? enabled.indexOf(current) : -1;

    let next: LoomiBottomNavItem | undefined;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        if (currentIndex === -1) return;
        next = enabled[(currentIndex + 1) % enabled.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        if (currentIndex === -1) return;
        next = enabled[(currentIndex - 1 + enabled.length) % enabled.length];
        break;
      case "Home":
        next = enabled[0];
        break;
      case "End":
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  };

  override render(): TemplateResult {
    return html`
      <nav
        class="loomi-bnav"
        part="nav"
        style=${accentVars(this.color)}
        aria-label=${this.label}
        @keydown=${this.onKeydown}
        @loomi-change=${this.onItemChange}
      >
        <slot @slotchange=${this.onSlotchange}></slot>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-bottom-nav": LoomiBottomNav;
    "loomi-bottom-nav-item": LoomiBottomNavItem;
  }
}
