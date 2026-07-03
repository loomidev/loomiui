import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import "@loomidev/dropmenu/loomi-dropmenu.js";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTheme = "light" | "dark" | "system";
export type LoomiThemeSwitcherVariant = "horizontal" | "dropmenu";
const STORAGE_KEY = "loomi-theme";
const DEFAULT_LIGHT_TEXT = "Light";
const DEFAULT_DARK_TEXT = "Dark";
const DEFAULT_SYSTEM_TEXT = "System";

/** Apply a theme: toggles the `dark` class on <html> and stores the choice. */
export function applyLoomiTheme(mode: LoomiTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/** The stored theme choice (defaults to "system"). */
export function getLoomiTheme(): LoomiTheme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as LoomiTheme) || "system";
  } catch {
    return "system";
  }
}

/**
 * `<loomi-theme-switcher>` — a light/dark/system theme toggle. Persists the choice to
 * localStorage and toggles the `dark` class on `<html>`.
 *
 * @fires theme-change - `detail: { theme }` when the theme is changed.
 */
@customElement("loomi-theme-switcher")
export class LoomiThemeSwitcher extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ attribute: "light-text" }) lightText = DEFAULT_LIGHT_TEXT;
  @property({ attribute: "dark-text" }) darkText = DEFAULT_DARK_TEXT;
  @property({ attribute: "system-text" }) systemText = DEFAULT_SYSTEM_TEXT;
  @property() locale = "";
  @property({ attribute: "light-icon" }) lightIcon = "sun";
  @property({ attribute: "dark-icon" }) darkIcon = "moon";
  @property({ attribute: "system-icon" }) systemIcon = "computer-desktop";
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;
  @property({ type: Boolean, attribute: "show-labels" }) showLabels = false;
  @property() variant: LoomiThemeSwitcherVariant = "horizontal";

  @state() private mode: LoomiTheme = getLoomiTheme();
  private mq?: MediaQueryList;

  override connectedCallback(): void {
    super.connectedCallback();
    applyLoomiTheme(this.mode);
    this.mq = matchMedia("(prefers-color-scheme: dark)");
    this.mq.addEventListener("change", this.onSystemChange);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.mq?.removeEventListener("change", this.onSystemChange);
  }

  private onSystemChange = (): void => {
    if (this.mode === "system") applyLoomiTheme("system");
  };

  private select(mode: LoomiTheme): void {
    this.mode = mode;
    applyLoomiTheme(mode);
    this.dispatchEvent(new CustomEvent("theme-change", { bubbles: true, composed: true, detail: { theme: mode } }));
  }

  private options(): Array<{ mode: LoomiTheme; text: string; icon: string }> {
    return [
      { mode: "light", text: loomiDefaultText(this.lightText, DEFAULT_LIGHT_TEXT, "themeSwitcher.light", this.locale), icon: this.lightIcon },
      { mode: "dark", text: loomiDefaultText(this.darkText, DEFAULT_DARK_TEXT, "themeSwitcher.dark", this.locale), icon: this.darkIcon },
      { mode: "system", text: loomiDefaultText(this.systemText, DEFAULT_SYSTEM_TEXT, "themeSwitcher.system", this.locale), icon: this.systemIcon },
    ];
  }

  private icon(iconName: string): TemplateResult | typeof nothing {
    const path = getLoomiIcon(iconName);
    return path
      ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>`
      : nothing;
  }

  private opt(mode: LoomiTheme, text: string, iconName: string): TemplateResult {
    return html`<button
      class="loomi-opt ${this.iconRight ? "icon-right" : ""} ${this.mode === mode ? "active" : ""}"
      aria-pressed=${this.mode === mode ? "true" : "false"}
      @click=${() => this.select(mode)}
    >
      ${this.icon(iconName)}
      <span class=${this.showLabels ? "" : "loomi-sr-only"}>${text}</span>
    </button>`;
  }

  private renderHorizontal(): TemplateResult {
    return html`<div class="loomi-switch" role="group" aria-label=${loomiT("themeSwitcher.theme", {}, this.locale)}>
      ${this.options().map(({ mode, text, icon }) => this.opt(mode, text, icon))}
    </div>`;
  }

  private renderDropmenu(): TemplateResult {
    const selected = this.options().find(({ mode }) => mode === this.mode) ?? this.options()[2];
    const checkPath = getLoomiIcon("check");

    return html`<loomi-dropmenu class="loomi-theme-menu" position="right">
      <span slot="trigger" class="loomi-menu-trigger">
        <loomi-icon class="loomi-menu-selected-icon" name=${selected.icon} size="1.05rem"></loomi-icon>
        <span class="loomi-sr-only">${loomiT("themeSwitcher.selectedTheme", { theme: selected.text }, this.locale)}</span>
        <loomi-icon class="loomi-menu-chevron" name="chevron-down" size="1rem"></loomi-icon>
      </span>
      ${this.options().map(
        ({ mode, text, icon }) => html`<loomi-dropmenu-item
          icon=${icon}
          class=${this.mode === mode ? "selected" : ""}
          aria-current=${this.mode === mode ? "true" : "false"}
          @click=${() => this.select(mode)}
        >
          <span class="loomi-menu-item-text">${text}</span>
          ${this.mode === mode && checkPath
            ? html`<svg
                class="loomi-menu-check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                ${checkPath}
              </svg>`
            : nothing}
        </loomi-dropmenu-item>`,
      )}
    </loomi-dropmenu>`;
  }

  override render(): TemplateResult {
    return this.variant === "dropmenu" ? this.renderDropmenu() : this.renderHorizontal();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-theme-switcher": LoomiThemeSwitcher;
  }
}
