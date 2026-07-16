import { html, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiScrollerDirection = "left" | "right" | "up" | "down";

export interface LoomiScrollerItemClickDetail {
  /** The original direct child, even when its visual clone was clicked. */
  item: HTMLElement;
  /** Zero-based index among the scroller's direct element children. */
  index: number;
  originalEvent: MouseEvent;
}

export interface LoomiScrollerScrollCompleteDetail {
  count: number;
  direction: LoomiScrollerDirection;
}

const DEFAULT_SPEED = 50;
const FOCUSABLE_SELECTOR =
  'a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable="true"]';

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : "false";
  },
};

const scrollCountAttribute = {
  fromAttribute(value: string | null): number | "infinite" {
    if (value === null || value.trim().toLowerCase() === "infinite") return "infinite";
    const count = Number(value);
    return Number.isFinite(count) && count > 0 ? Math.floor(count) : "infinite";
  },
  toAttribute(value: number | "infinite"): string {
    return value === "infinite" ? value : String(Math.max(1, Math.floor(value)));
  },
};

/**
 * `<loomi-scroller>` — continuously scrolls every item in its default slot as one
 * seamless ticker. Direct child elements are treated as clickable items.
 *
 * @slot - Content items to scroll.
 * @fires loomi-scroller-item-click - A direct item or its seamless clone was clicked.
 * @fires loomi-scroll-complete - A finite `scroll-count` finished.
 */
