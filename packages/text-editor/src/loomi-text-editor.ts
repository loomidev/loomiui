import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiT, themeStyles } from "@loomidev/core";
import "@loomidev/icon/loomi-icon.js";
import "@loomidev/tooltip/loomi-tooltip.js";
import { componentStyles } from "./generated/styles.css.js";

const TOOL_ORDER = [
  "heading",
  "font-family",
  "font-size",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "font-color",
  "highlight-color",
  "bullet-list",
  "ordered-list",
  "align-left",
  "align-center",
  "align-right",
  "align-justify",
  "inline-code",
  "superscript",
  "subscript",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
] as const;

export type LoomiTextEditorTool = (typeof TOOL_ORDER)[number];
export type LoomiTextEditorTools = string | readonly string[];

const TOOL_SET = new Set<string>(TOOL_ORDER);

const TOOL_ALIASES: Record<string, string> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  headings: "heading",
  header: "heading",
  headers: "heading",
  fonts: "font",
  family: "font-family",
  size: "font-size",
  color: "font-color",
  colours: "colors",
  colour: "font-color",
  "text-color": "font-color",
  highlight: "highlight-color",
  "background-color": "highlight-color",
  "font-colour": "font-color",
  "highlight-colour": "highlight-color",
  italics: "italic",
  strike: "strikethrough",
  "strike-through": "strikethrough",
  "bullet": "bullet-list",
  bullets: "lists",
  "dot-list": "bullet-list",
  dots: "bullet-list",
  "number-list": "ordered-list",
  "numbered-list": "ordered-list",
  numbers: "ordered-list",
  "ordered": "ordered-list",
  "unordered-list": "bullet-list",
  "text-alignments": "align",
  alignment: "align",
  alignments: "align",
  left: "align-left",
  center: "align-center",
  centre: "align-center",
  "align-centre": "align-center",
  right: "align-right",
  justify: "align-justify",
  code: "code-tools",
  "code-inline": "inline-code",
  "inlinecode": "inline-code",
  quote: "blockquote",
  embeds: "embed",
  media: "media",
  full: "all",
};

const TOOL_GROUPS: Record<string, readonly string[]> = {
  none: [],
  default: ["basic", "heading", "lists", "align", "embed"],
  basic: ["bold", "italic", "underline", "strikethrough"],
  marks: ["bold", "italic", "underline", "strikethrough", "inline-code", "superscript", "subscript"],
  colors: ["font-color", "highlight-color"],
  colour: ["font-color", "highlight-color"],
  font: ["font-family", "font-size"],
  typography: ["heading", "font-family", "font-size", "font-color", "highlight-color"],
  lists: ["bullet-list", "ordered-list"],
  align: ["align-left", "align-center", "align-right", "align-justify"],
  script: ["superscript", "subscript"],
  "code-tools": ["inline-code", "code-block"],
  blocks: ["blockquote", "code-block"],
  embed: ["link", "image", "video"],
  media: ["image", "video"],
  all: ["typography", "basic", "lists", "align", "script", "blocks", "embed"],
};

const ACTIVE_COMMANDS: Partial<Record<LoomiTextEditorTool, string>> = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  strikethrough: "strikeThrough",
  "bullet-list": "insertUnorderedList",
  "ordered-list": "insertOrderedList",
  superscript: "superscript",
  subscript: "subscript",
};

type IconSpec = { name: string; source?: "heroicons" | "iconsax" | "untitledui" };

const TOOL_LABELS: Record<LoomiTextEditorTool, string> = {
  heading: "Heading",
  "font-family": "Font family",
  "font-size": "Font size",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strikethrough: "Strikethrough",
  "font-color": "Font color",
  "highlight-color": "Highlight color",
  "bullet-list": "Bullet list",
  "ordered-list": "Numbered list",
  "align-left": "Align left",
  "align-center": "Align center",
  "align-right": "Align right",
  "align-justify": "Justify",
  "inline-code": "Inline code",
  superscript: "Superscript",
  subscript: "Subscript",
  blockquote: "Blockquote",
  "code-block": "Code block",
  link: "Link",
  image: "Image",
  video: "Video",
};

