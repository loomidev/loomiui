import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, accentVars, loomiStyles, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTimerDirection = "up" | "down";

interface LoomiTimerSegments {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * `<loomi-timer>` - an animated count up/down timer with day/hour/minute/second
 * digit segments, each labeled underneath.
 *
 * @fires loomi-timer-start - Fired when the timer starts.
 * @fires loomi-timer-pause - Fired when the timer pauses.
 * @fires loomi-timer-reset - Fired when the timer resets.
 * @fires loomi-timer-tick - Fired when the displayed whole second changes.
 * @fires loomi-timer-complete - Fired when a bounded timer reaches its end.
 */
@customElement("loomi-timer")
export class LoomiTimer extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() direction: LoomiTimerDirection = "down";
  @property({ type: Number }) days = 0;
  @property({ type: Number }) hours = 0;
  @property({ type: Number }) mins = 1;
  @property({ type: Number, attribute: "start-value" }) startValue = 0;
  @property() label = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Boolean, attribute: "auto-start" }) autoStart = false;
  @property({ type: Boolean, attribute: "show-controls" }) showControls = false;
  @property({ type: Boolean, attribute: "show-border" }) showBorder = false;
  @property({ type: Boolean }) animated = true;
  @property({ type: Boolean, reflect: true }) running = false;

  @state() private displayMs = this.initialDisplayMs;
  @state() private complete = false;

  private animationFrame = 0;
  private runStartedAt = 0;
  private runStartedValueMs = this.initialDisplayMs;
  private lastWholeSecond = -1;

  override connectedCallback(): void {
    super.connectedCallback();
    this.displayMs = this.initialDisplayMs;
    this.lastWholeSecond = this.wholeSeconds;
    if (this.autoStart) this.start();
  }

  override disconnectedCallback(): void {
    this.cancelFrame();
    super.disconnectedCallback();
  }

  protected override updated(changedProperties: PropertyValues): void {
    if (
      (changedProperties.has("direction") ||
        changedProperties.has("days") ||
        changedProperties.has("hours") ||
        changedProperties.has("mins") ||
        changedProperties.has("startValue")) &&
      !this.running
    ) {
      this.reset(false);
      return;
    }

    if (changedProperties.has("displayMs")) this.dispatchTickIfNeeded();
  }

  start(): void {
    if (this.running || this.complete) return;
    this.running = true;
    this.runStartedAt = performance.now();
    this.runStartedValueMs = this.displayMs;
    this.dispatchTimerEvent("loomi-timer-start");
    this.scheduleFrame();
  }

  pause(): void {
    if (!this.running) return;
    this.updateDisplay(performance.now());
    this.running = false;
    this.cancelFrame();
    this.dispatchTimerEvent("loomi-timer-pause");
  }

  reset(emitEvent = true): void {
    this.cancelFrame();
    this.running = false;
    this.complete = false;
    this.displayMs = this.initialDisplayMs;
    this.runStartedValueMs = this.displayMs;
    this.runStartedAt = 0;
    this.lastWholeSecond = this.wholeSeconds;
    if (emitEvent) this.dispatchTimerEvent("loomi-timer-reset");
  }

  private get normalizedDirection(): LoomiTimerDirection {
    return this.direction === "up" ? "up" : "down";
  }

  /** Whether the countdown length was explicitly configured via `days`/`hours`/`mins`. */
  private get hasExplicitBound(): boolean {
    return this.hasAttribute("days") || this.hasAttribute("hours") || this.hasAttribute("mins");
  }

  /** Total time described by the `days`/`hours`/`mins` props, in milliseconds. */
  private get boundMs(): number {
    const days = Math.max(0, Number(this.days) || 0);
    const hours = Math.max(0, Number(this.hours) || 0);
    const mins = Math.max(0, Number(this.mins) || 0);
    return days * DAY_MS + hours * HOUR_MS + mins * MINUTE_MS;
  }

  private get boundedCountUpMs(): number {
    if (this.normalizedDirection !== "up") return 0;
    return this.hasExplicitBound ? this.boundMs : 0;
  }

  private get initialDisplayMs(): number {
    const startMs = Math.max(0, Number(this.startValue) || 0) * SECOND_MS;
    if (this.normalizedDirection === "up") return startMs;
    return startMs > 0 ? startMs : this.boundMs;
  }

  private get wholeSeconds(): number {
    return this.normalizedDirection === "up"
      ? Math.floor(this.displayMs / SECOND_MS)
      : Math.ceil(this.displayMs / SECOND_MS);
  }

  private get progressPercent(): number {
    const total = this.normalizedDirection === "up" ? this.boundedCountUpMs : this.boundMs;
    if (total <= 0) return this.running ? 100 : 0;
    const value = this.normalizedDirection === "up" ? this.displayMs : total - this.displayMs;
    return Math.min(100, Math.max(0, (value / total) * 100));
  }

  private get segments(): LoomiTimerSegments {
    const totalSeconds = Math.max(0, this.wholeSeconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }

  private get srText(): string {
    const { days, hours, minutes, seconds } = this.segments;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  private scheduleFrame(): void {
    this.cancelFrame();
    this.animationFrame = requestAnimationFrame(this.onFrame);
  }

  private cancelFrame(): void {
    if (!this.animationFrame) return;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
  }

  private onFrame = (timestamp: number): void => {
    this.updateDisplay(timestamp);
    if (this.running) this.animationFrame = requestAnimationFrame(this.onFrame);
  };

  private updateDisplay(timestamp: number): void {
    const elapsed = Math.max(0, timestamp - this.runStartedAt);
    let nextValue =
      this.normalizedDirection === "up"
        ? this.runStartedValueMs + elapsed
        : this.runStartedValueMs - elapsed;

    if (this.normalizedDirection === "up" && this.boundedCountUpMs > 0) {
      nextValue = Math.min(this.boundedCountUpMs, nextValue);
    } else if (this.normalizedDirection === "down") {
      nextValue = Math.max(0, nextValue);
    }

    this.displayMs = nextValue;

    const isComplete =
      (this.normalizedDirection === "down" && nextValue <= 0) ||
      (this.normalizedDirection === "up" && this.boundedCountUpMs > 0 && nextValue >= this.boundedCountUpMs);

    if (isComplete) {
      this.running = false;
      this.complete = true;
      this.cancelFrame();
      this.dispatchTimerEvent("loomi-timer-complete");
    }
  }

  private dispatchTickIfNeeded(): void {
    const nextWholeSecond = this.wholeSeconds;
    if (nextWholeSecond === this.lastWholeSecond) return;
    this.lastWholeSecond = nextWholeSecond;
    this.animateTick();
    this.dispatchTimerEvent("loomi-timer-tick");
  }

  private dispatchTimerEvent(type: string): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: {
          value: this.wholeSeconds,
          direction: this.normalizedDirection,
          days: this.days,
          hours: this.hours,
          mins: this.mins,
          progress: this.progressPercent,
          complete: this.complete,
        },
      }),
    );
  }

  private animateTick(): void {
    if (!this.animated) return;
    if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const digits = this.renderRoot.querySelectorAll<HTMLElement>(".loomi-time");
    digits.forEach((digit) => {
      digit.animate(
        [
          { transform: "translateY(0) scale(1)", opacity: 1 },
          { transform: "translateY(-0.04em) scale(1.015)", opacity: 0.86 },
          { transform: "translateY(0) scale(1)", opacity: 1 },
        ],
        { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
      );
    });
  }

  private onToggle = (): void => {
    if (this.running) this.pause();
    else this.start();
  };

  override render(): TemplateResult {
    const timerStyle = `${accentVars(this.color)}--loomi-progress:${this.progressPercent};`;
    const { days, hours, minutes, seconds } = this.segments;
    const pad = (value: number) => String(value).padStart(2, "0");
    const ariaLabel = this.label ? `${this.label}: ${this.srText}` : this.srText;

    return html`<div class="loomi-timer ${this.running ? "is-running" : ""}" style=${timerStyle}>
      <div
        class="loomi-face ${this.showBorder ? "bordered" : ""}"
        role="timer"
        aria-live="polite"
        aria-label=${ariaLabel}
      >
        ${this.label ? html`<div class="loomi-label">${this.label}</div>` : nothing}
        <div class="loomi-segments">
          <div class="loomi-segment">
            <div class="loomi-time">${pad(days)}</div>
            <div class="loomi-unit">Days</div>
          </div>
          <div class="loomi-sep" aria-hidden="true">:</div>
          <div class="loomi-segment">
            <div class="loomi-time">${pad(hours)}</div>
            <div class="loomi-unit">Hours</div>
          </div>
          <div class="loomi-sep" aria-hidden="true">:</div>
          <div class="loomi-segment">
            <div class="loomi-time">${pad(minutes)}</div>
            <div class="loomi-unit">Mins</div>
          </div>
          <div class="loomi-sep" aria-hidden="true">:</div>
          <div class="loomi-segment">
            <div class="loomi-time">${pad(seconds)}</div>
            <div class="loomi-unit">Secs</div>
          </div>
        </div>
        <div class="loomi-status" aria-hidden="true">
          <span class="loomi-pulse"></span>
          <span>${this.running ? "Running" : this.complete ? "Complete" : "Paused"}</span>
        </div>
      </div>
      ${this.showControls
        ? html`<div class="loomi-controls">
            <button type="button" @click=${this.onToggle}>${this.running ? "Pause" : "Start"}</button>
            <button type="button" @click=${() => this.reset()}>Reset</button>
          </div>`
        : nothing}
    </div>`;
  }
}

export interface LoomiTimerEventDetail {
  value: number;
  direction: LoomiTimerDirection;
  days: number;
  hours: number;
  mins: number;
  progress: number;
  complete: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timer": LoomiTimer;
  }

  interface HTMLElementEventMap {
    "loomi-timer-start": CustomEvent<LoomiTimerEventDetail>;
    "loomi-timer-pause": CustomEvent<LoomiTimerEventDetail>;
    "loomi-timer-reset": CustomEvent<LoomiTimerEventDetail>;
    "loomi-timer-tick": CustomEvent<LoomiTimerEventDetail>;
    "loomi-timer-complete": CustomEvent<LoomiTimerEventDetail>;
  }
}
