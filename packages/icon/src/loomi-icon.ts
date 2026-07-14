import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars } from "@loomidev/core";
import {
  getLoomiIcon,
  getLoomiDiskIconUrl,
  loadLoomiDiskIcon,
  isLoomiDiskIconSource,
  type LoomiIconSource,
  type LoomiIconType,
} from "@loomidev/icons";
import { componentStyles } from "./generated/styles.css.js";

type DiskIconMarkup = Awaited<ReturnType<typeof loadLoomiDiskIcon>>;

/** Corner radius of the `branded` background badge. */
export type LoomiIconRadius = "none" | "small" | "medium" | "full";

const RADIUS: Record<LoomiIconRadius, string> = {
  none: "rounded-none",
  small: "rounded",
  medium: "rounded-lg",
  full: "rounded-full",
};

/**
 * `<loomi-icon>` — renders an icon from the shared `@loomidev/icons` registry by `name`,
 * a file from a custom directory, or any custom SVG placed in the default slot.
 *
 * `source` picks the icon set. `heroicons` (default) is inlined at build time. `iconsax`
 * and `untitledui` are disk-based: their real `.svg` files ship inside `@loomidev/icons`
 * and are fetched (and cached in memory) the first time each one is used, instead of
 * bloating every consumer's bundle with every icon in the set. All registry icons follow
 * `currentColor`; file icons (via `directory`) render as images instead. Size is
 * controlled with the `size` attribute or the `--loomi-icon-size` custom property.
 *
 * Set `branded` to sit the icon on a rounded, primary-colored background badge instead
 * of rendering it bare — `shade` picks a light tint or a solid fill, `radius` picks the
 * corner rounding.
 *
 * @slot - Custom inline `<svg>` (overrides `name`).
 */
@customElement("loomi-icon")
export class LoomiIcon extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Registered icon name (see `@loomidev/icons`). */
  @property() name = "";
  /** Icon set to render from. */
  @property() source: LoomiIconSource = "heroicons";
  /** Visual style. Availability depends on `source` — see the README's attribute table. */
  @property() variant: LoomiIconType = "outline";
  /** Directory for file-based icons. `name` becomes the file name. */
  @property() directory = "";
  /** Stroke width. Heroicons outline only — the other sets ship a fixed weight. */
  @property({ attribute: "stroke-width" }) strokeWidth = "1.5";
  /** CSS size, e.g. `1.5rem`, `32px`. Sets `--loomi-icon-size`. */
  @property() size = "";
  /** Accessible label; when omitted the icon is `aria-hidden`. */
  @property() label = "";
  /** Render the icon on a rounded, primary-colored background badge. */
  @property({ type: Boolean, reflect: true }) branded = false;
  /** Badge background: a light primary tint, or a solid primary fill. Only applies when `branded`. */
  @property() shade: "light" | "dark" = "light";
  /** Badge corner radius. Only applies when `branded`. */
  @property({ reflect: true }) radius: LoomiIconRadius = "medium";

  @state() private _diskIcon?: DiskIconMarkup;
  private _diskRequest = "";

  private get fileIconUrl(): string {
    if (!this.directory || !this.name) return "";
    const cleanDirectory = this.directory.replace(/\/+$/, "");
    const fileName = /\.[a-z0-9]+$/i.test(this.name) ? this.name : `${this.name}.svg`;
    return `${cleanDirectory}/${encodeURIComponent(fileName)}`;
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (
      !changed.has("name") &&
      !changed.has("source") &&
      !changed.has("variant") &&
      !changed.has("directory")
    ) {
      return;
    }
    const source = this.source;
    if (this.directory || !isLoomiDiskIconSource(source) || !this.name) {
      this._diskRequest = "";
      return;
    }
    const requestKey = `${source}:${this.variant}:${this.name}`;
    if (requestKey === this._diskRequest) return;
    this._diskRequest = requestKey;
    loadLoomiDiskIcon(source, this.name, this.variant).then((markup) => {
      if (this._diskRequest !== requestKey) return; // superseded by a newer request
      this._diskIcon = markup;
    });
  }

  private renderContent(): TemplateResult {
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

    const source = this.source;
    if (isLoomiDiskIconSource(source)) {
      const known = this.name && getLoomiDiskIconUrl(source, this.name, this.variant);
      if (!known) {
        // Unregistered name for this source — render whatever SVG is slotted.
        return html`<slot role=${role} aria-label=${ariaLabel} aria-hidden=${ariaHidden}></slot>`;
      }
      // Sized placeholder until the fetch resolves, so there's no layout jump.
      return html`<svg viewBox="0 0 24 24" fill="none" role=${role} aria-label=${ariaLabel} aria-hidden=${ariaHidden}
        >${this._diskIcon ?? nothing}</svg
      >`;
    }

    const variant = this.variant === "solid" ? "solid" : "outline";
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

  override render(): TemplateResult {
    if (this.size) this.style.setProperty("--loomi-icon-size", this.size);
    const content = this.renderContent();
    if (!this.branded) return content;

    const cls = ["loomi-icon-badge", this.shade, RADIUS[this.radius] ?? RADIUS.medium].join(" ");
    return html`<span class=${cls} style=${accentVars("primary")}>${content}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-icon": LoomiIcon;
  }
}