const TOOL_ICONS: Partial<Record<LoomiTextEditorTool, IconSpec>> = {
  heading: { name: "heading-01", source: "untitledui" },
  bold: { name: "bold-01", source: "untitledui" },
  italic: { name: "italic-01", source: "untitledui" },
  underline: { name: "underline-01", source: "untitledui" },
  strikethrough: { name: "strikethrough-01", source: "untitledui" },
  "font-color": { name: "type-01", source: "untitledui" },
  "highlight-color": { name: "paint-brush" },
  "bullet-list": { name: "list-bullet" },
  "ordered-list": { name: "numbered-list" },
  "align-left": { name: "align-left", source: "untitledui" },
  "align-center": { name: "align-center", source: "untitledui" },
  "align-right": { name: "align-right", source: "untitledui" },
  "align-justify": { name: "align-justify", source: "untitledui" },
  "inline-code": { name: "code-bracket" },
  blockquote: { name: "quote-down", source: "iconsax" },
  "code-block": { name: "code-bracket-square" },
  link: { name: "link" },
  image: { name: "photo" },
  video: { name: "video-camera" },
};

const FONT_FAMILIES = [
  { label: "Sans", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
];

const FONT_SIZES = [
  { label: "Small", value: "2" },
  { label: "Normal", value: "3" },
  { label: "Large", value: "5" },
  { label: "Huge", value: "7" },
];

function normalizeToken(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, "-");
}

function normalizeEditorHtml(value: string): string {
  return value.trim() === "<br>" ? "" : value;
}

function stripTags(value: string): string {
  return value.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, "");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}

