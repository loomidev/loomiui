import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";
import { generateQrCode, type LoomiQrErrorCorrection } from "./qrcode-generator.js";

export type LoomiQrRadius = "none" | "small" | "medium" | "large" | "full";
export type { LoomiQrErrorCorrection };

let nextGradientId = 0;

const RADIUS_CLASS: Record<LoomiQrRadius, string> = {
  none: "radius-none",
  small: "radius-small",
  medium: "radius-medium",
  large: "radius-large",
  full: "radius-full",
};

/**
 * `<loomi-qrcode>` — a themeable QR code for URLs and short text values.
 */
@customElement("loomi-qrcode")
export class LoomiQrCode extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() url = "";
  @property() value = "";
  @property({ type: Number }) size = 220;
  /**
   * QR error correction level, trading data density for resilience to damage or overlays:
   * - `L` (Low): recovers ~7% of the code. Highest data capacity, use for clean digital display.
   * - `M` (Medium): recovers ~15% of the code. Balanced default for most use cases.
   * - `Q` (Quartile): recovers ~25% of the code. Good when printing on materials that may wear or get dirty.
   * - `H` (High): recovers ~30% of the code. Most resilient; recommended when overlaying a logo or using
   *   visual effects (`corner-borders`, `gradient`) on top of the modules.
   */
  @property({ attribute: "error-correction" }) errorCorrection: LoomiQrErrorCorrection = "M";
  @property({ type: Number, attribute: "quiet-zone" }) quietZone = 4;
  @property() foreground = "var(--loomi-text)";
  @property() background = "var(--loomi-surface)";
  @property() radius: LoomiQrRadius = "medium";
  @property({ type: Boolean }) gradient = false;
  @property({ attribute: "gradient-from" }) gradientFrom = "var(--loomi-primary-600)";
  @property({ attribute: "gradient-to" }) gradientTo = "var(--loomi-cyan-500)";
  @property({ type: Number, attribute: "module-radius" }) moduleRadius = 0;
  @property({ type: Boolean, attribute: "corner-borders" }) cornerBorders = false;
  @property({ attribute: "corner-border-color" }) cornerBorderColor = "var(--loomi-primary-600)";
  @property({ attribute: "corner-border-width" }) cornerBorderWidth = "4px";
  @property({ attribute: "corner-border-length" }) cornerBorderLength = "34px";
  @property({ type: Boolean, attribute: "gradient-scan" }) gradientScan = false;
  @property({ attribute: "scan-color" }) scanColor = "rgba(14, 165, 233, 0.72)";
  @property({ attribute: "scan-duration" }) scanDuration = "2.4s";
  /**
   * Number of times the scan beam sweeps down and back up. Accepts a positive integer, or
   * `"infinite"` (default) to loop forever.
   */
  @property({ attribute: "scan-count" }) scanCount: number | "infinite" = "infinite";
  @property({ attribute: "aria-label" }) accessibilityLabel = "";

  private readonly gradientId = `loomi-qrcode-gradient-${++nextGradientId}`;

  private get textValue(): string {
    return this.url || this.value;
  }

  private get normalizedErrorCorrection(): LoomiQrErrorCorrection {
    return this.errorCorrection === "L" || this.errorCorrection === "Q" || this.errorCorrection === "H"
      ? this.errorCorrection
      : "M";
  }

  private get normalizedRadius(): LoomiQrRadius {
    return this.radius in RADIUS_CLASS ? this.radius : "medium";
  }

  private get normalizedScanCount(): string {
    if (this.scanCount === "infinite") return "infinite";
    const parsed = Number(this.scanCount);
    return Number.isFinite(parsed) && parsed > 0 ? String(Math.floor(parsed)) : "infinite";
  }

  private get wrapperStyle(): string {
    return [
      `--_loomi-qrcode-size:${Math.max(96, this.size)}px`,
      `--_loomi-qrcode-background:${this.background}`,
      `--_loomi-qrcode-corner-color:${this.cornerBorderColor}`,
      `--_loomi-qrcode-corner-width:${this.cornerBorderWidth}`,
      `--_loomi-qrcode-corner-length:${this.cornerBorderLength}`,
      `--_loomi-qrcode-scan-color:${this.scanColor}`,
      `--_loomi-qrcode-scan-duration:${this.scanDuration}`,
      `--_loomi-qrcode-scan-count:${this.normalizedScanCount}`,
    ].join(";");
  }

  override render(): TemplateResult {
    const value = this.textValue.trim();
    const radiusClass = RADIUS_CLASS[this.normalizedRadius];

    if (!value) {
      return html`<div class="loomi-qrcode ${radiusClass} empty" style=${this.wrapperStyle} role="img" aria-label="QR code">
        <span class="loomi-empty-mark" aria-hidden="true"></span>
      </div>`;
    }

    try {
      const qr = generateQrCode(value, this.normalizedErrorCorrection);
      const quietZone = Math.max(0, Math.floor(this.quietZone));
      const viewBoxSize = qr.size + quietZone * 2;
      const moduleFill = this.gradient ? `url(#${this.gradientId})` : this.foreground;
      const label = this.accessibilityLabel || `QR code for ${value}`;

      return html`<div
        class="loomi-qrcode ${radiusClass} ${this.cornerBorders ? "with-corners" : ""}"
        style=${this.wrapperStyle}
      >
        <svg
          class="loomi-qrcode-svg"
          viewBox=${`0 0 ${viewBoxSize} ${viewBoxSize}`}
          role="img"
          aria-label=${label}
          shape-rendering=${this.moduleRadius > 0 ? "geometricPrecision" : "crispEdges"}
        >
          <rect class="loomi-qrcode-bg" width=${viewBoxSize} height=${viewBoxSize} fill=${this.background}></rect>
          ${this.renderGradient()}
          ${this.renderModules(qr.modules, quietZone, moduleFill)}
        </svg>
        ${this.cornerBorders ? this.renderCorners() : nothing}
        ${this.gradientScan ? html`<span class="loomi-scan" aria-hidden="true"></span>` : nothing}
      </div>`;
    } catch {
      return html`<div
        class="loomi-qrcode ${radiusClass} error"
        style=${this.wrapperStyle}
        role="img"
        aria-label="QR code unavailable"
      >
        <span>Unable to encode QR code</span>
      </div>`;
    }
  }

  private renderGradient(): TemplateResult | typeof nothing {
    if (!this.gradient) return nothing;
    return svg`<defs>
      <linearGradient id=${this.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color=${this.gradientFrom}></stop>
        <stop offset="100%" stop-color=${this.gradientTo}></stop>
      </linearGradient>
    </defs>`;
  }

  private renderModules(modules: boolean[][], quietZone: number, fill: string): TemplateResult {
    if (this.moduleRadius <= 0) {
      const path = modules
        .map((row, y) => row
          .map((dark, x) => dark ? `M${x + quietZone},${y + quietZone}h1v1h-1z` : "")
          .join(""))
        .join("");
      return svg`<path class="loomi-qrcode-modules" fill=${fill} d=${path}></path>`;
    }

    const radius = Math.max(0, Math.min(0.5, this.moduleRadius));
    return svg`<g class="loomi-qrcode-modules" fill=${fill}>
      ${modules.map((row, y) => row.map((dark, x) => dark
        ? svg`<rect
            x=${x + quietZone}
            y=${y + quietZone}
            width="1"
            height="1"
            rx=${radius}
            ry=${radius}
          ></rect>`
        : nothing))}
    </g>`;
  }

  private renderCorners(): TemplateResult {
    return html`
      <span class="loomi-corner top-left" aria-hidden="true"></span>
      <span class="loomi-corner top-right" aria-hidden="true"></span>
      <span class="loomi-corner bottom-left" aria-hidden="true"></span>
      <span class="loomi-corner bottom-right" aria-hidden="true"></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-qrcode": LoomiQrCode;
  }
}
