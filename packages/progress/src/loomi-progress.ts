import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiProgressLabelPosition =
  | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
export type LoomiProgressStepState = "complete" | "current" | "upcoming" | "error";
export type LoomiProgressStepsOrientation = "horizontal" | "vertical";
export type LoomiProgressStepSize = "small" | "regular";

const STEP_CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4 4 10-10" />`;

/**
 * `<loomi-progress-bar>` — a horizontal progress bar.
 */
@customElement("loomi-progress-bar")
export class LoomiProgressBar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property({ type: Boolean, attribute: "show-percentage-label" }) showLabel = false;
  @property({ type: Boolean, attribute: "show-percentage-tooltip" }) showTooltip = false;
  @property({ type: Boolean, attribute: "show-percentage-label-inline" }) inline = true;
  @property({ attribute: "percentage-label-position" }) labelPosition: LoomiProgressLabelPosition = "top-left";
  @property({ attribute: "percentage-prefix" }) prefix = "";
  @property({ attribute: "percentage-suffix" }) suffix = "";
  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) animated = false;

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get text(): string {
    return `${this.prefix}${this.pct}%${this.suffix ? " " + this.suffix : ""}`;
  }

  override render(): TemplateResult {
    const [vpos, hpos] = this.labelPosition.split("-");
    const outsideLabel = this.showLabel && !this.inline;
    const labelEl = outsideLabel
      ? html`<div class="loomi-bar-label-out ${hpos}">${this.text}</div>`
      : nothing;
    return html`<div class="loomi-bar-wrap" style=${accentVars(this.color)}>
      ${vpos === "top" ? labelEl : nothing}
      <div class="loomi-track" role="progressbar" aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
        <div class="loomi-fill ${this.shade === "dark" ? "dark" : ""} ${this.striped ? "striped" : ""} ${this.animated ? "animated" : ""}" style="width:${this.pct}%">
          ${this.showLabel && this.inline ? html`<span class="loomi-fill-label">${this.pct}%</span>` : nothing}
        </div>
        ${this.showTooltip ? html`<span class="loomi-bar-tooltip" style="left:${this.pct}%">${this.text}</span>` : nothing}
      </div>
      ${vpos === "bottom" ? labelEl : nothing}
    </div>`;
  }
}

const SIZES: Record<string, number> = { tiny: 50, small: 80, medium: 120, big: 200, large: 300 };

/**
 * `<loomi-progress-circle>` — a circular progress indicator.
 */
@customElement("loomi-progress-circle")
export class LoomiProgressCircle extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property() size: string = "medium";
  @property({ type: Boolean, attribute: "show-label" }) showLabel = false;
  @property({ type: Boolean, attribute: "show-percent" }) showPercent = false;
  @property({ type: Number, attribute: "circle-width" }) circleWidth = 10;

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get px(): number {
    return SIZES[this.size] ?? Number(this.size) ?? 120;
  }

  override render(): TemplateResult {
    const r = 50 - this.circleWidth / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - this.pct / 100);
    const px = this.px;
    return html`<div class="loomi-circle" style=${accentVars(this.color) + `width:${px}px;height:${px}px`}>
      <svg width=${px} height=${px} viewBox="0 0 100 100" role="progressbar" aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
        <circle class="track" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}></circle>
        <circle class="bar ${this.shade === "dark" ? "dark" : ""}" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}
          stroke-dasharray=${circ} stroke-dashoffset=${offset}></circle>
      </svg>
      ${this.showLabel
        ? html`<div class="label" style="font-size:${px * 0.22}px">${this.pct}${this.showPercent ? "%" : ""}</div>`
        : nothing}
    </div>`;
  }
}

/**
 * `<loomi-progress-step>` — one labelled step. Place inside `<loomi-progress-steps>`.
 *
 * @slot - Extra content below the description.
 * @slot label - Custom label content.
 * @slot description - Custom description content.
 * @fires loomi-progress-step-select - `detail: { index, value, label, state }`.
 */
