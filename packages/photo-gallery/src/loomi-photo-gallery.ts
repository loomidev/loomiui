import { css, html, nothing, type PropertyValues, type TemplateResult, isServer } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  LoomiElement,
  loomiStyles,
  loomiT,
  accentVars,
  lockBodyScroll,
  unlockBodyScroll,
  type LoomiColor,
} from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiPhotoGalleryAlbumView = "sidebar" | "thumbnails";

const MIN_THUMB_SIZE = 96;
const MAX_THUMB_SIZE = 320;
const THUMB_STEP = 32;
const DEFAULT_THUMB_SIZE = 160;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;
const DEFAULT_SLIDESHOW_INTERVAL = 3000;
const TOAST_DURATION_MS = 2200;
const ALL_ALBUM = "";

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

/** Walks into nested shadow roots to find the actually-focused element. */
function deepActiveElement(): Element | null {
  let el: Element | null = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * `<loomi-photo-gallery-item>` — one photo inside a `<loomi-photo-gallery>`. A plain data
 * holder (like `<option>`) — it never renders itself; the gallery reads its attributes to
 * draw the grid tile and lightbox view.
 */
@customElement("loomi-photo-gallery-item")
export class LoomiPhotoGalleryItem extends LoomiElement {
  static override styles = [loomiStyles(componentStyles), css`:host { display: none; }`];

  /** Full-size image URL, shown in the lightbox. */
  @property() src = "";
  /** Grid thumbnail URL. Falls back to `src` when omitted. */
  @property() thumb = "";
  /** Accessible text and lightbox caption fallback. */
  @property() alt = "";
  /** Album/group name. Left blank, the photo only shows up under "All". */
  @property() album = "";
  /** Caption shown under the image in the lightbox. Falls back to `alt`. */
  @property() caption = "";
  /** Whether this photo is favourited. Settable up front or toggled from the UI. */
  @property({ type: Boolean, reflect: true, converter: booleanAttribute }) favourite = false;

  override render(): typeof nothing {
    return nothing;
  }
}

/**
 * `<loomi-photo-gallery>` — an album grid built from `<loomi-photo-gallery-item>` children,
 * with a toolbar (album list, zoom, square thumbnails, slideshow) and a full-size lightbox
 * viewer (zoom, rotate, favourite, share) opened by clicking a photo. Every toolbar icon can
 * be hidden individually via its `show-*` attribute.
 *
 * @slot - `<loomi-photo-gallery-item>` children.
 * @fires loomi-favourite - `detail: { index, src, favourite }`.
 * @fires loomi-photo-open - Lightbox opened. `detail: { index, src }`.
 * @fires loomi-photo-close - Lightbox closed.
 * @fires loomi-photo-change - Navigated to another photo in the lightbox. `detail: { index, src }`.
 * @fires loomi-rotate - `detail: { index, rotation }` (cumulative degrees).
 * @fires loomi-share - `detail: { index, src }`, fired before the native share sheet/clipboard fallback runs.
 * @fires loomi-slideshow-start / loomi-slideshow-end
 * @fires loomi-album-change - `detail: { album }` (`""` means "All").
 */
@customElement("loomi-photo-gallery")
export class LoomiPhotoGallery extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() locale = "";
  @property() color: LoomiColor = "primary" as LoomiColor;
  /** Visual style of the album list panel when it's open. */
  @property({ attribute: "album-view" }) albumView: LoomiPhotoGalleryAlbumView = "sidebar";
  /** Force every grid thumbnail to a 1:1 square crop instead of its natural aspect ratio. */
  @property({
    type: Boolean,
    attribute: "square-thumbnails",
    reflect: true,
    converter: booleanAttribute,
  })
  squareThumbnails = false;
  /** Grid thumbnail size in pixels. Adjusted by the zoom in/out buttons. */
  @property({ type: Number, attribute: "thumb-size" }) thumbSize = DEFAULT_THUMB_SIZE;
  /** Milliseconds between slides while the slideshow is running. */
  @property({ type: Number, attribute: "slideshow-interval" }) slideshowInterval =
    DEFAULT_SLIDESHOW_INTERVAL;
  /** Whether the album list panel is currently open. Only rendered when there's more than one album. */
  @property({
    type: Boolean,
    attribute: "album-panel-open",
    reflect: true,
    converter: booleanAttribute,
  })
  albumPanelOpen = true;

  /** Show the toolbar button that toggles the album list panel. */
  @property({ type: Boolean, attribute: "show-album-toggle", converter: booleanAttribute })
  showAlbumToggle = true;
  /** Show the grid zoom-in toolbar button. */
  @property({ type: Boolean, attribute: "show-zoom-in", converter: booleanAttribute }) showZoomIn =
    true;
  /** Show the grid zoom-out toolbar button. */
  @property({ type: Boolean, attribute: "show-zoom-out", converter: booleanAttribute })
  showZoomOut = true;
  /** Show the square-thumbnails toggle button. */
  @property({ type: Boolean, attribute: "show-square-toggle", converter: booleanAttribute })
  showSquareToggle = true;
  /** Show the slideshow toolbar button. */
  @property({ type: Boolean, attribute: "show-slideshow", converter: booleanAttribute })
  showSlideshow = true;

  /** Show the lightbox zoom-in button. */
  @property({ type: Boolean, attribute: "lightbox-show-zoom-in", converter: booleanAttribute })
  lightboxShowZoomIn = true;
  /** Show the lightbox zoom-out button. */
  @property({ type: Boolean, attribute: "lightbox-show-zoom-out", converter: booleanAttribute })
  lightboxShowZoomOut = true;
  /** Show the lightbox favourite button. */
  @property({ type: Boolean, attribute: "lightbox-show-favourite", converter: booleanAttribute })
  lightboxShowFavourite = true;
  /** Show the lightbox rotate-left button. */
  @property({ type: Boolean, attribute: "lightbox-show-rotate", converter: booleanAttribute })
  lightboxShowRotate = true;
  /** Show the lightbox share button. */
  @property({ type: Boolean, attribute: "lightbox-show-share", converter: booleanAttribute })
  lightboxShowShare = true;
  /** Show the lightbox close button. Escape and clicking the backdrop still close it either way. */
  @property({ type: Boolean, attribute: "lightbox-show-close", converter: booleanAttribute })
  lightboxShowClose = true;

  @state() private activeAlbum = ALL_ALBUM;
  @state() private lightboxIndex = -1;
  @state() private lightboxZoom = MIN_ZOOM;
  @state() private lightboxRotation = 0;
  @state() private slideshowActive = false;
  @state() private toastMessage = "";

  private previouslyFocused: HTMLElement | null = null;
  private originalParent: Node | null = null;
  private originalNextSibling: ChildNode | null = null;
  private hasScrollLock = false;
  private isMovingInDom = false;
  private slideshowTimer = 0;
  private toastTimer = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.onKeyDown);
    // moveToDocumentBody()/restoreOriginalPosition() reparent this element while it stays
    // connected, but appendChild()/insertBefore() still synchronously fire a disconnect +
    // reconnect pair around that move — without this guard, opening the lightbox (which
    // reparents to document.body) would immediately stop a slideshow started moments earlier.
    if (!this.isMovingInDom) {
      this.stopSlideshow();
      this.releaseScrollLock();
    }
    window.clearTimeout(this.toastTimer);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("thumbSize")) {
      this.thumbSize = clamp(this.thumbSize, MIN_THUMB_SIZE, MAX_THUMB_SIZE);
    }
  }

  // ---- data ----

  private get items(): LoomiPhotoGalleryItem[] {
    // Light DOM is not readable during server rendering; hydration fills this in on the client.
    if (isServer) return [];
    return Array.from(this.querySelectorAll("loomi-photo-gallery-item"));
  }

  /** Distinct album names in first-seen order (blank/unset albums are excluded — they only show under "All"). */
  private get albums(): string[] {
    const seen = new Set<string>();
    for (const item of this.items) if (item.album) seen.add(item.album);
    return Array.from(seen);
  }

  private get hasAlbums(): boolean {
    return this.albums.length > 0;
  }

  /** The photos visible in the grid and navigable in the lightbox, filtered by `activeAlbum`. */
  private get visibleItems(): LoomiPhotoGalleryItem[] {
    if (this.activeAlbum === ALL_ALBUM) return this.items;
    return this.items.filter((item) => item.album === this.activeAlbum);
  }

  private albumCount(album: string): number {
    return album === ALL_ALBUM
      ? this.items.length
      : this.items.filter((item) => item.album === album).length;
  }

  private onSlotChange = (): void => {
    this.requestUpdate();
  };

  // ---- favourites ----

  private toggleFavourite(item: LoomiPhotoGalleryItem, index: number): void {
    item.favourite = !item.favourite;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("loomi-favourite", {
        detail: { index, src: item.src, favourite: item.favourite },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ---- toolbar actions ----

  private setActiveAlbum(album: string): void {
    if (this.activeAlbum === album) return;
    this.activeAlbum = album;
    this.dispatchEvent(
      new CustomEvent("loomi-album-change", { detail: { album }, bubbles: true, composed: true }),
    );
  }

  private toggleAlbumPanel = (): void => {
    this.albumPanelOpen = !this.albumPanelOpen;
  };

  private zoomInGrid = (): void => {
    this.thumbSize = clamp(this.thumbSize + THUMB_STEP, MIN_THUMB_SIZE, MAX_THUMB_SIZE);
  };
  private zoomOutGrid = (): void => {
    this.thumbSize = clamp(this.thumbSize - THUMB_STEP, MIN_THUMB_SIZE, MAX_THUMB_SIZE);
  };
  private toggleSquareThumbnails = (): void => {
    this.squareThumbnails = !this.squareThumbnails;
  };

  private toggleSlideshow = (): void => {
    if (this.slideshowActive) this.stopSlideshow();
    else this.startSlideshow();
  };

  startSlideshow(): void {
    if (this.slideshowActive || !this.visibleItems.length) return;
    this.slideshowActive = true;
    if (this.lightboxIndex < 0) this.openLightbox(0);
    this.dispatchEvent(new Event("loomi-slideshow-start", { bubbles: true, composed: true }));
    this.scheduleSlideshowTick();
  }

  stopSlideshow(): void {
    window.clearTimeout(this.slideshowTimer);
    if (!this.slideshowActive) return;
    this.slideshowActive = false;
    this.dispatchEvent(new Event("loomi-slideshow-end", { bubbles: true, composed: true }));
  }

  private scheduleSlideshowTick(): void {
    window.clearTimeout(this.slideshowTimer);
    this.slideshowTimer = window.setTimeout(() => {
      if (!this.slideshowActive) return;
      this.nextPhoto(true);
      this.scheduleSlideshowTick();
    }, this.slideshowInterval);
  }

  // ---- lightbox ----

  openLightbox(index: number): void {
    const list = this.visibleItems;
    if (!list.length) return;
    this.previouslyFocused = deepActiveElement() as HTMLElement | null;
    this.moveToDocumentBody();
    this.lightboxIndex = clamp(index, 0, list.length - 1);
    this.lightboxZoom = MIN_ZOOM;
    this.lightboxRotation = 0;
    this.acquireScrollLock();
    this.dispatchEvent(
      new CustomEvent("loomi-photo-open", {
        detail: { index: this.lightboxIndex, src: list[this.lightboxIndex].src },
        bubbles: true,
        composed: true,
      }),
    );
    this.updateComplete.then(() => {
      this.shadowRoot
        ?.querySelector<HTMLElement>(".loomi-lightbox-close, .loomi-lightbox")
        ?.focus();
    });
  }

  closeLightbox = (): void => {
    if (this.lightboxIndex < 0) return;
    this.stopSlideshow();
    this.lightboxIndex = -1;
    this.releaseScrollLock();
    this.restoreOriginalPosition();
    this.previouslyFocused?.focus();
    this.previouslyFocused = null;
    this.dispatchEvent(new Event("loomi-photo-close", { bubbles: true, composed: true }));
  };

  nextPhoto(fromSlideshow = false): void {
    if (!fromSlideshow) this.stopSlideshow();
    const list = this.visibleItems;
    if (!list.length || this.lightboxIndex < 0) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % list.length;
    this.lightboxZoom = MIN_ZOOM;
    this.lightboxRotation = 0;
    this.dispatchEvent(
      new CustomEvent("loomi-photo-change", {
        detail: { index: this.lightboxIndex, src: list[this.lightboxIndex].src },
        bubbles: true,
        composed: true,
      }),
    );
  }

  prevPhoto(): void {
    this.stopSlideshow();
    const list = this.visibleItems;
    if (!list.length || this.lightboxIndex < 0) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + list.length) % list.length;
    this.lightboxZoom = MIN_ZOOM;
    this.lightboxRotation = 0;
    this.dispatchEvent(
      new CustomEvent("loomi-photo-change", {
        detail: { index: this.lightboxIndex, src: list[this.lightboxIndex].src },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private zoomInLightbox = (): void => {
    this.lightboxZoom = clamp(this.lightboxZoom + ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
  };
  private zoomOutLightbox = (): void => {
    this.lightboxZoom = clamp(this.lightboxZoom - ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
  };

  /** Rotates 90° further left on every call — cumulative, so it keeps spinning rather than
   * snapping back to 0 (which would animate a jarring reverse spin). Resets only when the
   * lightbox moves to a different photo. */
  private rotateLeft = (): void => {
    this.lightboxRotation -= 90;
    this.dispatchEvent(
      new CustomEvent("loomi-rotate", {
        detail: { index: this.lightboxIndex, rotation: this.lightboxRotation },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private onShare = async (): Promise<void> => {
    const item = this.visibleItems[this.lightboxIndex];
    if (!item) return;
    this.dispatchEvent(
      new CustomEvent("loomi-share", {
        detail: { index: this.lightboxIndex, src: item.src },
        bubbles: true,
        composed: true,
      }),
    );
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: item.alt || undefined, url: item.src });
      } catch {
        // User cancelled the share sheet, or the platform rejected it — nothing to recover from.
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(item.src);
        this.showToast(loomiT("photoGallery.linkCopied", {}, this.locale));
      } catch {
        // Clipboard permission denied — the loomi-share event above is still the extension point.
      }
    }
  };

  private showToast(message: string): void {
    window.clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastTimer = window.setTimeout(() => {
      this.toastMessage = "";
    }, TOAST_DURATION_MS);
  }

  private acquireScrollLock(): void {
    if (this.hasScrollLock) return;
    lockBodyScroll();
    this.hasScrollLock = true;
  }
  private releaseScrollLock(): void {
    if (!this.hasScrollLock) return;
    unlockBodyScroll();
    this.hasScrollLock = false;
  }

  private moveToDocumentBody(): void {
    if (this.parentNode === document.body) return;
    this.originalParent = this.parentNode;
    this.originalNextSibling = this.nextSibling;
    this.isMovingInDom = true;
    document.body.appendChild(this);
    this.isMovingInDom = false;
  }
  private restoreOriginalPosition(): void {
    if (!this.originalParent) return;
    const nextSibling =
      this.originalNextSibling?.parentNode === this.originalParent
        ? this.originalNextSibling
        : null;
    this.isMovingInDom = true;
    if (this.originalParent.isConnected) this.originalParent.insertBefore(this, nextSibling);
    this.isMovingInDom = false;
    this.originalParent = null;
    this.originalNextSibling = null;
  }

  private containsFocus(): boolean {
    const active = deepActiveElement();
    if (!active) return false;
    return active === this || this.contains(active) || (this.shadowRoot?.contains(active) ?? false);
  }

  private getLightboxFocusable(): HTMLElement[] {
    return Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>(`.loomi-lightbox ${FOCUSABLE_SELECTOR}`) ?? [],
    );
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (this.lightboxIndex < 0 || !this.containsFocus()) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.closeLightbox();
        return;
      case "ArrowRight":
        e.preventDefault();
        this.nextPhoto();
        return;
      case "ArrowLeft":
        e.preventDefault();
        this.prevPhoto();
        return;
      case "+":
      case "=":
        if (this.lightboxShowZoomIn) {
          e.preventDefault();
          this.zoomInLightbox();
        }
        return;
      case "-":
        if (this.lightboxShowZoomOut) {
          e.preventDefault();
          this.zoomOutLightbox();
        }
        return;
      case "r":
        if (this.lightboxShowRotate) {
          e.preventDefault();
          this.rotateLeft();
        }
        return;
      case "Tab": {
        const focusable = this.getLightboxFocusable();
        if (!focusable.length) return;
        const current = deepActiveElement();
        const index = focusable.indexOf(current as HTMLElement);
        if (e.shiftKey) {
          if (index <= 0) {
            e.preventDefault();
            focusable[focusable.length - 1].focus();
          }
        } else if (index === -1 || index === focusable.length - 1) {
          e.preventDefault();
          focusable[0].focus();
        }
        return;
      }
      default:
        return;
    }
  };

  private onBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this.closeLightbox();
  };

  // ---- render: toolbar ----

  private renderToolbar(): TemplateResult {
    const t = (key: string) => loomiT(`photoGallery.${key}`, {}, this.locale);
    return html`
      <div class="loomi-toolbar" role="toolbar" aria-label=${t("toolbar")}>
        ${
          this.showAlbumToggle && this.hasAlbums
            ? html`<button
              class="loomi-toolbar-btn ${this.albumPanelOpen ? "is-active" : ""}"
              type="button"
              aria-pressed=${this.albumPanelOpen ? "true" : "false"}
              aria-label=${this.albumPanelOpen ? t("hideAlbums") : t("showAlbums")}
              title=${this.albumPanelOpen ? t("hideAlbums") : t("showAlbums")}
              @click=${this.toggleAlbumPanel}
            >
              <loomi-icon name="bars-3" size="1.1rem"></loomi-icon>
            </button>`
            : nothing
        }
        ${
          this.showZoomOut
            ? html`<button
              class="loomi-toolbar-btn"
              type="button"
              ?disabled=${this.thumbSize <= MIN_THUMB_SIZE}
              aria-label=${t("zoomOut")}
              title=${t("zoomOut")}
              @click=${this.zoomOutGrid}
            >
              <loomi-icon name="magnifying-glass-minus" size="1.1rem"></loomi-icon>
            </button>`
            : nothing
        }
        ${
          this.showZoomIn
            ? html`<button
              class="loomi-toolbar-btn"
              type="button"
              ?disabled=${this.thumbSize >= MAX_THUMB_SIZE}
              aria-label=${t("zoomIn")}
              title=${t("zoomIn")}
              @click=${this.zoomInGrid}
            >
              <loomi-icon name="magnifying-glass-plus" size="1.1rem"></loomi-icon>
            </button>`
            : nothing
        }
        ${
          this.showSquareToggle
            ? html`<button
              class="loomi-toolbar-btn ${this.squareThumbnails ? "is-active" : ""}"
              type="button"
              aria-pressed=${this.squareThumbnails ? "true" : "false"}
              aria-label=${this.squareThumbnails ? t("naturalThumbnails") : t("squareThumbnails")}
              title=${this.squareThumbnails ? t("naturalThumbnails") : t("squareThumbnails")}
              @click=${this.toggleSquareThumbnails}
            >
              <loomi-icon name="squares-2-x-2" size="1.1rem"></loomi-icon>
            </button>`
            : nothing
        }
        ${
          this.showSlideshow
            ? html`<button
              class="loomi-toolbar-btn ${this.slideshowActive ? "is-active" : ""}"
              type="button"
              ?disabled=${!this.visibleItems.length}
              aria-pressed=${this.slideshowActive ? "true" : "false"}
              aria-label=${this.slideshowActive ? t("stopSlideshow") : t("startSlideshow")}
              title=${this.slideshowActive ? t("stopSlideshow") : t("startSlideshow")}
              @click=${this.toggleSlideshow}
            >
              <loomi-icon name=${this.slideshowActive ? "pause" : "play"} size="1.1rem"></loomi-icon>
            </button>`
            : nothing
        }
      </div>
    `;
  }

  // ---- render: album panel ----

  private renderAlbumButton(
    album: string,
    label: string,
    thumbSrc: string,
    style: LoomiPhotoGalleryAlbumView,
  ): TemplateResult {
    const active = this.activeAlbum === album;
    return html`
      <button
        class="loomi-album-btn ${style} ${active ? "is-active" : ""}"
        type="button"
        aria-pressed=${active ? "true" : "false"}
        @click=${() => this.setActiveAlbum(album)}
      >
        ${style === "thumbnails" && thumbSrc ? html`<img class="loomi-album-thumb" src=${thumbSrc} alt="" />` : nothing}
        <span class="loomi-album-label">${label}</span>
        <span class="loomi-album-count">${this.albumCount(album)}</span>
      </button>
    `;
  }

  private renderAlbumPanel(): TemplateResult | typeof nothing {
    if (!this.hasAlbums || !this.albumPanelOpen) return nothing;
    const style = this.albumView;
    const items = this.items;
    const firstThumbFor = (album: string): string => {
      const match = album === ALL_ALBUM ? items[0] : items.find((item) => item.album === album);
      return match ? match.thumb || match.src : "";
    };
    return html`
      <div class="loomi-albums ${style}" role="list" aria-label=${loomiT("photoGallery.albums", {}, this.locale)}>
        ${this.renderAlbumButton(ALL_ALBUM, loomiT("photoGallery.allAlbum", {}, this.locale), firstThumbFor(ALL_ALBUM), style)}
        ${this.albums.map((album) => this.renderAlbumButton(album, album, firstThumbFor(album), style))}
      </div>
    `;
  }

  // ---- render: grid ----

  private renderGrid(): TemplateResult {
    const list = this.visibleItems;
    if (!list.length) {
      return html`<div class="loomi-empty">${loomiT("photoGallery.empty", {}, this.locale)}</div>`;
    }
    return html`
      <div class="loomi-grid ${this.squareThumbnails ? "is-square" : ""}" style="--loomi-pg-tile: ${this.thumbSize}px">
        ${list.map((item, index) => this.renderTile(item, index))}
      </div>
    `;
  }

  private renderTile(item: LoomiPhotoGalleryItem, index: number): TemplateResult {
    const label = item.alt || loomiT("photoGallery.openPhoto", {}, this.locale);
    const favLabel = item.favourite
      ? loomiT("photoGallery.unfavourite", {}, this.locale)
      : loomiT("photoGallery.favourite", {}, this.locale);
    return html`
      <div class="loomi-tile">
        <button class="loomi-tile-btn" type="button" aria-label=${label} @click=${() => this.openLightbox(index)}>
          <img class="loomi-tile-img" src=${item.thumb || item.src} alt=${item.alt} loading="lazy" />
        </button>
        <button
          class="loomi-fav-btn ${item.favourite ? "is-active" : ""}"
          type="button"
          aria-pressed=${item.favourite ? "true" : "false"}
          aria-label=${favLabel}
          title=${favLabel}
          @click=${(e: MouseEvent) => {
            e.stopPropagation();
            this.toggleFavourite(item, index);
          }}
        >
          <loomi-icon name="heart" variant=${item.favourite ? "solid" : "outline"} size="1.05rem"></loomi-icon>
        </button>
      </div>
    `;
  }

  // ---- render: lightbox ----

  private renderLightbox(): TemplateResult | typeof nothing {
    if (this.lightboxIndex < 0) return nothing;
    const list = this.visibleItems;
    const item = list[this.lightboxIndex];
    if (!item) return nothing;
    const t = (key: string, params: Record<string, string | number> = {}) =>
      loomiT(`photoGallery.${key}`, params, this.locale);
    const favLabel = item.favourite ? t("unfavourite") : t("favourite");
    const imgStyle = `transform: scale(${this.lightboxZoom}) rotate(${this.lightboxRotation}deg);`;

    return html`
      <div
        class="loomi-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label=${t("dialog")}
        style=${accentVars(this.color)}
        tabindex="-1"
        @click=${this.onBackdropClick}
      >
        <div class="loomi-lightbox-toolbar" role="toolbar" aria-label=${t("lightboxToolbar")}>
          <span class="loomi-lightbox-counter">${t("counter", { current: this.lightboxIndex + 1, total: list.length })}</span>
          <div class="loomi-lightbox-actions">
            ${
              this.lightboxShowZoomOut
                ? html`<button
                  class="loomi-lightbox-btn"
                  type="button"
                  ?disabled=${this.lightboxZoom <= MIN_ZOOM}
                  aria-label=${t("zoomOut")}
                  title=${t("zoomOut")}
                  @click=${this.zoomOutLightbox}
                >
                  <loomi-icon name="magnifying-glass-minus" size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
            ${
              this.lightboxShowZoomIn
                ? html`<button
                  class="loomi-lightbox-btn"
                  type="button"
                  ?disabled=${this.lightboxZoom >= MAX_ZOOM}
                  aria-label=${t("zoomIn")}
                  title=${t("zoomIn")}
                  @click=${this.zoomInLightbox}
                >
                  <loomi-icon name="magnifying-glass-plus" size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
            ${
              this.lightboxShowFavourite
                ? html`<button
                  class="loomi-lightbox-btn ${item.favourite ? "is-active" : ""}"
                  type="button"
                  aria-pressed=${item.favourite ? "true" : "false"}
                  aria-label=${favLabel}
                  title=${favLabel}
                  @click=${() => this.toggleFavourite(item, this.lightboxIndex)}
                >
                  <loomi-icon name="heart" variant=${item.favourite ? "solid" : "outline"} size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
            ${
              this.lightboxShowRotate
                ? html`<button
                  class="loomi-lightbox-btn"
                  type="button"
                  aria-label=${t("rotate")}
                  title=${t("rotate")}
                  @click=${this.rotateLeft}
                >
                  <loomi-icon name="arrow-uturn-left" size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
            ${
              this.lightboxShowShare
                ? html`<button class="loomi-lightbox-btn" type="button" aria-label=${t("share")} title=${t("share")} @click=${this.onShare}>
                  <loomi-icon name="share" size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
            ${
              this.lightboxShowClose
                ? html`<button
                  class="loomi-lightbox-btn loomi-lightbox-close"
                  type="button"
                  aria-label=${t("close")}
                  title=${t("close")}
                  @click=${this.closeLightbox}
                >
                  <loomi-icon name="x-mark" size="1.15rem"></loomi-icon>
                </button>`
                : nothing
            }
          </div>
        </div>

        <div class="loomi-lightbox-stage">
          ${
            list.length > 1
              ? html`<button class="loomi-lightbox-nav prev" type="button" aria-label=${t("previous")} @click=${() => this.prevPhoto()}>
                <loomi-icon name="chevron-left" size="1.5rem"></loomi-icon>
              </button>`
              : nothing
          }
          <img class="loomi-lightbox-img" src=${item.src} alt=${item.alt} style=${imgStyle} />
          ${
            list.length > 1
              ? html`<button class="loomi-lightbox-nav next" type="button" aria-label=${t("next")} @click=${() => this.nextPhoto()}>
                <loomi-icon name="chevron-right" size="1.5rem"></loomi-icon>
              </button>`
              : nothing
          }
        </div>

        ${item.caption || item.alt ? html`<div class="loomi-lightbox-caption">${item.caption || item.alt}</div>` : nothing}
        ${this.toastMessage ? html`<div class="loomi-toast" role="status" aria-live="polite">${this.toastMessage}</div>` : nothing}
      </div>
    `;
  }

  // ---- render ----

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.onSlotChange} class="loomi-sr-only"></slot>
      ${this.renderToolbar()}
      <div class="loomi-body ${this.hasAlbums && this.albumPanelOpen ? `has-albums ${this.albumView}` : ""}">
        ${this.renderAlbumPanel()}
        ${this.renderGrid()}
      </div>
      ${this.renderLightbox()}
    `;
  }
}

export interface LoomiPhotoGalleryPhotoDetail {
  index: number;
  src: string;
}

export interface LoomiPhotoGalleryFavouriteDetail {
  index: number;
  src: string;
  favourite: boolean;
}

export interface LoomiPhotoGalleryAlbumChangeDetail {
  album: string;
}

export interface LoomiPhotoGalleryRotateDetail {
  index: number;
  rotation: number;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-photo-gallery-item": LoomiPhotoGalleryItem;
    "loomi-photo-gallery": LoomiPhotoGallery;
  }

  interface HTMLElementEventMap {
    "loomi-favourite": CustomEvent<LoomiPhotoGalleryFavouriteDetail>;
    "loomi-album-change": CustomEvent<LoomiPhotoGalleryAlbumChangeDetail>;
    "loomi-photo-open": CustomEvent<LoomiPhotoGalleryPhotoDetail>;
    "loomi-photo-change": CustomEvent<LoomiPhotoGalleryPhotoDetail>;
    "loomi-photo-close": Event;
    "loomi-rotate": CustomEvent<LoomiPhotoGalleryRotateDetail>;
    "loomi-share": CustomEvent<LoomiPhotoGalleryPhotoDetail>;
    "loomi-slideshow-start": Event;
    "loomi-slideshow-end": Event;
  }
}
