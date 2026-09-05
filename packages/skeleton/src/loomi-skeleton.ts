import { html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, loomiT } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiSkeletonVariant = "text" | "circle" | "rect";
export type LoomiSkeletonAnimation = "shimmer" | "pulse" | "none";

/**
 * `<loomi-skeleton>` — a placeholder shape shown in place of content that hasn't
 * loaded yet. Pick a `variant` for the shape, or set `lines` (with the default
 * `variant="text"`) for a paragraph of placeholder lines whose last line runs
 * shorter, the common "still loading" text pattern. Compose several instances
 * (e.g. a `circle` next to two `text` lines) for a list-item or card placeholder;
 * there's no built-in composite shape.
 */
@customElement("loomi-skeleton")
export class LoomiSkeleton extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() variant: LoomiSkeletonVariant = "text";
  @property() width = "";
  @property() height = "";
  @property() radius = "";
  @property({ type: Number }) lines = 1;
  @property() animation: LoomiSkeletonAnimation = "shimmer";
  /** Accessible name announced while the placeholder is visible. Falls back to a translated "Loading". */
  @property() label = "";
  @property() locale = "";

  private get accessibleName(): string {
    return this.label || loomiT("common.loading", {}, this.locale);
  }

  private get defaultWidth(): string {
    return this.variant === "circle" ? "3rem" : "100%";
  }

  private get defaultRadius(): string {
    if (this.variant === "circle") return "9999px";
    if (this.variant === "text") return "0.25rem";
    return "var(--loomi-control-radius, var(--_loomi-control-radius-default, 0.5rem))";
  }

  private barStyle(widthOverride?: string): string {
    const width = widthOverride ?? this.width ?? "";
    const w = width || this.defaultWidth;
    const h = this.height || (this.variant === "circle" ? w : this.variant === "text" ? "1em" : "8rem");
    const r = this.radius || this.defaultRadius;
    return `width:${w};height:${h};border-radius:${r}`;
  }

  override render(): TemplateResult {
    const animClass = this.animation === "none" ? "" : this.animation;

    if (this.variant === "text" && this.lines > 1) {
      const count = Math.max(1, Math.round(this.lines));
      const bars = Array.from({ length: count }, (_, index) => index === count - 1);
      return html`<div class="loomi-skeleton-lines" role="status" aria-label=${this.accessibleName}>
        ${bars.map(
          (isLast) =>
            html`<span
              class="loomi-skeleton ${animClass}"
              style=${this.barStyle(isLast ? "60%" : undefined)}
            ></span>`,
        )}
      </div>`;
    }

    return html`<span
      class="loomi-skeleton ${animClass}"
      role="status"
      aria-label=${this.accessibleName}
      style=${this.barStyle()}
    ></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-skeleton": LoomiSkeleton;
  }
}