@customElement("loomi-progress-step")
export class LoomiProgressStep extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() label = "";
  @property() description = "";
  @property() href = "";
  @property() state: LoomiProgressStepState = "upcoming";
  @property({ type: Number }) value = 0;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) completed = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: Boolean, reflect: true }) clickable = false;
  @property({ type: Boolean, reflect: true }) last = false;
  @property({ type: Boolean, attribute: "hide-index" }) hideIndex = false;
  @property({ type: Number, attribute: "step-index" }) stepIndex = 0;
  @property({ reflect: true }) orientation: LoomiProgressStepsOrientation = "horizontal";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() size: LoomiProgressStepSize = "regular";

  private get computedState(): LoomiProgressStepState {
    if (this.error || this.state === "error") return "error";
    if (this.completed || this.state === "complete") return "complete";
    if (this.active || this.state === "current") return "current";
    return "upcoming";
  }

  private get isInteractive(): boolean {
    return Boolean(this.href || this.clickable);
  }

  private onSelect(): void {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("loomi-progress-step-select", {
        bubbles: true,
        composed: true,
        detail: {
          index: this.stepIndex,
          value: this.value || this.stepIndex,
          label: this.label,
          state: this.computedState,
        },
      }),
    );
  }

  private renderMarker(state: LoomiProgressStepState): TemplateResult {
    if (state === "complete") {
      return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">${STEP_CHECK}</svg>`;
    }
    if (state === "error") return html`<span aria-hidden="true">!</span>`;
    return html`<span aria-hidden="true">${this.hideIndex ? "" : this.stepIndex}</span>`;
  }

  private renderControl(state: LoomiProgressStepState): TemplateResult {
    const classes = `loomi-step-control ${state}`;
    const marker = html`<span class="loomi-step-marker ${state}">${this.renderMarker(state)}</span>`;
    const label = html`<span class="loomi-step-copy">
      <span class="loomi-step-label"><slot name="label">${this.label}</slot></span>
      ${this.description
        ? html`<span class="loomi-step-description"><slot name="description">${this.description}</slot></span>`
        : html`<slot name="description"></slot>`}
    </span>`;

    if (this.href) {
      return html`<a
        class=${classes}
        href=${this.href}
        aria-current=${state === "current" ? "step" : nothing}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this.onSelect}
      >${marker}${label}</a>`;
    }
    if (this.clickable) {
      return html`<button
        class=${classes}
        type="button"
        ?disabled=${this.disabled}
        aria-current=${state === "current" ? "step" : nothing}
        @click=${this.onSelect}
      >${marker}${label}</button>`;
    }
    return html`<span class=${classes} aria-current=${state === "current" ? "step" : nothing}>${marker}${label}</span>`;
  }

  override render(): TemplateResult {
    const state = this.computedState;
    return html`<div
      class="loomi-step ${this.orientation} ${this.size} ${state} ${this.isInteractive ? "interactive" : ""}"
      role="listitem"
      style=${accentVars(this.color)}
    >
      <div class="loomi-step-head">
        ${this.renderControl(state)}
        <span class="loomi-step-line ${state}" aria-hidden="true"></span>
      </div>
      <div class="loomi-step-body"><slot></slot></div>
    </div>`;
  }
}

/**
 * `<loomi-progress-steps>` — a horizontal or vertical progress stepper.
 *
 * @slot - `<loomi-progress-step>` children.
 * @fires loomi-progress-steps-change - `detail: { current, step }`.
 */
@customElement("loomi-progress-steps")
export class LoomiProgressSteps extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) current = 1;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() orientation: LoomiProgressStepsOrientation = "horizontal";
  @property() size: LoomiProgressStepSize = "regular";
  @property({ type: Boolean }) clickable = false;

  private get steps(): LoomiProgressStep[] {
    return Array.from(this.querySelectorAll("loomi-progress-step"));
  }

  private hasExplicitState(step: LoomiProgressStep): boolean {
    return (
      step.hasAttribute("state") ||
      step.hasAttribute("active") ||
      step.hasAttribute("completed") ||
      step.hasAttribute("error")
    );
  }

  private syncSteps = (): void => {
    const steps = this.steps;
    steps.forEach((step, index) => {
      const stepNumber = index + 1;
      step.stepIndex = stepNumber;
      step.last = stepNumber === steps.length;
      if (!step.hasAttribute("color")) step.color = this.color;
      step.orientation = this.orientation;
      step.size = this.size;
      if (!step.hasAttribute("clickable")) step.clickable = this.clickable;

      if (!this.hasExplicitState(step)) {
        step.completed = stepNumber < this.current;
        step.active = stepNumber === this.current;
        step.error = false;
        step.state = "upcoming";
      }
    });
  };

  private onStepSelect(event: Event): void {
    if (!this.clickable) return;
    const step = event.target as LoomiProgressStep;
    if (step.disabled) return;
    this.current = step.stepIndex;
    this.syncSteps();
    this.dispatchEvent(
      new CustomEvent("loomi-progress-steps-change", {
        bubbles: true,
        composed: true,
        detail: { current: this.current, step },
      }),
    );
  }

  override willUpdate(): void {
    this.syncSteps();
  }

  override firstUpdated(): void {
    this.syncSteps();
  }

  override render(): TemplateResult {
    return html`<div
      class="loomi-steps ${this.orientation} ${this.size}"
      role="list"
      style=${accentVars(this.color)}
      @loomi-progress-step-select=${this.onStepSelect}
    ><slot @slotchange=${this.syncSteps}></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-progress-bar": LoomiProgressBar;
    "loomi-progress-circle": LoomiProgressCircle;
    "loomi-progress-step": LoomiProgressStep;
    "loomi-progress-steps": LoomiProgressSteps;
  }
}