function safeUrl(value: string, protocols = ["http:", "https:"]): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(\/|\.\/|\.\.\/)/.test(trimmed)) return trimmed;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return protocols.includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function videoEmbedUrl(value: string): string {
  const url = safeUrl(value);
  if (!url) return "";

  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : url;
    }
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\/+/, "");
      return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : url;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}` : url;
    }
  } catch {
    return url;
  }

  return url;
}

/**
 * `<loomi-text-editor>` - a themeable rich-text editor with a native
 * contenteditable surface, configurable toolbar groups, floating label, inline
 * validation, and HTML form submission.
 *
 * @csspart field - The bordered container.
 * @csspart toolbar - The toolbar container.
 * @csspart editor - The editable surface.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-text-editor")
export class LoomiTextEditor extends LoomiElement {
  static override styles = [themeStyles, componentStyles];
  static formAssociated = true;

  private internals = this.attachInternals();
  private validationVisible = false;
  private valueSetFromEditor = false;
  private readonly onSelectionChange = (): void => this.updateToolbarState();

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property() locale = "";
  @property() placeholder = "";
  @property() value = "";
  @property() tools: LoomiTextEditorTools = "default";
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, reflect: true }) invalid = false;

  @state() private activeTools: readonly string[] = [];
  @state() private currentBlock = "p";

  @query(".loomi-editor") private editorEl!: HTMLElement;

  private get resolvedTools(): readonly LoomiTextEditorTool[] {
    const rawTools = Array.isArray(this.tools)
      ? this.tools.map(String)
      : String(this.tools)
          .split(",")
          .map((tool) => tool.trim())
          .filter(Boolean);
    const tokens = rawTools.length ? rawTools : ["none"];
    const expanded = new Set<string>();

    const expand = (token: string, seen = new Set<string>()): void => {
      const normalized = TOOL_ALIASES[normalizeToken(token)] ?? normalizeToken(token);
      if (seen.has(normalized)) return;
      seen.add(normalized);

      const group = TOOL_GROUPS[normalized];
      if (group) {
        for (const item of group) expand(item, seen);
        return;
      }

      if (TOOL_SET.has(normalized)) expanded.add(normalized);
    };

    for (const token of tokens) expand(token);
    return TOOL_ORDER.filter((tool) => expanded.has(tool));
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("selectionchange", this.onSelectionChange);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("selectionchange", this.onSelectionChange);
    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.syncEditorFromValue();
    this.syncValidity();
  }

  override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("value") || changed.has("required") || changed.has("disabled") || changed.has("readonly")) {
      this.internals.setFormValue(this.value);
      this.syncValidity();
    }
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("value")) {
      if (this.valueSetFromEditor) this.valueSetFromEditor = false;
      else {
        this.syncEditorFromValue();
        this.syncValidity();
      }
    }
  }

  override focus(): void {
    this.editorEl?.focus();
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

  private syncEditorFromValue(): void {
    if (!this.editorEl || this.editorEl.innerHTML === this.value) return;
    this.editorEl.innerHTML = this.value;
  }

  private syncValueFromEditor(): void {
    const htmlValue = normalizeEditorHtml(this.editorEl?.innerHTML ?? "");
    this.valueSetFromEditor = true;
    this.value = htmlValue;
    this.internals.setFormValue(htmlValue);
    if (this.invalid) this.validate();
  }

  private syncValidity(showInvalid = this.validationVisible): boolean {
    const text = this.editorEl?.textContent ?? stripTags(this.value);
    const empty = this.required && !this.disabled && !this.readonly && text.trim() === "";
    this.invalid = empty && showInvalid;
    const validity = empty ? { valueMissing: true } : {};
    const message = empty ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale) : "";
    if (this.editorEl) this.internals.setValidity(validity, message, this.editorEl);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private handleInput(): void {
    this.syncValueFromEditor();
    this.updateToolbarState();
    this.emit("input");
  }

  private handleBlur(): void {
    this.showValidation();
    this.emit("change");
  }

  private emit(type: "input" | "change"): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  private keepToolbarFocus(event: MouseEvent): void {
    event.preventDefault();
  }

  private command(name: string, value?: string): void {
    if (this.disabled || this.readonly) return;
    this.focus();
    document.execCommand(name, false, value);
    this.syncValueFromEditor();
    this.updateToolbarState();
    this.emit("input");
  }

  private runTool(tool: LoomiTextEditorTool): void {
    switch (tool) {
      case "bold":
        this.command("bold");
        break;
      case "italic":
        this.command("italic");
        break;
      case "underline":
        this.command("underline");
        break;
      case "strikethrough":
        this.command("strikeThrough");
        break;
      case "bullet-list":
        this.command("insertUnorderedList");
        break;
      case "ordered-list":
        this.command("insertOrderedList");
        break;
      case "align-left":
        this.command("justifyLeft");
        break;
      case "align-center":
        this.command("justifyCenter");
        break;
      case "align-right":
        this.command("justifyRight");
        break;
      case "align-justify":
        this.command("justifyFull");
        break;
      case "inline-code":
        this.wrapSelection("code", "code");
        break;
      case "superscript":
        this.command("superscript");
        break;
      case "subscript":
        this.command("subscript");
        break;
      case "blockquote":
        this.formatBlock("blockquote");
        break;
      case "code-block":
        this.formatBlock("pre");
        break;
      case "link":
        this.insertLink();
        break;
      case "image":
        this.insertImage();
        break;
      case "video":
        this.insertVideo();
        break;
      default:
        break;
    }
  }

  private setHeading(value: string): void {
    this.formatBlock(value || "p");
  }

  private setFontFamily(value: string): void {
    if (!value) return;
    this.command("fontName", value);
  }

  private setFontSize(value: string): void {
    if (!value) return;
    this.command("fontSize", value);
  }

  private setColor(command: "foreColor" | "hiliteColor", value: string): void {
    if (!value) return;
    this.command(command, value);
  }

  private formatBlock(block: string): void {
    this.command("formatBlock", block === "p" ? "<p>" : `<${block}>`);
    this.currentBlock = block;
  }

  private wrapSelection(tagName: "code", fallbackText: string): void {
    if (this.disabled || this.readonly) return;
    this.focus();

    const range = this.currentRange();
    if (!range) {
      this.insertHtml(`<${tagName}>${escapeHtml(fallbackText)}</${tagName}>`);
      return;
    }

    const wrapper = document.createElement(tagName);
    if (range.collapsed) {
      wrapper.textContent = fallbackText;
      range.insertNode(wrapper);
      range.selectNodeContents(wrapper);
    } else {
      wrapper.append(range.extractContents());
      range.insertNode(wrapper);
      range.selectNodeContents(wrapper);
    }

    this.syncValueFromEditor();
    this.updateToolbarState();
    this.emit("input");
  }

  private insertLink(): void {
    const href = safeUrl(window.prompt("Link URL") ?? "", ["http:", "https:", "mailto:", "tel:"]);
    if (!href) return;

    const selection = this.currentSelectionText();
    if (!selection) this.insertHtml(`<a href="${escapeHtml(href)}">${escapeHtml(href)}</a>`);
    else this.command("createLink", href);
    this.hardenLinks();
  }

  private insertImage(): void {
    const src = safeUrl(window.prompt("Image URL") ?? "");
    if (!src) return;
    const alt = window.prompt("Image description") ?? "";
    this.insertHtml(`<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`);
  }

  private insertVideo(): void {
    const src = videoEmbedUrl(window.prompt("Video URL") ?? "");
    if (!src) return;
    this.insertHtml(
      `<iframe src="${escapeHtml(src)}" title="Embedded video" loading="lazy" allowfullscreen></iframe>`,
    );
  }

  private insertHtml(markup: string): void {
    this.command("insertHTML", markup);
  }

  private hardenLinks(): void {
    for (const link of Array.from(this.editorEl?.querySelectorAll("a[href]") ?? [])) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
    this.syncValueFromEditor();
  }

  private currentSelectionText(): string {
    const selection = this.currentSelection();
    return selection?.toString() ?? "";
  }

  private currentSelection(): Selection | null {
    const root = this.getRootNode() as Document | ShadowRoot;
    const rootSelection = (root as Document & { getSelection?: () => Selection | null }).getSelection;
    const selection = rootSelection ? rootSelection.call(root) : document.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    return this.selectionInsideEditor(selection) ? selection : null;
  }

  private currentRange(): Range | null {
    const selection = this.currentSelection();
    if (!selection) return null;
    return selection.getRangeAt(0);
  }

  private selectionInsideEditor(selection: Selection): boolean {
    if (!this.editorEl || selection.rangeCount === 0) return false;
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    return this.editorEl === container || this.editorEl.contains(container);
  }

  private updateToolbarState(): void {
    if (!this.editorEl) return;
    if (!this.currentSelection()) {
      this.activeTools = [];
      this.currentBlock = "p";
      return;
    }
    const active = new Set<string>();
    for (const [tool, command] of Object.entries(ACTIVE_COMMANDS)) {
      try {
        if (document.queryCommandState(command)) active.add(tool);
      } catch {
        // Some browser commands throw when the selection is outside an editable area.
      }
    }
    this.currentBlock = this.detectCurrentBlock();
    this.activeTools = Array.from(active);
  }

  private detectCurrentBlock(): string {
    const range = this.currentRange();
    if (!range) return "p";
    let node: Node | null = range.startContainer;
    while (node && node !== this.editorEl) {
      if (node instanceof HTMLElement) {
        const tag = node.tagName.toLowerCase();
        if (/^h[1-6]$/.test(tag) || tag === "blockquote" || tag === "pre" || tag === "p") return tag;
      }
      node = node.parentNode;
    }
    return "p";
  }

  private renderTooltip(label: string, content: TemplateResult): TemplateResult {
    return html`<loomi-tooltip content=${label} position="bottom">${content}</loomi-tooltip>`;
  }

  private renderIcon(tool: LoomiTextEditorTool): TemplateResult | typeof nothing {
    const icon = TOOL_ICONS[tool];
    if (!icon) return nothing;
    return html`<loomi-icon
      name=${icon.name}
      source=${icon.source ?? nothing}
      size="1rem"
      stroke-width="1.8"
    ></loomi-icon>`;
  }

  private renderButton(tool: LoomiTextEditorTool, fallback?: string): TemplateResult {
    const label = TOOL_LABELS[tool];
    const active = this.activeTools.includes(tool);
    const buttonContent = TOOL_ICONS[tool] ? this.renderIcon(tool) : fallback || label;
    const content = html`<button
      class=${`loomi-tool-button${active ? " active" : ""}`}
      type="button"
      aria-label=${label}
      aria-pressed=${active ? "true" : "false"}
      ?disabled=${this.disabled || this.readonly}
      @mousedown=${this.keepToolbarFocus}
      @click=${() => this.runTool(tool)}
    >
      ${buttonContent}
    </button>`;

    return this.renderTooltip(label, content);
  }

  private renderSelectTool(tool: LoomiTextEditorTool): TemplateResult {
    if (tool === "heading") {
      return this.renderTooltip(
        TOOL_LABELS[tool],
        html`<select
          class="loomi-tool-select"
          aria-label=${TOOL_LABELS[tool]}
          .value=${this.currentBlock}
          ?disabled=${this.disabled || this.readonly}
          @mousedown=${this.keepToolbarFocus}
          @change=${(event: Event) => this.setHeading((event.target as HTMLSelectElement).value)}
        >
          <option value="p">Body</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>`,
      );
    }

    if (tool === "font-family") {
      return this.renderTooltip(
        TOOL_LABELS[tool],
        html`<select
          class="loomi-tool-select"
          aria-label=${TOOL_LABELS[tool]}
          ?disabled=${this.disabled || this.readonly}
          @mousedown=${this.keepToolbarFocus}
          @change=${(event: Event) => this.setFontFamily((event.target as HTMLSelectElement).value)}
        >
          <option value="">Font</option>
          ${FONT_FAMILIES.map((font) => html`<option value=${font.value}>${font.label}</option>`)}
        </select>`,
      );
    }

    return this.renderTooltip(
      TOOL_LABELS[tool],
      html`<select
        class="loomi-tool-select loomi-tool-select-narrow"
        aria-label=${TOOL_LABELS[tool]}
        ?disabled=${this.disabled || this.readonly}
        @mousedown=${this.keepToolbarFocus}
        @change=${(event: Event) => this.setFontSize((event.target as HTMLSelectElement).value)}
      >
        <option value="">Size</option>
        ${FONT_SIZES.map((size) => html`<option value=${size.value}>${size.label}</option>`)}
      </select>`,
    );
  }

  private renderColorTool(tool: "font-color" | "highlight-color"): TemplateResult {
    const label = TOOL_LABELS[tool];
    const command = tool === "font-color" ? "foreColor" : "hiliteColor";
    const fallback = tool === "font-color" ? "#111827" : "#fef08a";

    return this.renderTooltip(
      label,
      html`<label
        class=${`loomi-color-tool${this.disabled || this.readonly ? " disabled" : ""}`}
        aria-label=${label}
        @mousedown=${this.keepToolbarFocus}
      >
        ${this.renderIcon(tool)}
        <input
          type="color"
          value=${fallback}
          aria-label=${label}
          ?disabled=${this.disabled || this.readonly}
          @input=${(event: Event) => this.setColor(command, (event.target as HTMLInputElement).value)}
        />
      </label>`,
    );
  }

  private renderTool(tool: LoomiTextEditorTool): TemplateResult {
    if (tool === "heading" || tool === "font-family" || tool === "font-size") {
      return this.renderSelectTool(tool);
    }
    if (tool === "font-color" || tool === "highlight-color") return this.renderColorTool(tool);
    if (tool === "superscript") return this.renderButton(tool, "x^2");
    if (tool === "subscript") return this.renderButton(tool, "x_2");
    return this.renderButton(tool);
  }

  override render(): TemplateResult {
    const hasLabel = !!this.label;
    const showError = this.invalid && this.showErrorInline && this.errorMessage;
    const tools = this.resolvedTools;
    const text = this.editorEl?.textContent ?? stripTags(this.value);
    const isEmpty = text.trim() === "";

    return html`
      ${hasLabel
        ? html`<label class="loomi-label loomi-label-static"
            >${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label
          >`
        : nothing}
      <div class="loomi-field" part="field">
        ${tools.length
          ? html`<div class="loomi-toolbar" part="toolbar" role="toolbar">
              ${tools.map((tool) => this.renderTool(tool))}
            </div>`
          : nothing}
        <div
          class="loomi-editor"
          part="editor"
          role="textbox"
          aria-multiline="true"
          aria-label=${this.label || this.placeholder || "Rich text editor"}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-readonly=${this.readonly ? "true" : "false"}
          contenteditable=${this.disabled || this.readonly ? "false" : "true"}
          data-empty=${isEmpty ? "true" : "false"}
          data-placeholder=${this.placeholder}
          style=${`--loomi-editor-min-height:${Math.max(1, this.rows) * 1.5}em`}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @keyup=${this.updateToolbarState}
          @mouseup=${this.updateToolbarState}
        ></div>
      </div>
      ${showError ? html`<p class="loomi-error">${this.errorMessage}</p>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-text-editor": LoomiTextEditor;
  }
}