@customElement("loomi-scroller")
export class LoomiScroller extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  /** Travel speed in pixels per second. */
  @property({ type: Number }) speed = DEFAULT_SPEED;

  /** Physical direction in which the content moves. */
  @property({ reflect: true }) direction: LoomiScrollerDirection = "left";

  /** Pause the animation while the pointer is over the scroller. */
  @property({
    type: Boolean,
    attribute: "pause-on-hover",
    reflect: true,
    converter: booleanAttribute,
  })
  pauseOnHover = true;

  /** Number of complete passes, or `infinite`. */
  @property({ attribute: "scroll-count", reflect: true, converter: scrollCountAttribute })
  scrollCount: number | "infinite" = "infinite";

  /** Fade content into the leading and trailing viewport edges. */
  @property({
    type: Boolean,
    attribute: "blurred-edges",
    reflect: true,
    converter: booleanAttribute,
  })
  blurredEdges = true;

  /** Width or height of each faded edge. */
  @property({ attribute: "edge-size" }) edgeSize = "3rem";

  @query(".loomi-viewport") private viewportEl!: HTMLElement;
  @query(".loomi-group.primary") private primaryGroupEl!: HTMLElement;
  @query(".loomi-group.clone") private cloneGroupEl!: HTMLElement;
  @query(".loomi-track") private trackEl!: HTMLElement;
  @query("slot") private slotEl!: HTMLSlotElement;

  private travelDistance = 0;
  private duration = 1;
  private hasItems = false;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private cloneRepeats = 0;
  private cloneSyncQueued = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof MutationObserver !== "undefined") {
      this.mutationObserver = new MutationObserver(() => this.queueCloneSync());
      this.mutationObserver.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }
  }

  override disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.syncMeasurements());
      this.resizeObserver.observe(this.viewportEl);
      this.resizeObserver.observe(this.primaryGroupEl);
    }
    this.syncClones(true);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    if (changed.has("speed")) this.syncMeasurements();
    if (changed.has("direction") && changed.get("direction") !== undefined) {
      void this.updateComplete.then(() => this.syncClones(true));
    }
    if (changed.has("direction") || changed.has("scrollCount") || changed.has("speed")) {
      void this.updateComplete.then(() => this.restartAnimation());
    }
  }

  private get safeDirection(): LoomiScrollerDirection {
    return this.direction === "right" || this.direction === "up" || this.direction === "down"
      ? this.direction
      : "left";
  }

  private get safeSpeed(): number {
    return Number.isFinite(this.speed) && this.speed > 0 ? this.speed : DEFAULT_SPEED;
  }

  private get iterationCount(): string {
    if (this.scrollCount === "infinite") return "infinite";
    return String(Math.max(1, Math.floor(this.scrollCount)));
  }

  private get trackStyle(): string {
    return [
      `--_loomi-scroller-distance:${this.travelDistance}px`,
      `--_loomi-scroller-duration:${this.duration}s`,
      `--_loomi-scroller-iterations:${this.iterationCount}`,
      `--_loomi-scroller-edge-size:${this.edgeSize}`,
    ].join(";");
  }

  private queueCloneSync(): void {
    if (this.cloneSyncQueued) return;
    this.cloneSyncQueued = true;
    queueMicrotask(() => {
      this.cloneSyncQueued = false;
      if (this.isConnected && this.hasUpdated) this.syncClones(true);
    });
  }

  private onSlotChange = (): void => {
    this.syncClones(true);
  };

  private syncClones(force = false): void {
    if (!this.slotEl || !this.cloneGroupEl) return;

    const nodes = this.slotEl
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType !== Node.TEXT_NODE || !!node.textContent?.trim());
    const primarySize = this.measurePrimary();
    const viewportSize = this.measureViewport();
    const repeats = primarySize > 0 ? Math.max(1, Math.ceil(viewportSize / primarySize) + 1) : 0;

    this.hasItems = nodes.length > 0;
    if (!force && repeats === this.cloneRepeats) {
      this.syncMeasurements();
      return;
    }

    this.cloneRepeats = repeats;
    this.cloneGroupEl.replaceChildren();

    for (let repeat = 0; repeat < repeats; repeat += 1) {
      nodes.forEach((node, index) => {
        const clone = node.cloneNode(true);
        if (clone instanceof HTMLElement) this.prepareClone(clone, index);
        this.cloneGroupEl.append(clone);
      });
    }

    this.syncMeasurements();
  }

  private prepareClone(clone: HTMLElement, index: number): void {
    clone.dataset.loomiScrollerCloneIndex = String(index);
    clone.removeAttribute("id");
    clone.querySelectorAll<HTMLElement>("[id]").forEach((element) => element.removeAttribute("id"));

    const focusable = [clone, ...clone.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];
    focusable.forEach((element) => {
      if (element.matches(FOCUSABLE_SELECTOR)) element.tabIndex = -1;
    });
  }

  private measurePrimary(): number {
    if (!this.primaryGroupEl) return 0;
    const rect = this.primaryGroupEl.getBoundingClientRect();
    return this.safeDirection === "up" || this.safeDirection === "down" ? rect.height : rect.width;
  }

  private measureViewport(): number {
    if (!this.viewportEl) return 0;
    const rect = this.viewportEl.getBoundingClientRect();
    return this.safeDirection === "up" || this.safeDirection === "down" ? rect.height : rect.width;
  }

  private syncMeasurements(): void {
    const distance = this.measurePrimary();
    const viewportSize = this.measureViewport();
    const repeats = distance > 0 ? Math.max(1, Math.ceil(viewportSize / distance) + 1) : 0;

    if (repeats !== this.cloneRepeats) {
      this.syncClones();
      return;
    }

    this.travelDistance = distance;
    this.duration = distance > 0 ? distance / this.safeSpeed : 1;
    if (this.trackEl) {
      this.trackEl.style.setProperty("--_loomi-scroller-distance", `${this.travelDistance}px`);
      this.trackEl.style.setProperty("--_loomi-scroller-duration", `${this.duration}s`);
      this.trackEl.classList.toggle("is-ready", this.hasItems && this.travelDistance > 0);
    }
  }

  private restartAnimation(): void {
    if (!this.trackEl || !this.hasItems || this.travelDistance <= 0) return;
    this.trackEl.style.animation = "none";
    void this.trackEl.offsetWidth;
    this.trackEl.style.removeProperty("animation");
  }

  private onTrackClick = (event: MouseEvent): void => {
    const items = this.slotEl
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const path = event.composedPath();
    const clone = path.find(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && node.dataset.loomiScrollerCloneIndex !== undefined,
    );

    let index = clone ? Number(clone.dataset.loomiScrollerCloneIndex) : -1;
    if (!clone) {
      index = items.findIndex((item) => path.includes(item));
    }
    const item = items[index];
    if (!item) return;

    const allowed = this.dispatchEvent(
      new CustomEvent<LoomiScrollerItemClickDetail>("loomi-scroller-item-click", {
        detail: { item, index, originalEvent: event },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    if (!allowed) event.preventDefault();
  };

  private onAnimationEnd = (): void => {
    if (this.scrollCount === "infinite") return;
    this.dispatchEvent(
      new CustomEvent<LoomiScrollerScrollCompleteDetail>("loomi-scroll-complete", {
        detail: { count: Math.max(1, Math.floor(this.scrollCount)), direction: this.safeDirection },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override render(): TemplateResult {
    const direction = this.safeDirection;
    const axis = direction === "up" || direction === "down" ? "vertical" : "horizontal";
    const ready = this.hasItems && this.travelDistance > 0;

    return html`<div
      class="loomi-viewport ${axis} ${this.blurredEdges ? "has-blurred-edges" : ""}"
    >
      <div
        class="loomi-track ${axis} direction-${direction} ${ready ? "is-ready" : ""} ${
          this.pauseOnHover ? "pause-on-hover" : ""
        }"
        style=${this.trackStyle}
        @click=${this.onTrackClick}
        @animationend=${this.onAnimationEnd}
      >
        <div class="loomi-group primary"><slot @slotchange=${this.onSlotChange}></slot></div>
        <div class="loomi-group clone" aria-hidden="true"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-scroller": LoomiScroller;
  }

  interface HTMLElementEventMap {
    "loomi-scroller-item-click": CustomEvent<LoomiScrollerItemClickDetail>;
    "loomi-scroll-complete": CustomEvent<LoomiScrollerScrollCompleteDetail>;
  }
}
