import { html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomi/core";
import { getLoomiIcon, type LoomiIconVariant } from "@loomi/icons";
import { componentStyles } from "./generated/styles.css.js";

/**
 * `<loomi-icon>` — renders an icon from the shared `@loomi/icons` registry by `name`,
 * a file from a custom directory, or any custom SVG placed in the default slot. Registry
 * icons follow `currentColor`; file icons render as images. Size is controlled with the
 * `size` attribute or the `--loomi-icon-size` custom property.
 *
 * @slot - Custom inline `<svg>` (overrides `name`).
 */
@customElement("loomi-icon")
export class LoomiIcon extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Registered icon name (see `@loomi/icons`). */
  @property() name = "";
  /** Heroicons style variant. */
  @property() variant: LoomiIconVariant = "outline";
  /** Directory for file-based icons. `name` becomes the file name. */
  @property() directory = "";
  /** Stroke width for registry icons. */
  @property({ attribute: "stroke-width" }) strokeWidth = "1.5";
  /** CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`. */
  @property() size = "";
  /** Accessible label; when omitted the icon is `aria-hidden`. */
  @property() label = "";

  private get fileIconUrl(): string {
    if (!this.directory || !this.name) return "";
    const cleanDirectory = this.directory.replace(/\/+$/, "");
    const fileName = /\.[a-z0-9]+$/i.test(this.name) ? this.name : `${this.name}.svg`;
    return `${cleanDirectory}/${encodeURIComponent(fileName)}`;
  }

  override render(): TemplateResult {
    if (this.size) this.style.setProperty("--loomi-icon-size", this.size);
    const variant = this.variant === "solid" ? "solid" : "outline";
    const labelled = !!this.label;
    const role = labelled ? "img" : nothing;
    const ariaLabel = labelled ? this.label : nothing;
    const ariaHidden = labelled ? nothing : "true";
    const fileIconUrl = this.fileIconUrl;
    if (fileIconUrl) {
      return html`<img
        src=${fileIconUrl}
        alt=${labelled ? this.label : ""}
        role=${role}
        aria-label=${ariaLabel}
        aria-hidden=${ariaHidden}
      />`;
    }

    const path = this.name ? getLoomiIcon(this.name, variant) : undefined;
    if (!path) {
      // No registry match — render whatever SVG is slotted.
      return html`<slot role=${role} aria-label=${ariaLabel} aria-hidden=${ariaHidden}></slot>`;
    }
    return html`<svg
      viewBox="0 0 24 24"
      fill=${variant === "solid" ? "currentColor" : "none"}
      stroke=${variant === "solid" ? "none" : "currentColor"}
      stroke-width=${variant === "solid" ? nothing : this.strokeWidth}
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
