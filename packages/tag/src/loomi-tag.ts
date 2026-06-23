import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles, accentVars, type LoomiColor } from "@loomi/core";
import { componentStyles } from "./generated/styles.css.js";

const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;

/**
 * `<loomi-tag>` — a themeable label/badge. Faint or dark shade, optional outline,
 * rounded, tiny, and a close button.
 *
 * @slot - Tag content (falls back to the `label` attribute).
 * @fires close - Fired when the close button is clicked (the tag removes itself unless prevented).
 */
@customElement("loomi-tag")
export class LoomiTag extends LitElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property({ type: Boolean, attribute: "can-close" }) canClose = false;
  @property({ type: Boolean }) outline = false;
  @property({ type: Boolean }) rounded = false;
  @property({ type: Boolean }) tiny = false;
  @property({ type: Boolean }) uppercasing = false;

  private onClose = (): void => {
    const ev = new CustomEvent("close", { bubbles: true, composed: true, cancelable: true });
    const proceed = this.dispatchEvent(ev);
    if (proceed) this.remove();
  };

  override render(): TemplateResult {
    const cls = [
      "loomi-tag",
      this.outline ? "outline" : "",
      this.shade,
      this.rounded ? "rounded" : "",
      this.tiny ? "tiny" : "",
      this.uppercasing ? "uppercasing" : "",
    ].join(" ");
    return html`<span class=${cls} style=${accentVars(this.color)}>
      <slot>${this.label}</slot>
      ${this.canClose
        ? html`<button type="button" class="loomi-close" aria-label="Remove" @click=${this.onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">${X}</svg>
          </button>`
        : nothing}
    </span>`;
  }
}

/**
 * `<loomi-tags>` — a simple flex container for laying out multiple `<loomi-tag>`.
 *
 * @slot - `<loomi-tag>` children.
 */
@customElement("loomi-tags")
export class LoomiTags extends LitElement {
  static override styles = loomiStyles(componentStyles);

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-group", "");
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-tag": LoomiTag;
    "loomi-tags": LoomiTags;
  }
}
