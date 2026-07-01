import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiStyles, accentVars, cssColor, type LoomiColor } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import type { LoomiFilepicker } from "@loomidev/filepicker";
import { componentStyles } from "./generated/styles.css.js";

export type LoomiAvatarSize =
  | "tiny" | "small" | "medium" | "regular" | "big" | "huge" | "omg";

/**
 * `<loomi-avatar>` — a rounded image or initials avatar with optional status dot.
 * Wrap several in `<loomi-avatars>` to stack them.
 *
 * Set `editable` to let users replace the image themselves: clicking (or
 * Enter/Space-ing) the avatar launches a crop dialog and swaps in the result. See the
 * README for how to persist the picked file.
 *
 * @fires change - Fired after a new image is picked via `editable`. `detail: { file, image }`.
 */
@customElement("loomi-avatar")
export class LoomiAvatar extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property() image = "";
  @property() alt = "avatar";
  @property() label = "";
  @property({ reflect: true }) size: LoomiAvatarSize = "regular";
  @property({ type: Boolean }) dotted = false;
  @property({ attribute: "dot-color" }) dotColor: LoomiColor = "success" as LoomiColor;
  @property({ attribute: "dot-position" }) dotPosition: "top" | "bottom" = "bottom";
  @property({ attribute: "bg-color" }) bgColor: LoomiColor = "gray" as LoomiColor;
  @property({ type: Boolean, attribute: "show-ring" }) showRing = true;
  @property({ type: Boolean, reflect: true }) verified = false;
  @property({ type: Boolean, reflect: true }) editable = false;
  @property({ attribute: "edit-label" }) editLabel = "Edit avatar";

  // `<loomi-filepicker>` is a much heavier dependency (it pulls in @loomidev/modal and
  // @loomidev/notification) than the rest of this component needs, so it's only loaded
  // — via dynamic import, matching other optional-heavy integrations — once `editable`
  // is actually set, instead of bundled unconditionally for every avatar.
  @state() private filepickerReady = false;
  private filepickerLoading = false;
  @state() private imageObjectUrl = "";
  @query(".loomi-edit-fp") private filepickerEl?: LoomiFilepicker;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.imageObjectUrl) URL.revokeObjectURL(this.imageObjectUrl);
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("editable") && this.editable && !this.filepickerReady && !this.filepickerLoading) {
      this.filepickerLoading = true;
      import("@loomidev/filepicker/loomi-filepicker.js").then(() => {
        this.filepickerReady = true;
      });
    }
  }

  private openEditor(): void {
    if (!this.editable) return;
    this.filepickerEl?.clear();
    this.filepickerEl?.open();
  }

  private onEditKeydown(e: KeyboardEvent): void {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    this.openEditor();
  }

  private onFilepickerChange(e: CustomEvent<{ files: File[] }>): void {
    // The internal filepicker is an implementation detail — its own `change` event
    // (composed, so it would otherwise cross out of this shadow root) is swallowed here
    // in favor of this component's own `change` event, dispatched below.
    e.stopPropagation();
    const file = e.detail.files[0];
    if (!file) return;
    if (this.imageObjectUrl) URL.revokeObjectURL(this.imageObjectUrl);
    this.imageObjectUrl = URL.createObjectURL(file);
    this.image = this.imageObjectUrl;
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, composed: true, detail: { file, image: this.imageObjectUrl } }),
    );
  }

  override render(): TemplateResult {
    const useImage = this.image && this.image.length > 3;
    const inner = useImage
      ? html`<img src=${this.image} alt=${this.alt} />`
      : html`<span class="loomi-label">${this.label || this.image || "?"}</span>`;
    return html`<span
      class="loomi-av size-${this.size} ${this.showRing ? "ring" : ""} ${this.editable ? "editable" : ""}"
      style=${accentVars(this.bgColor)}
      role=${this.editable ? "button" : nothing}
      tabindex=${this.editable ? "0" : nothing}
      aria-label=${this.editable ? this.editLabel : nothing}
      @click=${this.editable ? this.openEditor : nothing}
      @keydown=${this.editable ? this.onEditKeydown : nothing}
    >
      ${inner}
      ${this.dotted
        ? html`<span class="loomi-dot ${this.dotPosition}" style="background:${cssColor(this.dotColor, 500)}"></span>`
        : nothing}
      ${this.verified
        ? html`<span class="loomi-verified" part="verified">
            <loomi-icon name="check-badge" variant="solid"></loomi-icon>
          </span>`
        : nothing}
      ${this.editable
        ? html`<span class="loomi-edit-overlay" part="edit-overlay">
            <loomi-icon name="camera" variant="solid"></loomi-icon>
          </span>`
        : nothing}
    </span>
    ${this.editable && this.filepickerReady
      ? html`<loomi-filepicker
          class="loomi-edit-fp"
          stealth
          crop
          crop-aspect-ratio="1:1"
          accepted-file-types="image/*"
          @change=${(e: CustomEvent<{ files: File[] }>) => this.onFilepickerChange(e)}
        ></loomi-filepicker>`
      : nothing}`;
  }
}

/**
 * `<loomi-avatars>` — a group/stack of `<loomi-avatar>` children, with an optional
 * "+N" bubble.
 *
 * @slot - `<loomi-avatar>` children.
 */
@customElement("loomi-avatars")
export class LoomiAvatars extends LoomiElement {
  static override styles = loomiStyles(componentStyles);

  @property({ type: Boolean, reflect: true }) stacked = false;
  @property({ type: Boolean }) dotted = false;
  @property({ attribute: "dot-color" }) dotColor: LoomiColor = "success" as LoomiColor;
  @property({ attribute: "dot-position" }) dotPosition: "top" | "bottom" = "bottom";
  @property({ type: Number }) plus = 0;
  @property({ reflect: true }) size: LoomiAvatarSize = "regular";

  private syncChildren = (): void => {
    if (this.plus > 0) this.stacked = true;
    const hasGroupDotColor = this.hasAttribute("dot-color") || this.dotColor !== "success";
    const hasGroupDotPosition = this.hasAttribute("dot-position") || this.dotPosition !== "bottom";

    this.querySelectorAll("loomi-avatar").forEach((avatar) => {
      avatar.setAttribute("size", this.size);
      if (this.dotted) avatar.setAttribute("dotted", "");
      if (hasGroupDotColor && !avatar.hasAttribute("dot-color")) {
        avatar.setAttribute("dot-color", this.dotColor);
      }
      if (hasGroupDotPosition && !avatar.hasAttribute("dot-position")) {
        avatar.setAttribute("dot-position", this.dotPosition);
      }
    });
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.syncChildren();
  }

  override updated(): void {
    this.syncChildren();
  }

  override render(): TemplateResult {
    return html`<span class="loomi-row size-${this.size}">
      <slot @slotchange=${this.syncChildren}></slot>
      ${this.plus > 0
        ? html`<span class="loomi-plus" part="plus">+${this.plus}</span>`
        : nothing}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-avatar": LoomiAvatar;
    "loomi-avatars": LoomiAvatars;
  }
}
