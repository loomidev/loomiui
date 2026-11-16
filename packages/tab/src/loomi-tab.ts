import { html, nothing, type PropertyValues, type TemplateResult, isServer } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  accentVars,
  watchDarkMode,
  type LoomiColor,
} from "@loomidev/core";
import {
  hasLoomiIcon,
  hasLoomiDiskIcon,
  isLoomiDiskIconSource,
  type LoomiIconSource,
  type LoomiIconType,
} from "@loomidev/icons";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTabStyle = "simple" | "system" | "pills";

/**
 * `<loomi-tab>` — a single tab panel. Set `label` (and optionally `icon`) for its
 * heading, and `active` on the one that should show first. Place inside `<loomi-tabs>`.
 *
 * The heading icon renders through `<loomi-icon>`, so `icon-source` can pick any of its
 * sets — the inline heroicons (default) or the disk-based iconsax / untitledui sets,
 * which load on first use — and `icon-variant` picks outline / solid / twotone.
 *
 * @slot - The tab's content.
 */
@customElement("loomi-tab")
export class LoomiTab extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() icon = "";
  /** Icon set for `icon`: `heroicons` (default, inline), `iconsax` or `untitledui` (loaded from disk). */
  @property({ attribute: "icon-source" }) iconSource: LoomiIconSource = "heroicons";
  /** Icon style: `outline` (default), `solid`, or `twotone` (iconsax only). */
  @property({ attribute: "icon-variant" }) iconVariant: LoomiIconType = "outline";
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Make this heading a real link to this URL (open-in-new-tab, crawlable, no script needed). */
  @property() url = "";

  override render(): TemplateResult {
    return html`<div class="loomi-panel" role="tabpanel" ?hidden=${!this.active}>
      <slot></slot>
    </div>`;
  }
}

/**
 * `<loomi-tabs>` — builds a heading bar from its `<loomi-tab>` children and toggles
 * the active panel. Styles: `simple` (default), `system`, `pills`.
 *
 * Set `overflow="scroll"` for a bar that may hold more headings than fit (category
 * filters, say): it stays on one line, scrolls sideways, fades at the edges and shows
 * scroll buttons. The default, `wrap`, wraps headings onto more lines.
 *
 * @slot - `<loomi-tab>` children.
 * @csspart tab-icon - Each heading's `<loomi-icon>`.
 * @fires loomi-tab-change - `detail: { label }` when the active tab changes.
 */
