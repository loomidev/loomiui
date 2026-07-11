import { html, svg, type SVGTemplateResult, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, cssColor, isLoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

const VIEWBOX_WIDTH = 220;
const VIEWBOX_HEIGHT = 132;
const CENTER_X = 110;
const CENTER_Y = 116;
const RADIUS = 96;
const TRACK_WIDTH = 11;
const MARKER_RADIUS = 11;
const MARKER_STROKE = 7;
const DEFAULT_MARKER_COLOR = "error";

interface ArcPoint {
  x: number;
  y: number;
}

function formatNumber(value: number, digits = 2): string {
  return Number(value.toFixed(digits)).toString();
}

function pointOnArc(ratio: number): ArcPoint {
  const angle = Math.PI * (1 - ratio);
  return {
    x: CENTER_X + RADIUS * Math.cos(angle),
    y: CENTER_Y - RADIUS * Math.sin(angle),
  };
}

function arcPath(startRatio: number, endRatio: number): string {
  const start = pointOnArc(startRatio);
  const end = pointOnArc(endRatio);
  const largeArc = endRatio - startRatio > 0.5 ? 1 : 0;

  return [
    `M ${formatNumber(start.x)} ${formatNumber(start.y)}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${formatNumber(end.x)} ${formatNumber(end.y)}`,
  ].join(" ");
}

/**
 * `<loomi-arc-meter>` — a semi-circle meter with evenly spaced marker stops.
 */
@customElement("loomi-arc-meter")
export class LoomiArcMeter extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) markers = 4;
  @property({ type: Number, attribute: "active-marker" }) activeMarker = 1;
  @property({ attribute: "marker-color" }) markerColor = DEFAULT_MARKER_COLOR;
  @property() title = "Low";
  @property() description = "Protection level";

  private get markerCount(): number {
    return Math.max(1, Math.floor(Number.isFinite(this.markers) ? this.markers : 1));
  }

  private get selectedMarker(): number {
    const active = Math.floor(Number.isFinite(this.activeMarker) ? this.activeMarker : 1);
    return Math.min(this.markerCount, Math.max(1, active));
  }

  private markerRatio(marker: number, count = this.markerCount): number {
    return marker / (count + 1);
  }

  private get resolvedMarkerColor(): string {
    const rawColor = String(this.markerColor || DEFAULT_MARKER_COLOR).trim() || DEFAULT_MARKER_COLOR;
    const color = rawColor === "yellow" ? "warning" : rawColor;
    return isLoomiColor(color) ? cssColor(color, 600) : color;
  }

  private get ariaText(): string {
    const title = this.title || "Arc meter";
    const description = this.description ? `${this.description}. ` : "";
    return `${title}. ${description}Marker ${this.selectedMarker} of ${this.markerCount}.`;
  }

  private renderTrackSegments(count: number): SVGTemplateResult[] {
    const segmentCount = count + 1;
    const gap = Math.min(0.025, 0.3 / segmentCount);
    const segments: SVGTemplateResult[] = [];

    for (let index = 0; index < segmentCount; index += 1) {
      const start = index / segmentCount + (index === 0 ? 0 : gap);
      const end = (index + 1) / segmentCount - (index === segmentCount - 1 ? 0 : gap);
      if (end <= start) continue;
      segments.push(svg`<path class="loomi-track-segment" d=${arcPath(start, end)}></path>`);
    }

    return segments;
  }

  override render(): TemplateResult {
    const markerCount = this.markerCount;
    const activeMarker = this.selectedMarker;
    const activeRatio = this.markerRatio(activeMarker, markerCount);
    const activePoint = pointOnArc(activeRatio);
    const activeColor = this.resolvedMarkerColor;
    const fillEnd = Math.max(0.01, activeRatio - 0.026);

    return html`<div
      class="loomi-arc-meter"
      role="img"
      aria-label=${this.ariaText}
      data-markers=${markerCount}
      data-active-marker=${activeMarker}
      style="--loomi-marker-color:${activeColor}"
    >
      <div class="loomi-arc-visual">
        <svg viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}" aria-hidden="true" focusable="false">
          <g class="loomi-track">${this.renderTrackSegments(markerCount)}</g>
          <path
            class="loomi-fill"
            d=${arcPath(0, fillEnd)}
            stroke-width=${TRACK_WIDTH}
          ></path>
          <g
            class="loomi-marker"
            data-active-marker=${activeMarker}
            data-marker-count=${markerCount}
            data-ratio=${formatNumber(activeRatio, 3)}
          >
            <circle
              class="loomi-marker-ring"
              cx=${formatNumber(activePoint.x)}
              cy=${formatNumber(activePoint.y)}
              r=${MARKER_RADIUS}
              stroke-width=${MARKER_STROKE}
            ></circle>
          </g>
        </svg>
        <div class="loomi-copy">
          <div class="loomi-title">${this.title}</div>
          <div class="loomi-description">${this.description}</div>
        </div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-arc-meter": LoomiArcMeter;
  }
}
