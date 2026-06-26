import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
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
 * @fires tab-change - `detail: { label }` when the active tab changes.
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
      new CustomEvent("tab-change", { bubbles: true, composed: true, detail: { label: tab.label } }),
    );
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

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tab": LoomiTab;
    "loomi-tabs": LoomiTabs;
  }
}
