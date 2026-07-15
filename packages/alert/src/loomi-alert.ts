import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import { getLoomiIcon } from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiAlertType = "" | "info" | "error" | "warning" | "success";

const TYPE_COLOR: Record<LoomiAlertType, LoomiColor> = {
  "": "primary" as LoomiColor,
  info: "info" as LoomiColor,
  error: "error" as LoomiColor,
  warning: "warning" as LoomiColor,
  success: "success" as LoomiColor,
};
const TYPE_ICON: Record<LoomiAlertType, string> = {
  "": "",
  info: "information-circle",
  error: "x-circle",
  warning: "exclamation-triangle",
  success: "check-circle",
};
const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/**
 * `<loomi-alert>` — an inline alert message. The untyped default uses the primary
 * palette without a leading icon; four explicit types provide semantic colors and
 * icons. Supports `faint`/`dark` shades, palette overrides, an optional avatar and a
 * dismiss button.
 *
 * @slot - The alert message (may contain HTML/links).
 * @fires close - Fired when dismissed (the alert hides itself unless prevented).
 */
@customElement("loomi-alert")
export class LoomiAlert extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() type: LoomiAlertType = "";
  @property() shade: "faint" | "dark" = "faint";
  @property() color: LoomiColor | "transparent" | "" = "";
  @property({ type: Boolean, attribute: "show-icon", converter: booleanAttribute }) showIcon = true;
  @property({ type: Boolean, attribute: "show-close-icon", converter: booleanAttribute })
  showCloseIcon = true;
  @property() icon = "";
  @property() avatar = "";
  @property() locale = "";
  @property({ type: Boolean, attribute: "show-ring" }) showRing = false;

  @state() private dismissed = false;

  private onClose = (): void => {
    const ev = new CustomEvent("close", { bubbles: true, composed: true, cancelable: true });
    if (this.dispatchEvent(ev)) this.dismissed = true;
  };

  private renderIcon(name: string): TemplateResult | typeof nothing {
    const path = getLoomiIcon(name);
    if (!path) return nothing;
    return html`<svg class="loomi-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${path}</svg>`;
  }

  override render(): TemplateResult | typeof nothing {
    if (this.dismissed) return nothing;
    const transparent = this.color === "transparent";
    const color = (this.color && !transparent ? this.color : TYPE_COLOR[this.type]) as LoomiColor;
    const iconName = this.icon || (this.color ? "" : TYPE_ICON[this.type]);
    const cls = `loomi-alert ${this.shade} ${transparent ? "transparent" : ""}`;
    return html`<div class=${cls} role="alert" style=${accentVars(color)}>
      ${
        this.avatar
          ? html`<img class="loomi-avatar ${this.showRing ? "ring" : ""}" src=${this.avatar} alt="" />`
          : this.showIcon && iconName
            ? this.renderIcon(iconName)
            : nothing
      }
      <div class="loomi-body"><slot></slot></div>
      ${
        this.showCloseIcon
          ? html`<button type="button" class="loomi-close" aria-label=${loomiT("common.dismiss", {}, this.locale)} @click=${this.onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${X}</svg>
          </button>`
          : nothing
      }
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-alert": LoomiAlert;
  }
}
