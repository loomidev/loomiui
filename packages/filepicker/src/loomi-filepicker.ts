import { html, nothing, svg, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { LoomiElement, loomiDefaultText, loomiStyles, loomiT } from "@loomidev/core";
import { componentStyles } from "./generated/styles.css.js";

const UPLOAD = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 7.5 7.5 12M12 7.5v9" />`;
const FILE = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />`;
const X = svg`<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />`;
const DEFAULT_PLACEHOLDER_LINE1 = "Choose files or drag and drop to upload";
const DEFAULT_PLACEHOLDER_LINE2 = "%s up to %s";
const MIN_CROP_SIZE = 24;

export type LoomiCropAspectRatio = "16:9" | "4:3" | "2:3" | "1:1" | "free";

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CropSession {
  file: File;
  url: string;
  displayW: number;
  displayH: number;
  naturalW: number;
  naturalH: number;
}

const booleanAttribute = {
  fromAttribute(value: string | null): boolean {
    return value !== null && value.toLowerCase() !== "false";
  },
  toAttribute(value: boolean): string | null {
    return value ? "" : null;
  },
};

function parseSize(s: string): number {
  const m = s.trim().toLowerCase().match(/^([\d.]+)\s*(kb|mb|gb)?$/);
  if (!m) return Infinity;
  const n = parseFloat(m[1]);
  return n * { kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, "": 1 }[m[2] ?? ""]!;
}
function human(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), Math.max(min, max));
}
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("loomi-filepicker: unable to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * `<loomi-filepicker>` — a drag-and-drop file picker with previews. Keeps a real
 * `<input type="file">` in sync (set `name` and submit inside a `<form>` with
 * `enctype="multipart/form-data"`). A lightweight, dependency-free take on BladewindUI's
 * Filepond wrapper.
 *
 * @fires change - `detail: { files }` whenever the selection changes.
 */
@customElement("loomi-filepicker")
export class LoomiFilepicker extends LoomiElement {
  static override styles = loomiStyles(componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private cropResolve: ((file: File | null) => void) | null = null;
  private cropPreviouslyFocused: HTMLElement | null = null;
  private cropDrag: { mode: "move" | "resize"; startX: number; startY: number; rect: CropRect } | null = null;

  @property({ reflect: true }) name = "";
  @property({ attribute: "accepted-file-types" }) acceptedFileTypes = "image/*,application/pdf";
  @property({ attribute: "placeholder-line1" }) placeholderLine1 = DEFAULT_PLACEHOLDER_LINE1;
  @property({ attribute: "placeholder-line2" }) placeholderLine2 = DEFAULT_PLACEHOLDER_LINE2;
  @property() locale = "";
  @property({ type: Number, attribute: "max-files" }) maxFiles = 1;
  @property({ attribute: "max-file-size" }) maxFileSize = "5mb";
  @property({ type: Boolean, attribute: "can-browse", converter: booleanAttribute }) canBrowse = true;
  @property({ type: Boolean, attribute: "can-drop", converter: booleanAttribute }) canDrop = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, attribute: "show-image-preview", converter: booleanAttribute })
  showImagePreview = true;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, converter: booleanAttribute }) crop = false;
  @property({ attribute: "crop-aspect-ratio" }) cropAspectRatio: LoomiCropAspectRatio = "16:9";
  @property({ type: Boolean, converter: booleanAttribute }) resize = false;
  @property({ type: Number, attribute: "resize-width" }) resizeWidth = 0;
  @property({ type: Number, attribute: "resize-height" }) resizeHeight = 0;

  @state() private files: File[] = [];
  @state() private over = false;
  @state() private cropping: CropSession | null = null;
  @state() private cropRect: CropRect = { x: 0, y: 0, w: 0, h: 0 };
  @query("input") private input!: HTMLInputElement;
  @query(".loomi-crop-img") private cropImgEl?: HTMLImageElement;

  /** Currently selected files. */
  get selectedFiles(): File[] {
    return this.files;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this.onKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointermove", this.onCropPointerMove);
    window.removeEventListener("pointerup", this.onCropPointerUp);
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (
      changed.has("files") ||
      changed.has("required") ||
      changed.has("disabled") ||
      changed.has("name")
    ) {
      this.syncFormValue();
      this.syncValidity();
    }
  }

  protected override updated(changed: Map<string, unknown>): void {
    if (changed.has("cropping") && this.cropping && !changed.get("cropping")) {
      this.shadowRoot?.querySelector<HTMLButtonElement>(".loomi-crop-btn.apply")?.focus();
    }
  }

  validate(): boolean {
    this.validationVisible = true;
    return this.syncValidity(true);
  }

  checkValidity(): boolean {
    this.syncValidity();
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    this.validationVisible = true;
    this.syncValidity(true);
    return this.internals.reportValidity();
  }

  private syncFormValue(): void {
    if (!this.name || this.files.length === 0) {
      this.internals.setFormValue(null);
      return;
    }

    const data = new FormData();
    const name = this.maxFiles > 1 ? `${this.name}[]` : this.name;
    for (const file of this.files) data.append(name, file);
    this.internals.setFormValue(data);
  }

  private syncValidity(showInvalid = this.validationVisible): boolean {
    const empty = this.required && !this.disabled && this.files.length === 0;
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? loomiT("validation.selectFile", {}, this.locale) : "";
    if (this.input) this.internals.setValidity(validity, message, this.input);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private syncInput(): void {
    const dt = new DataTransfer();
    for (const f of this.files) dt.items.add(f);
    if (this.input) this.input.files = dt.files;
    this.syncFormValue();
    this.syncValidity();
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { files: this.files } }));
  }

  private async add(list: FileList | null): Promise<void> {
    if (!list || this.disabled) return;
    const limit = parseSize(this.maxFileSize);
    const candidates: File[] = [];
    let count = this.files.length;
    for (const f of Array.from(list)) {
      if (f.size > limit) continue;
      if (count >= this.maxFiles) break;
      candidates.push(f);
      count++;
    }
    if (!candidates.length) return;

    const accepted: File[] = [];
    for (const f of candidates) {
      const result = await this.processFile(f);
      if (result) accepted.push(result);
    }
    if (!accepted.length) return;
    this.files = [...this.files, ...accepted];
    this.syncInput();
  }

  /** Runs a single accepted file through the optional crop and resize pipeline. */
  private async processFile(file: File): Promise<File | null> {
    let result: File = file;
    if (this.crop && this.isImage(result)) {
      const cropped = await this.cropImage(result);
      if (!cropped) return null;
      result = cropped;
    }
    if (this.resize && this.isImage(result)) {
      result = await this.resizeImage(result);
    }
    return result;
  }

  private removeFile(i: number): void {
    this.files = this.files.filter((_, idx) => idx !== i);
    this.syncInput();
  }

  private onDrop(e: DragEvent): void {
    e.preventDefault();
    this.over = false;
    if (this.canDrop && !this.disabled && !this.cropping) this.add(e.dataTransfer?.files ?? null);
  }

  private placeholder2(): string {
    return loomiDefaultText(
      this.placeholderLine2,
      DEFAULT_PLACEHOLDER_LINE2,
      "filepicker.placeholderLine2",
      this.locale,
    ).replace("%s", this.acceptedFileTypes).replace("%s", this.maxFileSize);
  }

  private isImage(f: File): boolean {
    return f.type.startsWith("image/");
  }

  // ---- cropping ----

  private aspectRatioValue(): number | null {
    if (this.cropAspectRatio === "free") return null;
    const m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(this.cropAspectRatio);
    const ratio = m ? parseFloat(m[1]) / parseFloat(m[2]) : NaN;
    return ratio > 0 ? ratio : 16 / 9;
  }

  private defaultCropRect(dispW: number, dispH: number): CropRect {
    const ratio = this.aspectRatioValue();
    if (ratio === null) {
      const w = dispW * 0.8;
      const h = dispH * 0.8;
      return { x: (dispW - w) / 2, y: (dispH - h) / 2, w, h };
    }
    let w = dispW;
    let h = w / ratio;
    if (h > dispH) {
      h = dispH;
      w = h * ratio;
    }
    return { x: (dispW - w) / 2, y: (dispH - h) / 2, w, h };
  }

  private cropImage(file: File): Promise<File | null> {
    return new Promise((resolve) => {
      this.cropPreviouslyFocused = document.activeElement as HTMLElement | null;
      this.cropResolve = resolve;
      this.cropping = {
        file,
        url: URL.createObjectURL(file),
        displayW: 0,
        displayH: 0,
        naturalW: 0,
        naturalH: 0,
      };
    });
  }

  private onCropImageLoad(e: Event): void {
    if (!this.cropping) return;
    const img = e.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();
    this.cropping = {
      ...this.cropping,
      displayW: rect.width,
      displayH: rect.height,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    };
    this.cropRect = this.defaultCropRect(rect.width, rect.height);
  }

  private onCropPointerDown(e: PointerEvent, mode: "move" | "resize"): void {
    e.preventDefault();
    e.stopPropagation();
    this.cropDrag = { mode, startX: e.clientX, startY: e.clientY, rect: { ...this.cropRect } };
    window.addEventListener("pointermove", this.onCropPointerMove);
    window.addEventListener("pointerup", this.onCropPointerUp);
  }

  private onCropPointerMove = (e: PointerEvent): void => {
    if (!this.cropDrag || !this.cropping) return;
    const { displayW, displayH } = this.cropping;
    const dx = e.clientX - this.cropDrag.startX;
    const dy = e.clientY - this.cropDrag.startY;
    const start = this.cropDrag.rect;

    if (this.cropDrag.mode === "move") {
      const x = clamp(start.x + dx, 0, displayW - start.w);
      const y = clamp(start.y + dy, 0, displayH - start.h);
      this.cropRect = { ...start, x, y };
      return;
    }

    const ratio = this.aspectRatioValue();
    let w = clamp(start.w + dx, MIN_CROP_SIZE, displayW - start.x);
    let h: number;
    if (ratio === null) {
      h = clamp(start.h + dy, MIN_CROP_SIZE, displayH - start.y);
    } else {
      h = w / ratio;
      const maxH = displayH - start.y;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
    }
    this.cropRect = { ...start, w, h };
  };

  private onCropPointerUp = (): void => {
    this.cropDrag = null;
    window.removeEventListener("pointermove", this.onCropPointerMove);
    window.removeEventListener("pointerup", this.onCropPointerUp);
  };

  private onCropBackdropClick = (e: MouseEvent): void => {
    if (e.target === e.currentTarget) this.cancelCrop();
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.cropping) this.cancelCrop();
  };

  private cancelCrop(): void {
    this.finishCrop(null);
  }

  private async applyCrop(): Promise<void> {
    const session = this.cropping;
    const img = this.cropImgEl;
    if (!session || !img || !session.displayW || !session.naturalW) return;

    const scaleX = session.naturalW / session.displayW;
    const scaleY = session.naturalH / session.displayH;
    const sx = this.cropRect.x * scaleX;
    const sy = this.cropRect.y * scaleY;
    const sw = this.cropRect.w * scaleX;
    const sh = this.cropRect.h * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      this.finishCrop(session.file);
      return;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    const type = session.file.type || "image/png";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type));
    this.finishCrop(blob ? new File([blob], session.file.name, { type: blob.type, lastModified: Date.now() }) : session.file);
  }

  private finishCrop(file: File | null): void {
    const resolve = this.cropResolve;
    const session = this.cropping;
    this.cropResolve = null;
    this.cropping = null;
    this.cropDrag = null;
    if (session) URL.revokeObjectURL(session.url);
    this.cropPreviouslyFocused?.focus();
    this.cropPreviouslyFocused = null;
    resolve?.(file);
  }

  // ---- resizing (silent — no UI) ----

  private async resizeImage(file: File): Promise<File> {
    if (this.resizeWidth <= 0 && this.resizeHeight <= 0) return file;
    let img: HTMLImageElement;
    try {
      img = await loadImageElement(file);
    } catch {
      return file;
    }

    const scaleW = this.resizeWidth > 0 ? this.resizeWidth / img.naturalWidth : Infinity;
    const scaleH = this.resizeHeight > 0 ? this.resizeHeight / img.naturalHeight : Infinity;
    const scale = Math.min(scaleW, scaleH);
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    let blob: Blob | null = null;
    if (ctx) {
      ctx.drawImage(img, 0, 0, w, h);
      const type = file.type || "image/png";
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type));
    }
    URL.revokeObjectURL(img.src);
    return blob ? new File([blob], file.name, { type: blob.type, lastModified: Date.now() }) : file;
  }

  private renderCropModal(session: CropSession): TemplateResult {
    const title = loomiT("filepicker.cropTitle", {}, this.locale);
    return html`<div class="loomi-crop-backdrop" @click=${this.onCropBackdropClick}>
      <div class="loomi-crop-dialog" role="dialog" aria-modal="true" aria-label=${title} tabindex="-1">
        <div class="loomi-crop-title">${title}</div>
        <div class="loomi-crop-stage">
          <img
            class="loomi-crop-img"
            src=${session.url}
            alt=""
            @load=${(e: Event) => this.onCropImageLoad(e)}
            @error=${() => this.finishCrop(session.file)}
          />
          ${session.displayW
            ? html`<div
                class="loomi-crop-rect"
                style=${`left:${this.cropRect.x}px;top:${this.cropRect.y}px;width:${this.cropRect.w}px;height:${this.cropRect.h}px;`}
                @pointerdown=${(e: PointerEvent) => this.onCropPointerDown(e, "move")}
              >
                <span class="loomi-crop-handle" @pointerdown=${(e: PointerEvent) => this.onCropPointerDown(e, "resize")}></span>
              </div>`
            : nothing}
        </div>
        <div class="loomi-crop-actions">
          <button type="button" class="loomi-crop-btn cancel" @click=${() => this.cancelCrop()}>
            ${loomiT("filepicker.cropCancel", {}, this.locale)}
          </button>
          <button type="button" class="loomi-crop-btn apply" ?disabled=${!session.displayW} @click=${() => this.applyCrop()}>
            ${loomiT("filepicker.cropApply", {}, this.locale)}
          </button>
        </div>
      </div>
    </div>`;
  }

  override render(): TemplateResult {
    const placeholderLine1 = loomiDefaultText(
      this.placeholderLine1,
      DEFAULT_PLACEHOLDER_LINE1,
      "filepicker.placeholderLine1",
      this.locale,
    );
    return html`<div class="loomi-fp">
      <div
        class="loomi-drop ${this.over ? "over" : ""} ${this.disabled ? "disabled" : ""}"
        @click=${() => this.canBrowse && !this.disabled && !this.cropping && this.input.click()}
        @dragover=${(e: DragEvent) => { if (this.canDrop && !this.disabled && !this.cropping) { e.preventDefault(); this.over = true; } }}
        @dragleave=${() => (this.over = false)}
        @drop=${(e: DragEvent) => this.onDrop(e)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${UPLOAD}</svg>
        <div class="loomi-l1">${placeholderLine1}${this.required ? html`<span class="loomi-req"> *</span>` : nothing}</div>
        <div class="loomi-l2">${this.placeholder2()}</div>
        <input
          class="loomi-native"
          type="file"
          name=${(this.name ? (this.maxFiles > 1 ? this.name + "[]" : this.name) : "") || nothing}
          accept=${this.acceptedFileTypes}
          ?multiple=${this.maxFiles > 1}
          ?disabled=${this.disabled || !!this.cropping}
          @blur=${this.showValidation}
          @change=${(e: Event) => this.add((e.target as HTMLInputElement).files)}
        />
      </div>
      ${this.files.length
        ? html`<div class="loomi-files">
            ${this.files.map((f, i) => html`<div class="loomi-file">
              <span class="loomi-thumb">
                ${this.showImagePreview && this.isImage(f)
                  ? html`<img class="loomi-thumb" src=${URL.createObjectURL(f)} alt="" />`
                  : html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${FILE}</svg>`}
              </span>
              <span class="loomi-meta">
                <div class="loomi-fname">${f.name}</div>
                <div class="loomi-fsize">${human(f.size)}</div>
              </span>
              <button class="loomi-remove" aria-label=${loomiT("common.remove", {}, this.locale)} @click=${() => this.removeFile(i)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${X}</svg>
              </button>
            </div>`)}
          </div>`
        : nothing}
      ${this.cropping ? this.renderCropModal(this.cropping) : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-filepicker": LoomiFilepicker;
  }
}
