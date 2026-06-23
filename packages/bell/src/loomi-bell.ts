import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiBellSize = "small" | "big";

const BELL = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />`;

/**
 * `<loomi-bell>` — a notification bell with an optional (optionally animated) status dot.
 */
@customElement("loomi-bell")
export class LoomiBell extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() size: LoomiBellSize = "small";
  @property({ type: Boolean, attribute: "show-dot" }) showDot = true;
  @property({ type: Boolean, attribute: "animate-dot" }) animateDot = false;
  @property({ type: Boolean }) invert = false;

  override render(): TemplateResult {
    return html`<span class="loomi-bell size-${this.size} ${this.invert ? "invert" : ""}" style=${accentVars(this.color)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${BELL}</svg>
      ${this.showDot
        ? html`${this.animateDot ? html`<span class="loomi-ping"></span>` : nothing}<span class="loomi-dot"></span>`
        : nothing}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-bell": LoomiBell;
  }
}
