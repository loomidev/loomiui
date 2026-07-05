import { html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LoomiElement, loomiStyles, accentVars, onClickOutside, type LoomiColor } from "@loomidev/core";
import "@loomidev/button/loomi-button.js";
import "@loomidev/icon/loomi-icon.js";
import "@loomidev/slider/loomi-slider.js";
import "@loomidev/spinner/loomi-spinner.js";
import type { LoomiSlider } from "@loomidev/slider";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiVideoPreload = "none" | "metadata" | "auto";
export type LoomiVideoFit = "contain" | "cover" | "fill";
export type LoomiVideoCrossOrigin = "" | "anonymous" | "use-credentials";

const SEEK_STEP_SECONDS = 5;
const VOLUME_STEP = 0.1;
const AUTOHIDE_DELAY_MS = 2500;

const ERROR_MESSAGES: Record<number, string> = {
  1: "Playback was aborted.",
  2: "A network error occurred while loading this video.",
  3: "This video could not be decoded.",
  4: "This video format isn't supported.",
};

/** Same "default true, but a string attribute can still turn it off" converter used by
 * `@loomidev/slider`'s `show-tooltip`/`show-values` — lets `autohide-controls="false"` win
 * over the property default without needing a whole boolean-attribute-removal dance. */
const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false" && value !== "0";
  },
};