@customElement("loomi-tabs")
export class LoomiTabs extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ attribute: "tab-style" }) tabStyle: LoomiTabStyle = "simple";
  /** `wrap` (default) wraps headings; `scroll` keeps one line that scrolls, with edge buttons. */
  @property({ reflect: true }) overflow: "wrap" | "scroll" = "wrap";

  @state() private canScrollStart = false;
  @state() private canScrollEnd = false;

  private get tabs(): LoomiTab[] {
    // Light DOM is not readable during server rendering; hydration fills this in on the client.
    if (isServer) return [];
    return Array.from(this.querySelectorAll("loomi-tab"));
  }

  private defaultedActiveTab = false;
  private indicatorObserver?: ResizeObserver;
  private indicatorFrame = 0;
  private cleanupDarkWatch?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.cleanupDarkWatch = watchDarkMode((isDark) => {
      this.classList.toggle("is-dark", isDark);
    });
  }

  // Runs before the first render (not firstUpdated, which runs after) so the default
  // active tab is already set by the time render() reads tab.active — avoids
  // triggering an unnecessary second update cycle right after the first.
  override willUpdate(): void {
    if (this.defaultedActiveTab) return;
    const tabs = this.tabs;
    if (!tabs.length) return;
    this.defaultedActiveTab = true;
    if (!tabs.some((t) => t.active)) {
      const first = tabs.find((t) => !t.disabled);
      if (first) first.active = true;
    }
  }

  private activate(tab: LoomiTab): void {
    if (tab.disabled) return;
    if (tab.url) {
      location.href = tab.url;
      return;
    }
    for (const t of this.tabs) t.active = t === tab;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("loomi-tab-change", {
        bubbles: true,
        composed: true,
        detail: { label: tab.label },
      }),
    );
  }

  /** Whether `tab.icon` names an icon its source actually has (else no icon is drawn). */
  private hasIcon(tab: LoomiTab): boolean {
    if (!tab.icon) return false;
    const source = tab.iconSource || "heroicons";
    if (isLoomiDiskIconSource(source)) return hasLoomiDiskIcon(source, tab.icon, tab.iconVariant);
    return hasLoomiIcon(tab.icon, tab.iconVariant === "solid" ? "solid" : "outline");
  }

  private get activeTabIndex(): number {
    return this.tabs.findIndex((tab) => tab.active);
  }

  private scheduleIndicatorSync(): void {
    cancelAnimationFrame(this.indicatorFrame);
    this.indicatorFrame = requestAnimationFrame(() => this.syncIndicator());
  }

  private syncIndicator(): void {
    const headings = this.shadowRoot?.querySelector<HTMLElement>(".loomi-headings");
    const activeButton =
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".loomi-head")[this.activeTabIndex];
    if (!headings || !activeButton) {
      headings?.style.setProperty("--loomi-tab-indicator-opacity", "0");
      return;
    }

    const headingsRect = headings.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    // Content coordinates: the indicator scrolls with the headings in `overflow="scroll"`.
    headings.style.setProperty(
      "--loomi-tab-indicator-x",
      `${buttonRect.left - headingsRect.left + headings.scrollLeft}px`,
    );
    headings.style.setProperty("--loomi-tab-indicator-y", `${buttonRect.top - headingsRect.top}px`);
    headings.style.setProperty(
      "--loomi-tab-indicator-line-y",
      `${buttonRect.bottom - headingsRect.top - 2}px`,
    );
    headings.style.setProperty("--loomi-tab-indicator-width", `${buttonRect.width}px`);
    headings.style.setProperty("--loomi-tab-indicator-height", `${buttonRect.height}px`);
    headings.style.setProperty("--loomi-tab-indicator-opacity", "1");
    this.syncScrollEdges();
    requestAnimationFrame(() => headings.classList.add("indicator-ready"));
  }

  private observeIndicatorTargets(): void {
    this.indicatorObserver?.disconnect();
    if (typeof ResizeObserver === "undefined") return;

    this.indicatorObserver = new ResizeObserver(() => this.scheduleIndicatorSync());
    const headings = this.shadowRoot?.querySelector<HTMLElement>(".loomi-headings");
    if (headings) this.indicatorObserver.observe(headings);
    this.shadowRoot
      ?.querySelectorAll<HTMLElement>(".loomi-head")
      .forEach((button) => this.indicatorObserver?.observe(button));
  }

  private get headingsEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector<HTMLElement>(".loomi-headings") ?? null;
  }

  private syncScrollEdges = (): void => {
    const el = this.headingsEl;
    if (!el || this.overflow !== "scroll") {
      this.canScrollStart = this.canScrollEnd = false;
      return;
    }
    // scrollLeft is negative under RTL in every current engine; compare magnitudes.
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    this.canScrollStart = pos > 1;
    this.canScrollEnd = pos < max - 1;
  };

  private scrollHeadings(direction: 1 | -1): void {
    const el = this.headingsEl;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * el.clientWidth * 0.75, behavior: "smooth" });
  }

  /** Bring the active heading into view in a scrolling bar (on load, too). */
  private revealActive(): void {
    if (this.overflow !== "scroll") return;
    const head = this.shadowRoot?.querySelectorAll<HTMLElement>(".loomi-head")[this.activeTabIndex];
    head?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  override firstUpdated(): void {
    this.revealActive();
    this.observeIndicatorTargets();
    this.scheduleIndicatorSync();
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("tabStyle") || changed.has("color")) {
      this.shadowRoot
        ?.querySelector<HTMLElement>(".loomi-headings")
        ?.classList.remove("indicator-ready");
    }
    this.observeIndicatorTargets();
    this.scheduleIndicatorSync();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    cancelAnimationFrame(this.indicatorFrame);
    this.indicatorObserver?.disconnect();
    this.cleanupDarkWatch?.();
    this.cleanupDarkWatch = undefined;
  }

  /** Focuses the rendered tab button at the same index as `tab` in `this.tabs`. */
  private focusTabButton(tab: LoomiTab): void {
    const index = this.tabs.indexOf(tab);
    this.updateComplete.then(() => {
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".loomi-head")[index]?.focus();
    });
  }

  /**
   * Arrow-key / Home / End navigation per the WAI-ARIA APG "tabs" pattern (roving
   * tabindex + automatic activation): moving focus also switches the active panel,
   * matching this component's click behavior.
   */
  private onKeydown = (e: KeyboardEvent): void => {
    const enabled = this.tabs.filter((t) => !t.disabled);
    if (!enabled.length) return;
    const current = enabled.findIndex((t) => t.active);
    let next: LoomiTab | undefined;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = enabled[(current + 1 + enabled.length) % enabled.length];
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = enabled[(current - 1 + enabled.length) % enabled.length];
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
    e.preventDefault();
    // A link heading navigates on activation; arrows only move focus to it.
    if (!next.url) this.activate(next);
    this.focusTabButton(next);
  };

  private renderHeadContent(tab: LoomiTab): TemplateResult {
    return html`${
      this.hasIcon(tab)
        ? html`<loomi-icon
                  class="loomi-head-icon"
                  part="tab-icon"
                  name=${tab.icon}
                  source=${tab.iconSource || "heroicons"}
                  variant=${tab.iconVariant || "outline"}
                  stroke-width="1.6"
                ></loomi-icon>`
        : nothing
    }
      <span>${tab.label}</span>`;
  }

  private renderHead(tab: LoomiTab, rovingIndex: number): TemplateResult {
    const tabindex = rovingIndex === this.tabs.indexOf(tab) ? "0" : "-1";
    // A `url` heading is a real link, so the browser's link affordances work.
    if (tab.url && !tab.disabled) {
      return html`<a
        class="loomi-head ${tab.active ? "active" : ""}"
        role="tab"
        href=${tab.url}
        aria-selected=${tab.active ? "true" : "false"}
        aria-current=${tab.active ? "page" : nothing}
        tabindex=${tabindex}
      >${this.renderHeadContent(tab)}</a>`;
    }
    return html`<button
      class="loomi-head ${tab.active ? "active" : ""}"
      role="tab"
      aria-selected=${tab.active ? "true" : "false"}
      tabindex=${tabindex}
      ?disabled=${tab.disabled}
      @click=${() => this.activate(tab)}
    >${this.renderHeadContent(tab)}</button>`;
  }

  override render(): TemplateResult {
    const scroll = this.overflow === "scroll";
    const tabs = this.tabs;
    // The roving tab stop: the active heading, else the first enabled one.
    const active = tabs.findIndex((t) => t.active);
    const rovingIndex = active >= 0 ? active : tabs.findIndex((t) => !t.disabled);
    const headings = html`<div
      class="loomi-headings ${this.tabStyle} ${scroll ? "scroll" : ""}"
      role="tablist"
      style=${accentVars(this.color)}
      @keydown=${this.onKeydown}
      @scroll=${scroll ? this.syncScrollEdges : nothing}
    >
      <span class="loomi-tab-indicator" aria-hidden="true"></span>
      ${tabs.map((tab) => this.renderHead(tab, rovingIndex))}
    </div>`;
    const chevron = (d: string) =>
      html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d=${d} /></svg>`;

    return html`
      ${
        scroll
          ? html`<div
            class="loomi-tabbar ${this.canScrollStart ? "can-start" : ""} ${this.canScrollEnd ? "can-end" : ""}"
            style=${accentVars(this.color)}
          >
            <button
              class="loomi-scroll-btn start"
              part="scroll-button"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              @click=${() => this.scrollHeadings(-1)}
            >${chevron("M15.75 19.5 8.25 12l7.5-7.5")}</button>
            ${headings}
            <button
              class="loomi-scroll-btn end"
              part="scroll-button"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              @click=${() => this.scrollHeadings(1)}
            >${chevron("m8.25 4.5 7.5 7.5-7.5 7.5")}</button>
          </div>`
          : headings
      }
      <div class="loomi-body"><slot @slotchange=${() => this.requestUpdate()}></slot></div>
    `;
  }
}

export interface LoomiTabChangeDetail {
  label: string;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tab": LoomiTab;
    "loomi-tabs": LoomiTabs;
  }

  interface HTMLElementEventMap {
    "loomi-tab-change": CustomEvent<LoomiTabChangeDetail>;
  }
}
