import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, watchDarkMode, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTabStyle = "simple" | "system" | "pills";

/**
 * `<loomi-tab>` — a single tab panel. Set `label` (and optionally `icon`) for its
 * heading, and `active` on the one that should show first. Place inside `<loomi-tabs>`.
 *
 * @slot - The tab's content.
 */
@customElement("loomi-tab")
export class LoomiTab extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() icon = "";
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
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
 * @slot - `<loomi-tab>` children.
 * @fires loomi-tab-change - `detail: { label }` when the active tab changes.
 */
@customElement("loomi-tabs")
export class LoomiTabs extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ attribute: "tab-style" }) tabStyle: LoomiTabStyle = "simple";

  private get tabs(): LoomiTab[] {
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
      new CustomEvent("loomi-tab-change", { bubbles: true, composed: true, detail: { label: tab.label } }),
    );
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
    const activeButton = this.shadowRoot?.querySelectorAll<HTMLButtonElement>(".loomi-head")[this.activeTabIndex];
    if (!headings || !activeButton) {
      headings?.style.setProperty("--loomi-tab-indicator-opacity", "0");
      return;
    }

    const headingsRect = headings.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();
    headings.style.setProperty("--loomi-tab-indicator-x", `${buttonRect.left - headingsRect.left}px`);
    headings.style.setProperty("--loomi-tab-indicator-y", `${buttonRect.top - headingsRect.top}px`);
    headings.style.setProperty("--loomi-tab-indicator-line-y", `${buttonRect.bottom - headingsRect.top - 2}px`);
    headings.style.setProperty("--loomi-tab-indicator-width", `${buttonRect.width}px`);
    headings.style.setProperty("--loomi-tab-indicator-height", `${buttonRect.height}px`);
    headings.style.setProperty("--loomi-tab-indicator-opacity", "1");
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

  override firstUpdated(): void {
    this.observeIndicatorTargets();
    this.scheduleIndicatorSync();
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("tabStyle") || changed.has("color")) {
      this.shadowRoot?.querySelector<HTMLElement>(".loomi-headings")?.classList.remove("indicator-ready");
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
    this.activate(next);
    this.focusTabButton(next);
  };

  override render(): TemplateResult {
    return html`
      <div
        class="loomi-headings ${this.tabStyle}"
        role="tablist"
        style=${accentVars(this.color)}
        @keydown=${this.onKeydown}
      >
        <span class="loomi-tab-indicator" aria-hidden="true"></span>
        ${this.tabs.map(
          (tab) => html`<button
            class="loomi-head ${tab.active ? "active" : ""}"
            role="tab"
            aria-selected=${tab.active ? "true" : "false"}
            tabindex=${tab.active ? "0" : "-1"}
            ?disabled=${tab.disabled}
            @click=${() => this.activate(tab)}
          >
            ${tab.icon && getLoomiIcon(tab.icon)
              ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${getLoomiIcon(tab.icon)}</svg>`
              : nothing}
            <span>${tab.label}</span>
          </button>`,
        )}
      </div>
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
