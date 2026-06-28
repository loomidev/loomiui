import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiProcessingState = "processing" | "success" | "failed";

const CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />`;
const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />`;

/**
 * `<loomi-processing>` — a process indicator with `processing` (spinner), `success` and
 * `failed` states. Switch the `state` attribute (and optionally `title`/`message`) as your
 * async task progresses.
 */
@customElement("loomi-processing")
export class LoomiProcessing extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() state: LoomiProcessingState = "processing";
  @property() title = "";
  @property() message = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() locale = "";

  override render(): TemplateResult {
    let icon: TemplateResult;
    if (this.state === "success") {
      icon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${CHECK}</svg>`;
    } else if (this.state === "failed") {
      icon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${X}</svg>`;
    } else {
      icon = html`<svg class="loomi-spin" viewBox="0 0 24 24" fill="none" aria-label=${loomiT("processing.processing", {}, this.locale)}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3"></circle>
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
      </svg>`;
    }
    return html`<div class="loomi-proc state-${this.state}" style=${accentVars(this.color)}>
      <div class="loomi-icon">${icon}</div>
      ${this.title ? html`<div class="loomi-title">${this.title}</div>` : nothing}
      ${this.message ? html`<div class="loomi-message">${this.message}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-processing": LoomiProcessing;
  }
}
