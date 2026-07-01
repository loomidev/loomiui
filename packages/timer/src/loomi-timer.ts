import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LoomiElement, accentVars, loomiStyles, type LoomiColor } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiTimerDirection = "up" | "down";
export type LoomiTimerFormat = "clock" | "seconds";

const SECOND_MS = 1000;

/**
 * `<loomi-timer>` - an animated count up/down timer.
 *
 * @fires timer-start - Fired when the timer starts.
 * @fires timer-pause - Fired when the timer pauses.
 * @fires timer-reset - Fired when the timer resets.
 * @fires timer-tick - Fired when the displayed whole second changes.
 * @fires timer-complete - Fired when a bounded timer reaches its end.
 */
@customElement("loomi-timer")
export class LoomiTimer extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() direction: LoomiTimerDirection = "down";
  @property({ type: Number }) duration = 60;
  @property({ type: Number, attribute: "start-value" }) startValue = 0;
  @property() format: LoomiTimerFormat = "clock";
  @property() label = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ type: Boolean, attribute: "auto-start" }) autoStart = false;
  @property({ type: Boolean, attribute: "show-controls" }) showControls = false;
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
        changedProperties.has("duration") ||
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
    this.dispatchTimerEvent("timer-start");
    this.scheduleFrame();
  }

  pause(): void {
    if (!this.running) return;
    this.updateDisplay(performance.now());
    this.running = false;
    this.cancelFrame();
    this.dispatchTimerEvent("timer-pause");
  }

  reset(emitEvent = true): void {
    this.cancelFrame();
    this.running = false;
    this.complete = false;
    this.displayMs = this.initialDisplayMs;
    this.runStartedValueMs = this.displayMs;
    this.runStartedAt = 0;
    this.lastWholeSecond = this.wholeSeconds;
    if (emitEvent) this.dispatchTimerEvent("timer-reset");
  }

  private get normalizedDirection(): LoomiTimerDirection {
    return this.direction === "up" ? "up" : "down";
  }

  private get durationMs(): number {
    return Math.max(0, Number(this.duration) || 0) * SECOND_MS;
  }

  private get boundedCountUpMs(): number {
    if (this.normalizedDirection !== "up") return 0;
    return this.hasAttribute("duration") ? this.durationMs : 0;
  }

  private get initialDisplayMs(): number {
    const startMs = Math.max(0, Number(this.startValue) || 0) * SECOND_MS;
    if (this.normalizedDirection === "up") return startMs;
    return startMs > 0 ? startMs : this.durationMs;
  }

  private get wholeSeconds(): number {
    return this.normalizedDirection === "up"
      ? Math.floor(this.displayMs / SECOND_MS)
      : Math.ceil(this.displayMs / SECOND_MS);
  }

  private get progressPercent(): number {
    const total = this.normalizedDirection === "up" ? this.boundedCountUpMs : this.durationMs;
    if (total <= 0) return this.running ? 100 : 0;
    const value = this.normalizedDirection === "up" ? this.displayMs : total - this.displayMs;
    return Math.min(100, Math.max(0, (value / total) * 100));
  }

  private get displayText(): string {
    const seconds = Math.max(0, this.wholeSeconds);
    if (this.format === "seconds") return String(seconds);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const pad = (value: number) => String(value).padStart(2, "0");

    return hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
      : `${pad(minutes)}:${pad(remainingSeconds)}`;
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
      this.dispatchTimerEvent("timer-complete");
    }
  }

  private dispatchTickIfNeeded(): void {
    const nextWholeSecond = this.wholeSeconds;
    if (nextWholeSecond === this.lastWholeSecond) return;
    this.lastWholeSecond = nextWholeSecond;
    this.animateTick();
    this.dispatchTimerEvent("timer-tick");
  }

  private dispatchTimerEvent(type: string): void {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: {
          value: this.wholeSeconds,
          direction: this.normalizedDirection,
          duration: this.duration,
          progress: this.progressPercent,
          complete: this.complete,
        },
      }),
    );
  }

  private animateTick(): void {
    if (!this.animated) return;
    if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const time = this.renderRoot.querySelector<HTMLElement>(".loomi-time");
    time?.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: "translateY(-0.04em) scale(1.015)", opacity: 0.86 },
        { transform: "translateY(0) scale(1)", opacity: 1 },
      ],
      { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }

  private onToggle = (): void => {
    if (this.running) this.pause();
    else this.start();
  };

  override render(): TemplateResult {
    const timerStyle = `${accentVars(this.color)}--loomi-progress:${this.progressPercent};`;
    return html`<div class="loomi-timer ${this.running ? "is-running" : ""}" style=${timerStyle}>
      <div class="loomi-face" role="timer" aria-live="polite" aria-label=${this.label || nothing}>
        ${this.label ? html`<div class="loomi-label">${this.label}</div>` : nothing}
        <div class="loomi-time">${this.displayText}</div>
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

declare global {
  interface HTMLElementTagNameMap {
    "loomi-timer": LoomiTimer;
  }
}
