import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loomiStyles } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTheme = "light" | "dark" | "system";
const STORAGE_KEY = "loomi-theme";

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
export class LoomiThemeSwitcher extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property({ attribute: "light-text" }) lightText = "Light";
  @property({ attribute: "dark-text" }) darkText = "Dark";
  @property({ attribute: "system-text" }) systemText = "System";
  @property({ attribute: "light-icon" }) lightIcon = "sun";
  @property({ attribute: "dark-icon" }) darkIcon = "moon";
  @property({ attribute: "system-icon" }) systemIcon = "computer-desktop";
  @property({ type: Boolean, attribute: "icon-right" }) iconRight = false;

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

  private opt(mode: LoomiTheme, text: string, iconName: string): TemplateResult {
    const path = getLoomiIcon(iconName);
    return html`<button
      class="loomi-opt ${this.iconRight ? "icon-right" : ""} ${this.mode === mode ? "active" : ""}"
      aria-pressed=${this.mode === mode ? "true" : "false"}
      @click=${() => this.select(mode)}
    >
      ${path ? html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>` : nothing}
      <span>${text}</span>
    </button>`;
  }

  override render(): TemplateResult {
    return html`<div class="loomi-switch" role="group" aria-label="Theme">
      ${this.opt("light", this.lightText, this.lightIcon)}
      ${this.opt("dark", this.darkText, this.darkIcon)}
      ${this.opt("system", this.systemText, this.systemIcon)}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-theme-switcher": LoomiThemeSwitcher;
  }
}