function formatTime(totalSeconds: number): string {
  const safe = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 0;
  const whole = Math.floor(safe);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  const ss = String(seconds).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/**
 * `<loomi-video>` — a themeable wrapper around the native `<video>` element. Renders the
 * browser's real media element under the hood (so every codec/format/network quirk is
 * handled by the platform), and layers a themeable, keyboard-accessible control bar on
 * top — built from `@loomidev/button` and `@loomidev/slider` — instead of the raw native
 * control UI. Set `controls` to opt into it; without it, this is just a styled `<video>`.
 *
 * `<source>` and `<track>` children are moved onto the real internal `<video>` element
 * (Shadow DOM slotting can't make a native media element discover them itself), so
 * multi-format fallback and subtitle/caption tracks work exactly like plain HTML.
 *
 * @slot - `<source>`/`<track>` children, forwarded onto the internal `<video>`.
 * @slot controls - Replaces the entire built-in control bar with custom markup.
 * @csspart video - The internal `<video>` element.
 * @csspart controls - The control bar container.
 * @fires play - Playback started (mirrors the native event; the internal `<video>` is
 *   shadow-encapsulated, so this is how consumers observe it).
 * @fires pause - Playback paused.
 * @fires ended - Playback reached the end.
 * @fires timeupdate - `detail: { currentTime, duration }`.
 * @fires volumechange - `detail: { volume, muted }`.
 * @fires fullscreenchange - `detail: { fullscreen }`.
 * @fires enterpictureinpicture / leavepictureinpicture
 * @fires video-error - `detail: { code, message }`. Not named "error" — that event
 *   type bubbling to `window` is conventionally read as an uncaught page error by test
 *   harnesses and error-tracking tools.
 */
@customElement("loomi-video")
export class LoomiVideo extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() src = "";
  @property() poster = "";
  /** Shows the themed control bar, loading spinner, error state, and click-to-play
   * overlay. Left unset, this is a bare, unstyled passthrough to `<video>` — matching
   * native `<video>` (no `controls` attribute = no interactive UI at all). */
  @property({ type: Boolean, reflect: true }) controls = false;
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Number }) volume = 1;
  @property() preload: LoomiVideoPreload = "metadata";
  /** Defaults to `true` (unlike native `<video>`) because without it, iOS Safari hijacks
   * `play()` into its own native fullscreen player — which would hide our control bar
   * entirely. Set `playsinline="false"` to opt back into that native behavior. */
  @property({ type: Boolean, converter: booleanAttribute }) playsinline = true;
  @property() crossOrigin: LoomiVideoCrossOrigin = "";
  /** Accent color for the control bar (play button, seek/volume sliders, focus ring). */
  @property() color: LoomiColor = "primary" as LoomiColor;
  @property({ attribute: "aspect-ratio" }) aspectRatio = "16 / 9";
  @property() fit: LoomiVideoFit = "contain";
  /** Hide the control bar after a few seconds of inactivity while playing. */
  @property({ type: Boolean, attribute: "autohide-controls", converter: booleanAttribute })
  autohideControls = true;
  @property({ type: Boolean, attribute: "disable-pip" }) disablePip = false;
  @property({ type: Boolean, attribute: "disable-fullscreen" }) disableFullscreen = false;

  @state() private playing = false;
  @state() private buffering = false;
  @state() private errored = false;
  @state() private errorMessage = "";
  @state() private playbackTime = 0;
  @state() private mediaDuration = NaN;
  @state() private isFullscreen = false;
  @state() private isPiP = false;
  @state() private controlsVisible = true;
  @state() private scrubbing = false;
  @state() private previewTime = 0;
  @state() private showCaptionsMenu = false;
  @state() private activeTrackIndex = -1;
  @state() private tracksTick = 0;
  /** False until just after the first render commits, then flipped once — guaranteeing
   * one extra render pass where `@query`-backed getters (like `pipAvailable`) see a real
   * `<video>` element. Without this, a video with no tracks, no error, and default
   * volume/muted never gets a second render, so anything computed from `this.videoEl`
   * at render time stays frozen at its (always-null-`videoEl`) first-render value. */
  @state() private mediaReady = false;

  @query("video") private videoEl?: HTMLVideoElement;
  @query(".loomi-cc-group") private ccGroupEl?: HTMLElement;

  private mutationObserver?: MutationObserver;
  private hideTimer = 0;
  private closeCaptionsMenuCleanup: (() => void) | null = null;
  private progressFrame = 0;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
    this.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("fullscreenchange", this.onFullscreenChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("fullscreenchange", this.onFullscreenChange);
    this.mutationObserver?.disconnect();
    this.clearHideTimer();
    this.closeCaptionsMenu();
    this.stopProgressLoop();
    this.releaseMedia();
  }

  /** Detaches listeners and aborts the underlying network/decode resources. Merely
   * removing a `<video>` from the DOM does not release those on its own — leaving
   * enough un-aborted media elements behind (e.g. across many short-lived instances)
   * can exhaust the browser's media pipeline. */
  private releaseMedia(): void {
    const video = this.videoEl;
    if (!video) return;
    video.removeEventListener("play", this.onPlay);
    video.removeEventListener("pause", this.onPause);
    video.removeEventListener("ended", this.onEnded);
    video.removeEventListener("timeupdate", this.onTimeUpdate);
    video.removeEventListener("durationchange", this.onDurationChange);
    video.removeEventListener("loadedmetadata", this.onLoadedMetadata);
    video.removeEventListener("waiting", this.onWaiting);
    video.removeEventListener("playing", this.onCanPlay);
    video.removeEventListener("canplay", this.onCanPlay);
    video.removeEventListener("volumechange", this.onVolumeChange);
    video.removeEventListener("error", this.onMediaError);
    video.removeEventListener("enterpictureinpicture", this.onEnterPiP);
    video.removeEventListener("leavepictureinpicture", this.onLeavePiP);
    video.pause();
    video.removeAttribute("src");
    video.load();
    const list = video.textTracks;
    list.removeEventListener("addtrack", this.onTracksChange);
    list.removeEventListener("removetrack", this.onTracksChange);
    list.removeEventListener("change", this.onTracksChange);
  }

  protected override firstUpdated(): void {
    const video = this.videoEl;
    if (!video) return;
    video.addEventListener("play", this.onPlay);
    video.addEventListener("pause", this.onPause);
    video.addEventListener("ended", this.onEnded);
    video.addEventListener("timeupdate", this.onTimeUpdate);
    video.addEventListener("durationchange", this.onDurationChange);
    video.addEventListener("loadedmetadata", this.onLoadedMetadata);
    video.addEventListener("waiting", this.onWaiting);
    video.addEventListener("playing", this.onCanPlay);
    video.addEventListener("canplay", this.onCanPlay);
    video.addEventListener("volumechange", this.onVolumeChange);
    video.addEventListener("error", this.onMediaError);
    video.addEventListener("enterpictureinpicture", this.onEnterPiP);
    video.addEventListener("leavepictureinpicture", this.onLeavePiP);

    this.volume = video.volume;
    this.syncMediaChildren();
    this.mutationObserver = new MutationObserver(() => this.syncMediaChildren());
    this.mutationObserver.observe(this, { childList: true });
    this.mediaReady = true;
  }

  // ---- public, imperative API (mirrors the parts of HTMLVideoElement that make sense
  // to expose from behind the Shadow DOM boundary) ----

  get paused(): boolean {
    return this.videoEl?.paused ?? true;
  }
  get ended(): boolean {
    return this.videoEl?.ended ?? false;
  }
  get currentTime(): number {
    return this.videoEl?.currentTime ?? 0;
  }
  set currentTime(value: number) {
    this.seek(value);
  }
  get duration(): number {
    return this.videoEl?.duration ?? NaN;
  }

  play(): void {
    this.videoEl?.play().catch(() => {});
  }
  pause(): void {
    this.videoEl?.pause();
  }
  togglePlay(): void {
    const video = this.videoEl;
    if (!video || this.errored) return;
    if (video.paused || video.ended) this.play();
    else this.pause();
  }
  seek(seconds: number): void {
    const video = this.videoEl;
    if (!video) return;
    const max = this.hasSeekableDuration ? this.mediaDuration : Number.MAX_SAFE_INTEGER;
    video.currentTime = Math.min(max, Math.max(0, seconds));
  }
  toggleMute(): void {
    const video = this.videoEl;
    if (video) video.muted = !video.muted;
  }
  setVolume(value: number): void {
    const video = this.videoEl;
    if (!video) return;
    const clamped = Math.min(1, Math.max(0, value));
    video.volume = clamped;
    video.muted = clamped === 0;
  }
  async toggleFullscreen(): Promise<void> {
    if (this.disableFullscreen) return;
    if (document.fullscreenElement === this) await document.exitFullscreen();
    else await this.requestFullscreen().catch(() => {});
  }
  async togglePictureInPicture(): Promise<void> {
    const video = this.videoEl;
    if (!video || !this.pipAvailable) return;
    if (document.pictureInPictureElement === video) await document.exitPictureInPicture();
    else await video.requestPictureInPicture().catch(() => {});
  }

  // ---- derived render state ----

  private get displayTime(): number {
    return this.scrubbing ? this.previewTime : this.playbackTime;
  }
  private get hasSeekableDuration(): boolean {
    return Number.isFinite(this.mediaDuration) && this.mediaDuration > 0;
  }
  private get isLiveStream(): boolean {
    return this.mediaDuration === Infinity;
  }
  private get pipAvailable(): boolean {
    return (
      this.mediaReady &&
      !this.disablePip &&
      typeof document !== "undefined" &&
      "pictureInPictureEnabled" in document &&
      document.pictureInPictureEnabled &&
      typeof this.videoEl?.requestPictureInPicture === "function"
    );
  }
  private get tracks(): Array<{ label: string }> {
    void this.tracksTick; // read so this getter re-evaluates whenever tracks structurally change
    const list = this.videoEl?.textTracks;
    if (!list) return [];
    return Array.from(list).map((track, index) => ({
      label: track.label || track.language || `Track ${index + 1}`,
    }));
  }
  private get hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  // ---- <source>/<track> forwarding ----

  private syncMediaChildren(): void {
    const video = this.videoEl;
    if (!video) return;
    const nodes = Array.from(this.children).filter(
      (el): el is HTMLSourceElement | HTMLTrackElement =>
        el.tagName === "SOURCE" || el.tagName === "TRACK",
    );
    if (nodes.length === 0) return;
    for (const node of nodes) video.appendChild(node);
    this.watchTracks();
  }

  private watchTracks(): void {
    const list = this.videoEl?.textTracks;
    if (!list) return;
    list.addEventListener("addtrack", this.onTracksChange);
    list.addEventListener("removetrack", this.onTracksChange);
    list.addEventListener("change", this.onTracksChange);
    this.onTracksChange();
  }

  private onTracksChange = (): void => {
    const list = this.videoEl?.textTracks;
    this.activeTrackIndex = list
      ? Array.from(list).findIndex((track) => track.mode === "showing")
      : -1;
    this.tracksTick += 1;
  };

  selectTrack(index: number): void {
    const list = this.videoEl?.textTracks;
    if (!list) return;
    for (let i = 0; i < list.length; i += 1) list[i].mode = i === index ? "showing" : "disabled";
    this.activeTrackIndex = index;
    this.closeCaptionsMenu();
  }

  // ---- media element event handlers ----

  private onPlay = (): void => {
    this.playing = true;
    this.errored = false;
    this.showControlsTemporarily();
    this.startProgressLoop();
    this.dispatchEvent(new Event("play", { bubbles: true, composed: true }));
  };
  private onPause = (): void => {
    this.playing = false;
    this.controlsVisible = true;
    this.clearHideTimer();
    this.stopProgressLoop();
    this.dispatchEvent(new Event("pause", { bubbles: true, composed: true }));
  };
  private onEnded = (): void => {
    this.playing = false;
    this.controlsVisible = true;
    this.clearHideTimer();
    this.stopProgressLoop();
    this.dispatchEvent(new Event("ended", { bubbles: true, composed: true }));
  };
  // The native `timeupdate` event fires only a few times a second (spec leaves the
  // exact rate up to the browser), which reads as the seek bar visibly hopping between
  // positions rather than gliding. While playing, `startProgressLoop` instead polls the
  // always-current `video.currentTime` on every animation frame for smooth motion;
  // `timeupdate` still drives `playbackTime` the rest of the time (paused seeks, etc).
  private startProgressLoop(): void {
    this.stopProgressLoop();
    const tick = (): void => {
      if (!this.scrubbing && this.videoEl) this.playbackTime = this.videoEl.currentTime;
      this.progressFrame = requestAnimationFrame(tick);
    };
    this.progressFrame = requestAnimationFrame(tick);
  }
  private stopProgressLoop(): void {
    if (!this.progressFrame) return;
    cancelAnimationFrame(this.progressFrame);
    this.progressFrame = 0;
  }
  private onTimeUpdate = (): void => {
    const video = this.videoEl!;
    if (!this.scrubbing && !this.progressFrame) this.playbackTime = video.currentTime;
    this.dispatchEvent(
      new CustomEvent("timeupdate", {
        bubbles: true,
        composed: true,
        detail: { currentTime: video.currentTime, duration: video.duration },
      }),
    );
  };
  private onDurationChange = (): void => {
    this.mediaDuration = this.videoEl!.duration;
  };
  private onLoadedMetadata = (): void => {
    this.mediaDuration = this.videoEl!.duration;
    this.buffering = false;
  };
  private onWaiting = (): void => {
    this.buffering = true;
  };
  private onCanPlay = (): void => {
    this.buffering = false;
  };
  private onVolumeChange = (): void => {
    const video = this.videoEl!;
    this.volume = video.volume;
    this.muted = video.muted;
    this.dispatchEvent(
      new CustomEvent("volumechange", {
        bubbles: true,
        composed: true,
        detail: { volume: video.volume, muted: video.muted },
      }),
    );
  };
  private onMediaError = (): void => {
    const error = this.videoEl?.error;
    this.errored = true;
    this.buffering = false;
    this.errorMessage = (error && ERROR_MESSAGES[error.code]) || "Something went wrong playing this video.";
    this.dispatchEvent(
      // Not named "error": that event type bubbling all the way to `window` gets
      // misread as an uncaught page error by test harnesses and error-tracking tools
      // (both listen for a bare "error" reaching `window`), which isn't what this is.
      new CustomEvent("video-error", {
        bubbles: true,
        composed: true,
        detail: { code: error?.code, message: this.errorMessage },
      }),
    );
  };
  private onEnterPiP = (): void => {
    this.isPiP = true;
    this.dispatchEvent(new Event("enterpictureinpicture", { bubbles: true, composed: true }));
  };
  private onLeavePiP = (): void => {
    this.isPiP = false;
    this.dispatchEvent(new Event("leavepictureinpicture", { bubbles: true, composed: true }));
  };
  private onFullscreenChange = (): void => {
    this.isFullscreen = document.fullscreenElement === this;
    this.dispatchEvent(
      new CustomEvent("fullscreenchange", {
        bubbles: true,
        composed: true,
        detail: { fullscreen: this.isFullscreen },
      }),
    );
  };
  private onRetry = (): void => {
    this.errored = false;
    this.errorMessage = "";
    this.videoEl?.load();
  };

  // ---- interaction ----

  private onSurfaceClick = (): void => {
    if (!this.controls || this.errored) return;
    this.togglePlay();
  };
  private onSurfaceDblClick = (): void => {
    if (!this.controls || this.disableFullscreen) return;
    void this.toggleFullscreen();
  };

  private onSeekInput = (event: Event): void => {
    this.scrubbing = true;
    this.previewTime = (event.target as LoomiSlider).selected;
  };
  private onSeekChange = (event: Event): void => {
    const value = (event.target as LoomiSlider).selected;
    this.scrubbing = false;
    this.seek(value);
  };
  private onVolumeInput = (event: Event): void => {
    this.setVolume((event.target as LoomiSlider).selected);
  };

  private onToggleCaptionsMenu = (): void => {
    if (this.showCaptionsMenu) this.closeCaptionsMenu();
    else this.openCaptionsMenu();
  };
  private openCaptionsMenu(): void {
    this.showCaptionsMenu = true;
    if (this.ccGroupEl) {
      this.closeCaptionsMenuCleanup = onClickOutside(this.ccGroupEl, () => this.closeCaptionsMenu());
    }
  }
  private closeCaptionsMenu(): void {
    this.showCaptionsMenu = false;
    this.closeCaptionsMenuCleanup?.();
    this.closeCaptionsMenuCleanup = null;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const origin = event.composedPath()[0];
    // Native range inputs (the seek/volume sliders) handle their own arrow keys; a
    // focused button's own Space/Enter activation already calls the right handler via
    // its `click` listener, so don't double-fire it from here.
    if (origin instanceof HTMLInputElement) return;
    if ((event.key === " " || event.key === "Enter") && origin instanceof HTMLButtonElement) return;

    switch (event.key) {
      case " ":
      case "k":
        event.preventDefault();
        this.togglePlay();
        break;
      case "ArrowRight":
        event.preventDefault();
        this.seek(this.playbackTime + SEEK_STEP_SECONDS);
        break;
      case "ArrowLeft":
        event.preventDefault();
        this.seek(this.playbackTime - SEEK_STEP_SECONDS);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.setVolume((this.muted ? 0 : this.volume) + VOLUME_STEP);
        break;
      case "ArrowDown":
        event.preventDefault();
        this.setVolume((this.muted ? 0 : this.volume) - VOLUME_STEP);
        break;
      case "m":
        event.preventDefault();
        this.toggleMute();
        break;
      case "f":
        event.preventDefault();
        void this.toggleFullscreen();
        break;
      case "c":
        if (this.hasTracks) {
          event.preventDefault();
          this.selectTrack(this.activeTrackIndex === -1 ? 0 : -1);
        }
        break;
      case "Home":
        event.preventDefault();
        this.seek(0);
        break;
      case "End":
        if (this.hasSeekableDuration) {
          event.preventDefault();
          this.seek(this.mediaDuration);
        }
        break;
      default:
        break;
    }
  };

  // ---- control bar autohide ----

  private onActivity = (): void => {
    this.showControlsTemporarily();
  };
  private onPointerLeave = (): void => {
    if (this.playing && this.autohideControls) this.scheduleHideControls(300);
  };
  private showControlsTemporarily(): void {
    this.controlsVisible = true;
    this.clearHideTimer();
    if (this.playing && this.autohideControls) this.scheduleHideControls(AUTOHIDE_DELAY_MS);
  }
  private scheduleHideControls(delay: number): void {
    this.clearHideTimer();
    this.hideTimer = window.setTimeout(() => {
      if (this.showCaptionsMenu || this.matches(":focus-within")) return;
      this.controlsVisible = false;
    }, delay);
  }
  private clearHideTimer(): void {
    if (!this.hideTimer) return;
    window.clearTimeout(this.hideTimer);
    this.hideTimer = 0;
  }

  // ---- render ----

  override render(): TemplateResult {
    const wrapStyle = `${accentVars(this.color)}aspect-ratio: ${this.aspectRatio};`;
    return html`<div
      class="loomi-video ${this.controlsVisible ? "" : "controls-hidden"}"
      style=${wrapStyle}
      @pointermove=${this.onActivity}
      @focusin=${this.onActivity}
      @mouseleave=${this.onPointerLeave}
    >
      <video
        part="video"
        class="loomi-media fit-${this.fit}"
        tabindex="-1"
        src=${ifDefined(this.src || undefined)}
        poster=${ifDefined(this.poster || undefined)}
        ?autoplay=${this.autoplay}
        ?loop=${this.loop}
        .muted=${this.muted}
        .volume=${this.volume}
        preload=${this.preload}
        .crossOrigin=${this.crossOrigin || null}
        ?playsinline=${this.playsinline}
        ?webkit-playsinline=${this.playsinline}
        @click=${this.onSurfaceClick}
        @dblclick=${this.onSurfaceDblClick}
      ></video>

      ${this.controls ? this.renderChrome() : nothing}
    </div>`;
  }

  private renderChrome(): TemplateResult {
    return html`
      ${this.buffering && !this.errored ? this.renderLoading() : nothing}
      ${this.errored ? this.renderError() : nothing}
      ${!this.errored && !this.buffering ? this.renderCenterPlay() : nothing}
      <div class="loomi-scrim" aria-hidden="true"></div>
      ${this.renderControlsBar()}
    `;
  }

  private renderLoading(): TemplateResult {
    return html`<div class="loomi-overlay loomi-loading" part="loading">
      <loomi-spinner size="big" type="spinner" color=${this.color} label="Loading"></loomi-spinner>
    </div>`;
  }

  private renderError(): TemplateResult {
    return html`<div class="loomi-overlay loomi-error" part="error" role="alert">
      <loomi-icon name="exclamation-circle" size="2.5rem"></loomi-icon>
      <p class="loomi-error-message">${this.errorMessage}</p>
      <loomi-button color=${this.color} icon="arrow-path" @click=${this.onRetry}>Retry</loomi-button>
    </div>`;
  }

  private renderCenterPlay(): TemplateResult | typeof nothing {
    if (this.playing) return nothing;
    // The icon goes in the default slot (as a real <loomi-icon>) rather than via
    // loomi-button's `icon` attribute for two reasons: it lets this one button use the
    // solid/filled icon set instead of outline, and it keeps the button's flex row down
    // to a single slotted item — with `icon` set, the (invisible) sr-only label span
    // became a second flex sibling, and the gap between it and the icon pushed the icon
    // visibly off-center inside the circle.
    return html`<div class="loomi-center">
      <loomi-button
        class="loomi-center-play"
        color=${this.color}
        radius="full"
        size="big"
        @click=${this.togglePlay}
        ><loomi-icon name=${this.ended ? "arrow-path" : "play"} variant="solid" size="1.6rem"></loomi-icon
        ><span class="loomi-sr-only">${this.ended ? "Replay" : "Play"}</span></loomi-button
      >
    </div>`;
  }

  private renderControlsBar(): TemplateResult {
    const barStyle = `${accentVars(this.color)}--loomi-surface-border: rgba(255, 255, 255, 0.35);`;
    return html`<div
      class="loomi-controls-bar ${this.controlsVisible ? "" : "is-hidden"}"
      part="controls"
      style=${barStyle}
    >
      <slot name="controls">
        <button
          class="loomi-ctrl-btn"
          type="button"
          aria-label=${this.playing ? "Pause" : "Play"}
          @click=${this.togglePlay}
        >
          <loomi-icon name=${this.playing ? "pause" : "play"} size="1.15rem"></loomi-icon>
        </button>

        ${this.renderTimeline()}

        <div class="loomi-volume-group">
          <button
            class="loomi-ctrl-btn"
            type="button"
            aria-label=${this.muted || this.volume === 0 ? "Unmute" : "Mute"}
            @click=${this.toggleMute}
          >
            <loomi-icon
              name=${this.muted || this.volume === 0 ? "speaker-x-mark" : "speaker-wave"}
              size="1.15rem"
            ></loomi-icon>
          </button>
          <loomi-slider
            class="loomi-volume"
            color=${this.color}
            min="0"
            max="1"
            step="0.05"
            .selected=${this.muted ? 0 : this.volume}
            show-tooltip="false"
            show-values="false"
            aria-label="Volume"
            @input=${this.onVolumeInput}
          ></loomi-slider>
        </div>

        ${this.hasTracks
          ? html`<div class="loomi-cc-group">
              <button
                class="loomi-ctrl-btn ${this.activeTrackIndex >= 0 ? "is-active" : ""}"
                type="button"
                aria-label="Captions"
                aria-expanded=${this.showCaptionsMenu ? "true" : "false"}
                @click=${this.onToggleCaptionsMenu}
              >
                <loomi-icon name="language" size="1.15rem"></loomi-icon>
              </button>
              ${this.showCaptionsMenu ? this.renderCaptionsMenu() : nothing}
            </div>`
          : nothing}
        ${this.pipAvailable
          ? html`<button
              class="loomi-ctrl-btn"
              type="button"
              aria-label=${this.isPiP ? "Exit picture-in-picture" : "Picture-in-picture"}
              @click=${this.togglePictureInPicture}
            >
              <loomi-icon name="rectangle-group" size="1.1rem"></loomi-icon>
            </button>`
          : nothing}
        ${!this.disableFullscreen
          ? html`<button
              class="loomi-ctrl-btn"
              type="button"
              aria-label=${this.isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              @click=${this.toggleFullscreen}
            >
              <loomi-icon
                name=${this.isFullscreen ? "arrows-pointing-in" : "arrows-pointing-out"}
                size="1.15rem"
              ></loomi-icon>
            </button>`
          : nothing}
      </slot>
    </div>`;
  }

  private renderTimeline(): TemplateResult {
    if (this.isLiveStream) {
      return html`<span class="loomi-live-badge">LIVE</span>
        <div class="loomi-spacer"></div>`;
    }
    if (!this.hasSeekableDuration) return html`<div class="loomi-spacer"></div>`;
    return html`<span class="loomi-time" aria-hidden="true">${formatTime(this.displayTime)}</span>
      <loomi-slider
        class="loomi-seek"
        color=${this.color}
        min="0"
        max=${this.mediaDuration}
        step="0.1"
        .selected=${this.displayTime}
        show-tooltip="false"
        show-values="false"
        aria-label="Seek"
        @input=${this.onSeekInput}
        @change=${this.onSeekChange}
      ></loomi-slider>
      <span class="loomi-time" aria-hidden="true">${formatTime(this.mediaDuration)}</span>`;
  }

  private renderCaptionsMenu(): TemplateResult {
    return html`<div class="loomi-cc-menu" role="menu">
      <button
        class="loomi-cc-item ${this.activeTrackIndex === -1 ? "is-selected" : ""}"
        role="menuitemradio"
        aria-checked=${this.activeTrackIndex === -1 ? "true" : "false"}
        @click=${() => this.selectTrack(-1)}
      >
        Off
      </button>
      ${this.tracks.map(
        (track, index) => html`<button
          class="loomi-cc-item ${this.activeTrackIndex === index ? "is-selected" : ""}"
          role="menuitemradio"
          aria-checked=${this.activeTrackIndex === index ? "true" : "false"}
          @click=${() => this.selectTrack(index)}
        >
          ${track.label}
        </button>`,
      )}
    </div>`;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-video": LoomiVideo;
  }
}
