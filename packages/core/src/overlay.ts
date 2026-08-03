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

/**
 * Whether `el` can be promoted to the top layer with the popover API.
 *
 * The top layer is what keeps a floating panel out of an ancestor's `overflow` and
 * stacking contexts. Panels still work without it — they fall back to plain
 * `position: fixed`, which only loses to a transformed ancestor — so callers should
 * degrade rather than refuse to open.
 */
export function supportsPopover(el: HTMLElement): boolean {
  return typeof (el as HTMLElement & { showPopover?: unknown }).showPopover === "function";
}

/** Where a floating panel may sit relative to its anchor. */
export type LoomiPanelPlacement = "auto" | "bottom-start" | "bottom-end" | "top-start" | "top-end";

/** Which side a panel actually ended up on. */
export type LoomiResolvedSide = "top" | "bottom";

/** Which side of its anchor row a submenu opened on. */
export type LoomiSubmenuSide = "left" | "right";

/** Gap between an anchor and its panel. */
const PANEL_GAP = 6;

/** How close to the viewport edge a panel may come. */
const VIEWPORT_MARGIN = 8;

/**
 * Places a floating panel beside its anchor, in viewport coordinates.
 *
 * Menus, dropdowns and popovers all face the same two problems: an ancestor
 * with `overflow` clips them, and near a viewport edge they need to flip or
 * shift to stay on screen. Both are solved by taking the panel out of flow —
 * `position: fixed`, ideally with `popover`, so it escapes `overflow` and
 * stacking contexts — and then writing its coordinates here.
 *
 * The panel must already be laid out (visible, or in the top layer) when this
 * is called: its measured height is what decides whether it flips above. It may
 * still be mid-entrance-animation — the measurement below ignores transforms.
 *
 * Returns the side it settled on, so the caller can point an arrow the right
 * way or animate from the right direction.
 */
export function positionFloatingPanel(
  anchor: HTMLElement,
  panel: HTMLElement,
  placement: LoomiPanelPlacement = "auto",
): LoomiResolvedSide {
  const anchorRect = anchor.getBoundingClientRect();
  // `offsetWidth`/`offsetHeight` rather than a rect: this runs in the same task the panel
  // is revealed in, so its entrance animation is at its first keyframe and a rect would
  // come back shrunk by the `scale()` and shifted by the `translateY()` (see
  // `motionStyles`) — enough to misjudge a flip and land the panel a few pixels off.
  const panelSize = { width: panel.offsetWidth, height: panel.offsetHeight };
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

  const fitsBelow =
    anchorRect.bottom + PANEL_GAP + panelSize.height <= viewportHeight - VIEWPORT_MARGIN;
  const fitsAbove = anchorRect.top - PANEL_GAP - panelSize.height >= VIEWPORT_MARGIN;
  const prefersTop = placement.startsWith("top");
  // Flipping is a last resort below, and a preference above: a menu asked to
  // open upwards should, unless there is no room for it there.
  const onTop = prefersTop ? fitsAbove || !fitsBelow : !fitsBelow && fitsAbove;

  const prefersEnd = placement === "auto" || placement.endsWith("-end");
  const endAligned = anchorRect.right - panelSize.width;
  const startAligned = anchorRect.left;

  let left = prefersEnd ? endAligned : startAligned;
  // Swap alignment rather than merely clamping: a panel pinned to the viewport
  // edge reads as detached from the control that opened it.
  if (left < VIEWPORT_MARGIN) left = startAligned;
  if (left + panelSize.width > viewportWidth - VIEWPORT_MARGIN) left = endAligned;
  const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN - panelSize.width);
  left = Math.min(Math.max(left, VIEWPORT_MARGIN), maxLeft);

  const top = onTop ? anchorRect.top - PANEL_GAP - panelSize.height : anchorRect.bottom + PANEL_GAP;

  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;
  panel.style.setProperty("--loomi-anchor-width", `${Math.round(anchorRect.width)}px`);

  return onTop ? "top" : "bottom";
}

/**
 * Places a submenu beside the menu row that opened it, in viewport coordinates.
 *
 * The sibling of `positionFloatingPanel` for the one case it can't express: a submenu
 * belongs to the *side* of its anchor, not above or below it. It opens to the right and
 * flips to the left when that would run off screen, and slides up when it is taller than
 * the room beneath the row.
 *
 * Same preconditions as `positionFloatingPanel`: the panel must be laid out (visible, or
 * in the top layer), and it may still be mid-entrance-animation — the measurement below
 * ignores transforms.
 *
 * Returns the side it settled on. Pass that back as `prefer` for a *nested* submenu, so a
 * chain that had to flip keeps going the same way instead of zig-zagging back over its
 * own parent.
 */
export function positionFloatingSubmenu(
  anchor: HTMLElement,
  panel: HTMLElement,
  options: { prefer?: LoomiSubmenuSide } = {},
): LoomiSubmenuSide {
  const anchorRect = anchor.getBoundingClientRect();
  const width = panel.offsetWidth;
  const height = panel.offsetHeight;
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

  const rightX = anchorRect.right + PANEL_GAP;
  const leftX = anchorRect.left - PANEL_GAP - width;
  const fitsRight = rightX + width <= viewportWidth - VIEWPORT_MARGIN;
  const fitsLeft = leftX >= VIEWPORT_MARGIN;
  // Same shape as the vertical flip: a last resort to the right, a preference to the left.
  const onLeft = options.prefer === "left" ? fitsLeft || !fitsRight : !fitsRight && fitsLeft;

  const maxLeft = Math.max(VIEWPORT_MARGIN, viewportWidth - VIEWPORT_MARGIN - width);
  const left = Math.min(Math.max(onLeft ? leftX : rightX, VIEWPORT_MARGIN), maxLeft);

  // Line the submenu's first row up with the row that opened it, which means starting a
  // panel padding *above* the row — otherwise the two read as visibly misaligned.
  const panelStyle = getComputedStyle(panel);
  const topInset =
    (Number.parseFloat(panelStyle.paddingTop) || 0) +
    (Number.parseFloat(panelStyle.borderTopWidth) || 0);
  const maxTop = Math.max(VIEWPORT_MARGIN, viewportHeight - VIEWPORT_MARGIN - height);
  const top = Math.min(Math.max(anchorRect.top - topInset, VIEWPORT_MARGIN), maxTop);

  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;

  return onLeft ? "left" : "right";
}
