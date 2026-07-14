/** Matches the WAI-ARIA APG's usual definition of "focusable" for a focus trap. */
export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Walks into nested shadow roots to find the actually-focused element. */
export function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

/**
 * Keeps Tab/Shift+Tab cycling within `focusable` — the shared focus-trap logic behind
 * `@loomidev/modal`'s dialog and `@loomidev/lightbox`'s fullscreen viewer. Call this only
 * once you've already confirmed `event.key === "Tab"`; building the `focusable` list
 * itself stays local to each component, since the right order (e.g. a shadow-DOM close
 * button before slotted body content before footer buttons) is component-specific.
 */
export function trapTabFocus(event: KeyboardEvent, focusable: readonly HTMLElement[]): void {
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }
  const current = deepActiveElement();
  const index = focusable.indexOf(current as HTMLElement);
  if (event.shiftKey) {
    if (index <= 0) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    }
  } else if (index === -1 || index === focusable.length - 1) {
    event.preventDefault();
    focusable[0].focus();
  }
}

/**
 * Moves an overlay element to `document.body` while open, and back to its original DOM
 * position when closed — the shared mechanism behind `@loomidev/modal` and
 * `@loomidev/lightbox` reparenting themselves so they always paint above everything
 * else, regardless of where the author placed the tag.
 *
 * Reparenting a *connected* custom element fires disconnectedCallback/connectedCallback
 * synchronously. Guard your own teardown logic (releasing a scroll lock, tearing down
 * listeners) in `disconnectedCallback` with `isMovingInDom` so it doesn't fire during
 * this internal move.
 */
export class OverlayReparent {
  isMovingInDom = false;
  private originalParent: Node | null = null;
  private originalNextSibling: ChildNode | null = null;

  constructor(private readonly el: HTMLElement) {}

  moveToBody(): void {
    if (this.el.parentNode === document.body) return;
    this.originalParent = this.el.parentNode;
    this.originalNextSibling = this.el.nextSibling;
    this.isMovingInDom = true;
    document.body.appendChild(this.el);
    this.isMovingInDom = false;
  }

  restore(): void {
    if (!this.originalParent) return;
    const nextSibling =
      this.originalNextSibling?.parentNode === this.originalParent
        ? this.originalNextSibling
        : null;
    this.isMovingInDom = true;
    if ((this.originalParent as Node).isConnected) {
      (this.originalParent as ParentNode).insertBefore(this.el, nextSibling);
    }
    this.isMovingInDom = false;
    this.originalParent = null;
    this.originalNextSibling = null;
  }
}
