import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { loomiStyles } from "@loomi/core";
import { getLoomiIcon } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-icon>` — renders an icon from the shared `@loomi/icons` registry by `name`,
 * or any custom SVG placed in the default slot. Color follows `currentColor`; size is
 * controlled with the `size` attribute or the `--loomi-icon-size` custom property.
 *
 * @slot - Custom inline `<svg>` (overrides `name`).
 */
@customElement("loomi-icon")
export class LoomiIcon extends LitElement {
  static override styles = loomiStyles(componentStyles);

  /** Registered icon name (see `@loomi/icons`). */
  @property() name = "";
  /** Stroke width for registry icons. */
  @property({ attribute: "stroke-width" }) strokeWidth = "1.5";
  /** CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`. */
  @property() size = "";
  /** Accessible label; when omitted the icon is `aria-hidden`. */
  @property() label = "";

  override render(): TemplateResult {
    if (this.size) this.style.setProperty("--loomi-icon-size", this.size);
    const path = this.name ? getLoomiIcon(this.name) : undefined;
    const labelled = !!this.label;
    const role = labelled ? "img" : nothing;
    const ariaLabel = labelled ? this.label : nothing;
    const ariaHidden = labelled ? nothing : "true";
    if (!path) {
      // No registry match — render whatever SVG is slotted.
      return html`<slot role=${role} aria-label=${ariaLabel} aria-hidden=${ariaHidden}></slot>`;
    }
    return html`<svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width=${this.strokeWidth}
      role=${role}
      aria-label=${ariaLabel}
      aria-hidden=${ariaHidden}
    >
      ${path}
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-icon": LoomiIcon;
  }
}
