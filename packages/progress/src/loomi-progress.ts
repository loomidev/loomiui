import { html, nothing, svg, type TemplateResult, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, loomiT, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

/**
 * Lit's default `type: Boolean` converter treats attribute *presence* as `true`
 * regardless of its value, so `attr="false"` (the natural way to override a
 * `true`-by-default boolean in HTML) silently has no effect. This converter reads
 * the string instead, so `="false"` actually clears it.
 */
const booleanAttributeConverter = {
  fromAttribute: (value: string | null): boolean => value !== "false",
  toAttribute: (value: boolean): string | null => (value ? "" : "false"),
};

export type LoomiProgressLabelPosition =
  "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
export type LoomiProgressStepState = "complete" | "current" | "upcoming" | "error";
export type LoomiProgressStepsOrientation = "horizontal" | "vertical";
export type LoomiProgressStepSize = "small" | "regular";
export type LoomiProgressStepsVariant = "circle" | "bar";

const STEP_CHECK = svg`<path stroke-linecap="round" stroke-linejoin="round" d="m5 12.5 4 4 10-10" />`;
const STEP_CHEVRON = svg`<path d="M 0 0 L 19 50 L 0 100" vector-effect="non-scaling-stroke" />`;

/**
 * `<loomi-progress-bar>` — a horizontal progress bar.
 */
@customElement("loomi-progress-bar")
export class LoomiProgressBar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  /** Accessible name for the progress bar. Falls back to a translated "Progress". */
  @property() label = "";
  @property() locale = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property({ type: Boolean, attribute: "show-percentage-label" }) showLabel = false;
  @property({ type: Boolean, attribute: "show-percentage-tooltip" }) showTooltip = false;
  @property({ attribute: "show-percentage-label-inline", converter: booleanAttributeConverter })
  inline = true;
  @property({ attribute: "percentage-label-position" }) labelPosition: LoomiProgressLabelPosition =
    "top-left";
  @property({ attribute: "percentage-prefix" }) prefix = "";
  @property({ attribute: "percentage-suffix" }) suffix = "";
  @property({ type: Boolean }) striped = false;
  @property({ type: Boolean }) animated = false;

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  /** A `role="progressbar"` with no name is unusable in a screen reader's landmark list. */
  private get accessibleName(): string {
    return this.label || loomiT("progress.label", {}, this.locale);
  }

  private get text(): string {
    return `${this.prefix}${this.pct}%${this.suffix}`;
  }

  override render(): TemplateResult {
    const [vpos, hpos] = this.labelPosition.split("-");
    const outsideLabel = this.showLabel && !this.inline;
    const labelEl = outsideLabel
      ? html`<div class="loomi-bar-label-out ${hpos}">${this.text}</div>`
      : nothing;
    return html`<div class="loomi-bar-wrap" style=${accentVars(this.color)}>
      ${vpos === "top" ? labelEl : nothing}
      <div class="loomi-track ${this.showLabel && this.inline ? "has-label" : ""}" role="progressbar" aria-label=${this.accessibleName} aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
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
  /** Accessible name for the progress circle. Falls back to a translated "Progress". */
  @property() label = "";
  @property() locale = "";

  /** A `role="progressbar"` with no name is unusable in a screen reader's landmark list. */
  private get accessibleName(): string {
    return this.label || loomiT("progress.label", {}, this.locale);
  }

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get px(): number {
    return SIZES[this.size] ?? (Number(this.size) || 120);
  }

  override render(): TemplateResult {
    const r = 50 - this.circleWidth / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - this.pct / 100);
    const px = this.px;
    return html`<div class="loomi-circle" style=${accentVars(this.color) + `width:${px}px;height:${px}px`}>
      <svg width=${px} height=${px} viewBox="0 0 100 100" role="progressbar" aria-label=${this.accessibleName} aria-valuenow=${this.pct} aria-valuemin="0" aria-valuemax="100">
        <circle class="track" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}></circle>
        <circle class="bar ${this.shade === "dark" ? "dark" : ""}" cx="50" cy="50" r=${r} fill="none" stroke-width=${this.circleWidth}
          stroke-dasharray=${circ} stroke-dashoffset=${offset}></circle>
      </svg>
      ${
        this.showLabel
          ? html`<div class="label" style="font-size:${px * 0.22}px">${this.pct}${this.showPercent ? "%" : ""}</div>`
          : nothing
      }
    </div>`;
  }
}

const ARC_SIZES: Record<string, number> = { small: 160, medium: 220, big: 300, large: 380 };
const ARC_TICKS = 40;

/**
 * `<loomi-progress-arc>` — a semicircular gauge made of radial tick marks, with the
 * percentage and an optional caption centered under the arc.
 *
 * @slot - Content placed below the caption, e.g. a "Show details" button.
 */
@customElement("loomi-progress-arc")
export class LoomiProgressArc extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Number }) percentage = 0;
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property() shade: "faint" | "dark" = "faint";
  @property() size: string = "medium";
  @property({ attribute: "show-percent", converter: booleanAttributeConverter }) showPercent = true;
  @property() caption = "";
  /** Accessible name for the arc. Falls back to a translated "Progress". */
  @property() label = "";
  @property() locale = "";

  private get accessibleName(): string {
    return this.label || loomiT("progress.label", {}, this.locale);
  }

  private get pct(): number {
    return Math.min(100, Math.max(0, this.percentage));
  }
  private get px(): number {
    return ARC_SIZES[this.size] ?? (Number(this.size) || 220);
  }

  private renderTicks(): TemplateResult {
    const cx = 100;
    const cy = 100;
    const rOuter = 94;
    const rInner = 78;
    const activeCount = Math.round((this.pct / 100) * ARC_TICKS);
    const ticks = Array.from({ length: ARC_TICKS }, (_, i) => {
      const angle = (Math.PI * i) / (ARC_TICKS - 1);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x1 = cx - rInner * cos;
      const y1 = cy - rInner * sin;
      const x2 = cx - rOuter * cos;
      const y2 = cy - rOuter * sin;
      const active = i < activeCount;
      return svg`<line x1=${x1} y1=${y1} x2=${x2} y2=${y2} class=${active ? `tick active ${this.shade === "dark" ? "dark" : ""}` : "tick"} />`;
    });
    return svg`${ticks}`;
  }

  override render(): TemplateResult {
    const px = this.px;
    return html`<div class="loomi-arc" style=${accentVars(this.color) + `width:${px}px`}>
      <svg
        viewBox="0 0 200 104"
        role="progressbar"
        aria-label=${this.accessibleName}
        aria-valuenow=${this.pct}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        ${this.renderTicks()}
      </svg>
      <div class="loomi-arc-body">
        ${
          this.showPercent
            ? html`<div class="loomi-arc-value" style="font-size:${px * 0.16}px">${this.pct}%</div>`
            : nothing
        }
        ${this.caption ? html`<div class="loomi-arc-caption">${this.caption}</div>` : nothing}
        <slot></slot>
      </div>
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
  @property({ reflect: true }) variant: LoomiProgressStepsVariant = "circle";
  @property() locale = "";

  /** Whether this step body is hidden by an interactive group. */
  @property({ type: Boolean }) contentHidden = false;
  @property({ type: Boolean, reflect: true, attribute: "panel-layout" }) panelLayout = false;

  private get computedState(): LoomiProgressStepState {
    if (this.error || this.state === "error") return "error";
    if (this.completed || this.state === "complete") return "complete";
    if (this.active || this.state === "current") return "current";
    return "upcoming";
  }

  private get isInteractive(): boolean {
    return Boolean(this.href || this.clickable);
  }

  private onSelect(event: Event): void {
    if (this.disabled) { event.preventDefault(); return; }
    if (this.parentElement instanceof LoomiProgressSteps && this.parentElement.interactive) event.preventDefault();
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
    const bar = this.variant === "bar";
    const classes = `loomi-step-control ${state}`;
    const marker = bar
      ? nothing
      : html`<span class="loomi-step-marker ${state}">${this.renderMarker(state)}</span>`;
    const eyebrow = bar
      ? html`<span class="loomi-step-eyebrow ${state}">${loomiT("progress.step", { index: this.stepIndex }, this.locale)}</span>`
      : nothing;
    const label = html`<span class="loomi-step-copy">
      ${eyebrow}
      <span class="loomi-step-label"><slot name="label">${this.label}</slot></span>
      ${
        this.description
          ? html`<span class="loomi-step-description"><slot name="description">${this.description}</slot></span>`
          : html`<slot name="description"></slot>`
      }
    </span>`;

    if (this.href) {
      return html`<a
        class=${classes}
        href=${this.href}
        aria-current=${this.active || state === "current" ? "step" : nothing}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this.onSelect}
      >${marker}${label}</a>`;
    }
    if (this.clickable) {
      return html`<button
        class=${classes}
        type="button"
        ?disabled=${this.disabled}
        aria-current=${this.active || state === "current" ? "step" : nothing}
        @click=${this.onSelect}
      >${marker}${label}</button>`;
    }
    return html`<span class=${classes} aria-current=${this.active || state === "current" ? "step" : nothing}>${marker}${label}</span>`;
  }

  override render(): TemplateResult {
    const state = this.computedState;
    const bar = this.variant === "bar";
    return html`<div
      class="loomi-step ${this.orientation} ${this.size} ${this.variant} ${state} ${this.isInteractive ? "interactive" : ""}"
      role="listitem"
      style=${accentVars(this.color) + `--step-column:${this.stepIndex};`}
    >
      ${bar ? html`<span class="loomi-step-bar ${state}" aria-hidden="true"></span>` : nothing}
      <div class="loomi-step-head">
        ${this.renderControl(state)}
        ${
          bar
            ? nothing
            : html`<span class="loomi-step-line ${state}" aria-hidden="true">${
                this.orientation === "horizontal"
                  ? html`<svg class="loomi-step-chevron" viewBox="0 0 20 100" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">${STEP_CHEVRON}</svg>`
                  : nothing
              }</span>`
        }
      </div>
      <div class="loomi-step-body" ?hidden=${this.contentHidden}><slot></slot></div>
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
  @property() variant: LoomiProgressStepsVariant = "circle";
  @property({ type: Boolean }) clickable = false;

  /** Selectable steps and current-step-only content. Default `true`; set `interactive="false"` to keep all step content visible and headers non-clickable. */
  @property({ converter: booleanAttributeConverter }) interactive = true;
  /** Check native and custom form controls before moving forward. */
  @property({ type: Boolean }) validate = false;
  /** Optional synchronous or asynchronous forward-navigation validator. */
  @property({ attribute: false }) validateStep?: (step: LoomiProgressStep, next: number) => boolean | Promise<boolean>;
  private navigating = false;
  private validationErrors = new WeakSet<LoomiProgressStep>();

  /** Navigate to a one-based step, returning false when navigation is blocked. */
  async goTo(next: number): Promise<boolean> {
    const steps = this.steps;
    const target = steps[next - 1];
    const source = steps[this.current - 1];
    if (this.navigating || !Number.isInteger(next) || !target || target.disabled) return false;
    if (next === this.current) return true;
    const current = this.current;
    this.navigating = true;
    try {
      if (next > current && source) {
        if ((source.error && !this.validationErrors.has(source)) || source.state === "error") return false;
        let valid = true;
        if (this.validate) {
          for (const control of Array.from(source.querySelectorAll<HTMLElement>("*"))) {
            if (control.closest("loomi-progress-step") !== source) continue;
            const field = control as HTMLElement & { reportValidity?: () => boolean };
            if (typeof field.reportValidity === "function" && !field.reportValidity()) { valid = false; break; }
          }
        }
        if (valid && this.validateStep) valid = await this.validateStep(source, next);
        if (this.current !== current || this.steps[next - 1] !== target || this.steps[current - 1] !== source || target.disabled) return false;
        if (!valid) {
          this.validationErrors.add(source);
          source.error = true;
          return false;
        }
        if (this.validationErrors.has(source)) {
          source.error = false;
          this.validationErrors.delete(source);
        }
        if (source.error || String(source.state) === "error") return false;
      }
      this.current = next;
      this.syncSteps();
      this.dispatchEvent(new CustomEvent("loomi-progress-steps-change", {
        bubbles: true, composed: true, detail: { current: next, step: target },
      }));
      return true;
    } catch {
      if (source && this.current === current) {
        this.validationErrors.add(source);
        source.error = true;
      }
      return false;
    } finally {
      this.navigating = false;
    }
  }

  /** Advance through the same validation path as selecting a header. */
  next(): Promise<boolean> { return this.goTo(this.current + 1); }
  /** Return to the previous step without forward validation. */
  previous(): Promise<boolean> { return this.goTo(this.current - 1); }

  private get steps(): LoomiProgressStep[] {
    // Light DOM is not readable during server rendering; hydration fills this in on the client.
    if (isServer) return [];
    return Array.from(this.children).filter((child): child is LoomiProgressStep => child instanceof LoomiProgressStep);
  }

  /**
   * Steps whose state the author set themselves, recorded the first time each step is
   * seen. It cannot be re-derived from attributes on every sync: `active`, `completed`
   * and `error` all reflect, so the state this group writes becomes an attribute, and a
   * later sync would read its own output back as author intent — freezing every step at
   * whatever the first render produced and leaving `current` unable to move.
   */
  private authoredState = new WeakSet<LoomiProgressStep>();
  private seenSteps = new WeakSet<LoomiProgressStep>();

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
      if (!this.seenSteps.has(step)) {
        this.seenSteps.add(step);
        if (this.hasExplicitState(step)) this.authoredState.add(step);
      }
      const stepNumber = index + 1;
      step.stepIndex = stepNumber;
      step.last = stepNumber === steps.length;
      if (!step.hasAttribute("color")) step.color = this.color;
      step.orientation = this.orientation;
      step.size = this.size;
      step.variant = this.variant;
      if (!step.hasAttribute("clickable")) step.clickable = this.clickable || this.interactive;
      step.contentHidden = this.interactive && stepNumber !== this.current;
      step.panelLayout = this.interactive && this.orientation === "horizontal";

      if (!this.authoredState.has(step)) {
        step.completed = stepNumber < this.current;
        step.active = stepNumber === this.current;
        step.state = "upcoming";
      }
    });
  };

  private onStepSelect(event: Event): void {
    if (!this.clickable && !this.interactive) return;
    const step = event.target as LoomiProgressStep;
    if (!this.steps.includes(step)) return;
    event.stopPropagation();
    void this.goTo(step.stepIndex);
  }

  override willUpdate(): void {
    this.syncSteps();
  }

  override firstUpdated(): void {
    this.syncSteps();
  }

  override render(): TemplateResult {
    return html`<div
      class="loomi-steps ${this.orientation} ${this.size} ${this.variant} ${this.interactive ? "panels" : ""}"
      role="list"
      style=${accentVars(this.color) + `--step-count:${this.steps.length || 1};`}
      @loomi-progress-step-select=${this.onStepSelect}
    ><slot @slotchange=${this.syncSteps}></slot></div>`;
  }
}

export interface LoomiProgressStepSelectDetail {
  index: number;
  value: number;
  label: string;
  state: LoomiProgressStepState;
}

export interface LoomiProgressStepsChangeDetail {
  current: number;
  step: LoomiProgressStep;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-progress-bar": LoomiProgressBar;
    "loomi-progress-circle": LoomiProgressCircle;
    "loomi-progress-arc": LoomiProgressArc;
    "loomi-progress-step": LoomiProgressStep;
    "loomi-progress-steps": LoomiProgressSteps;
  }

  interface HTMLElementEventMap {
    "loomi-progress-step-select": CustomEvent<LoomiProgressStepSelectDetail>;
    "loomi-progress-steps-change": CustomEvent<LoomiProgressStepsChangeDetail>;
  }
}
