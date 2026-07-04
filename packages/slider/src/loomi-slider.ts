import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

const ENTRANCE_DURATION_MS = 600;

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false" && value !== "0";
  },
};

// Registering these as <percentage> custom properties (rather than the untyped default)
// is what makes the browser interpolate them smoothly for the entrance transition below,
// instead of snapping straight to the new value. This has to go through the
// CSS.registerProperty() JS API rather than an `@property` rule in the component's own
// stylesheet - at least in some engines, `@property` declared inside a shadow root's
// adopted stylesheet is parsed fine but silently ignored for animation purposes.
if (typeof CSS !== "undefined" && typeof CSS.registerProperty === "function") {
  for (const name of ["--loomi-range-start", "--loomi-range-end"]) {
    try {
      CSS.registerProperty({ name, syntax: "<percentage>", inherits: true, initialValue: "0%" });
    } catch {
      // Already registered (e.g. hot reload, or another instance's module got here first).
    }
  }
}

/**
 * `<loomi-slider>` — select a numeric value or numeric range with a slider.
 * Form-associated: submits the value under `name`.
 *
 * @fires input - As the value changes (composed).
 * @fires change - On commit (composed).
 */
@customElement("loomi-slider")
export class LoomiSlider extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;
  private internals = this.attachInternals();

  @property({ reflect: true }) name = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) selected = 0;
  @property({ type: Number, attribute: "selected-end" }) selectedEnd = 100;
  @property({ type: Boolean, reflect: true }) range = false;
  @property({ type: Boolean, reflect: true }) vertical = false;
  @property() marks: string | number[] = "";
  @property({ attribute: "handle-width" }) handleWidth = "";
  @property({ attribute: "track-radius" }) trackRadius = "999px";
  @property({ attribute: "handle-variant" }) handleVariant: "default" | "square" | "line" = "default";
  @property({ attribute: "value-target" }) valueTarget = "";
  @property({ type: Boolean, attribute: "show-tooltip", converter: booleanAttribute })
  showTooltip = true;
  @property({ type: Boolean, attribute: "show-values", converter: booleanAttribute })
  showValues = true;

  /** False until just after first paint, so the track can render empty for one frame
   * and then fill in to the starting value as an entrance animation. */
  @state() private revealed = false;
  /** True only while the entrance animation should be transitioning, so later drag
   * interactions apply instantly instead of lagging behind a transition. */
  @state() private animatingEntrance = true;

  override willUpdate(): void {
    this.internals.setFormValue(this.value);
  }

  override firstUpdated(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.revealed = true;
        setTimeout(() => {
          this.animatingEntrance = false;
        }, ENTRANCE_DURATION_MS);
      });
    });
  }

  get value(): string {
    if (!this.range) return String(this.startValue);
    return `${this.startValue} - ${this.endValue}`;
  }

  private get lowerBound(): number {
    return Math.min(this.min, this.max);
  }

  private get upperBound(): number {
    return Math.max(this.min, this.max);
  }

  private clamp(value: number): number {
    return Math.min(this.upperBound, Math.max(this.lowerBound, value));
  }

  private get selectedValue(): number {
    return this.clamp(this.selected);
  }

  private get selectedEndValue(): number {
    return this.clamp(this.selectedEnd);
  }

  private get startValue(): number {
    return this.range ? Math.min(this.selectedValue, this.selectedEndValue) : this.selectedValue;
  }

  private get endValue(): number {
    return Math.max(this.selectedValue, this.selectedEndValue);
  }

  private get progressStyle(): string {
    const start = this.range ? this.startValue : this.lowerBound;
    const end = this.range ? this.endValue : this.startValue;
    const startPercent = this.revealed ? this.valuePercent(start) : 0;
    const endPercent = this.revealed ? this.valuePercent(end) : 0;

    const handleWidth = this.handleWidth ? ` --loomi-slider-thumb-width: ${this.handleWidth};` : "";
    return `${accentVars(this.color)} --loomi-range-start: ${startPercent}%; --loomi-range-end: ${endPercent}%; --loomi-slider-radius: ${this.trackRadius};${handleWidth}`;
  }

  private valuePercent(value: number): number {
    const span = this.upperBound - this.lowerBound;
    return span ? ((value - this.lowerBound) / span) * 100 : 0;
  }

  private tooltipStyle(value: number): string {
    const percent = this.valuePercent(value);
    const translate = percent <= 0 ? "0%" : percent >= 100 ? "-100%" : "-50%";
    const arrowPosition =
      percent <= 0 ? "0.65rem" : percent >= 100 ? "calc(100% - 0.65rem)" : "50%";

    return [
      `--loomi-value-position: ${percent}%`,
      `--loomi-value-translate: ${translate}`,
      `--loomi-value-arrow-position: ${arrowPosition}`,
    ].join("; ");
  }

  private onInput(handle: "start" | "end", e: Event): void {
    const next = Number((e.target as HTMLInputElement).value);

    if (handle === "start") {
      this.selected = next;
      if (this.range && next > this.selectedEnd) this.selectedEnd = next;
    } else {
      this.selectedEnd = next;
      if (next < this.selected) this.selected = next;
    }

    this.syncValueTarget();
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  }

  private onChange(): void {
    this.syncValueTarget();
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  private syncValueTarget(): void {
    if (!this.valueTarget) return;
    const target = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLOutputElement>(this.valueTarget);
    if (!target) return;
    target.value = this.value;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }

  private parsedMarks(): number[] {
    const raw = Array.isArray(this.marks)
      ? this.marks
      : String(this.marks)
          .split(",")
          .map((mark) => mark.trim())
          .filter(Boolean);
    return raw
      .map((mark) => Number(mark))
      .filter((mark) => Number.isFinite(mark))
      .map((mark) => this.clamp(mark));
  }

  private renderMarks(): TemplateResult | typeof nothing {
    const marks = this.parsedMarks();
    if (marks.length === 0) return nothing;
    return html`<div class="loomi-marks" aria-hidden="true">
      ${marks.map(
        (mark) => html`<span class="loomi-mark" style=${this.markStyle(mark)}>
          <span class="loomi-mark-label">${mark}</span>
        </span>`
      )}
    </div>`;
  }

  private markStyle(value: number): string {
    return this.vertical
      ? `bottom: ${this.valuePercent(value)}%`
      : `inset-inline-start: ${this.valuePercent(value)}%`;
  }

  override render(): TemplateResult {
    return html`<div class="loomi-slider ${this.vertical ? "vertical" : "horizontal"}" style=${this.progressStyle}>
      <div class="loomi-control ${this.range ? "loomi-control-range" : ""} handle-${this.handleVariant}">
        <span class="loomi-track ${this.animatingEntrance ? "entering" : ""}" aria-hidden="true"></span>
        ${this.renderMarks()}
        <input
          class="loomi-range ${this.range ? "loomi-range-start" : ""}"
          type="range"
          name=${this.name || nothing}
          min=${this.lowerBound}
          max=${this.upperBound}
          step=${this.step}
          aria-label=${this.range ? "Minimum value" : "Value"}
          .value=${String(this.startValue)}
          @input=${(event: Event) => this.onInput("start", event)}
          @change=${this.onChange}
        />
        ${this.range
          ? html`<input
              class="loomi-range loomi-range-end"
              type="range"
              min=${this.lowerBound}
              max=${this.upperBound}
              step=${this.step}
              aria-label="Maximum value"
              .value=${String(this.endValue)}
              @input=${(event: Event) => this.onInput("end", event)}
              @change=${this.onChange}
            />`
          : nothing}
        ${this.showValues && this.showTooltip
          ? html`<span
                class="loomi-value-tooltip loomi-value-tooltip-start"
                style=${this.tooltipStyle(this.startValue)}
                aria-hidden="true"
                >${this.startValue}</span
              >
              ${this.range
                ? html`<span
                    class="loomi-value-tooltip loomi-value-tooltip-end"
                    style=${this.tooltipStyle(this.endValue)}
                    aria-hidden="true"
                    >${this.endValue}</span
                  >`
                : nothing}`
          : nothing}
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-slider": LoomiSlider;
  }
}
