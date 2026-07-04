import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { LoomiElement, loomiT, themeStyles } from "@loomidev/core";
import "@loomidev/filepicker/loomi-filepicker.js";
import "@loomidev/icon/loomi-icon.js";
import "@loomidev/input/loomi-input.js";
import "@loomidev/modal/loomi-modal.js";
import type { LoomiModal } from "@loomidev/modal";
import "@loomidev/select/loomi-select.js";
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
  "ai",
] as const;

export type LoomiTextEditorTool = (typeof TOOL_ORDER)[number];
export type LoomiTextEditorTools = string | readonly string[];
export type LoomiTextEditorEmbedTool = "link" | "image" | "video";
export type LoomiTextEditorVariant = "default" | "minimal";

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
  "ai-generate": "ai",
  generate: "ai",
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
  all: ["typography", "basic", "lists", "align", "script", "blocks", "embed", "ai"],
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
  ai: "AI generate",
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
  ai: { name: "sparkles" },
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

const HEADING_OPTIONS = [
  { label: "Body", value: "p" },
  { label: "H1", value: "h1" },
  { label: "H2", value: "h2" },
  { label: "H3", value: "h3" },
  { label: "H4", value: "h4" },
  { label: "H5", value: "h5" },
  { label: "H6", value: "h6" },
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
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
  private savedRange: Range | null = null;
  private embedFiles: File[] = [];
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
  @property() variant: LoomiTextEditorVariant = "default";

  @state() private activeTools: readonly string[] = [];
  @state() private currentBlock = "p";
  @state() private embedTool: LoomiTextEditorEmbedTool | "" = "";
  @state() private embedUrl = "";
  @state() private embedText = "";
  @state() private embedAlt = "";

  @query(".loomi-editor") private editorEl!: HTMLElement;
  @query(".loomi-embed-modal", true) private embedModalEl?: LoomiModal;

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

  private captureSelection(): void {
    const range = this.currentRange();
    this.savedRange = range ? range.cloneRange() : null;
  }

  private keepToolbarFocus(event: MouseEvent): void {
    this.captureSelection();
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
        this.openEmbedDialog("link");
        break;
      case "image":
        this.openEmbedDialog("image");
        break;
      case "video":
        this.openEmbedDialog("video");
        break;
      case "ai":
        this.requestAiGeneration();
        break;
      default:
        break;
    }
  }

  private setHeading(value: string): void {
    this.restoreSavedSelection();
    this.formatBlock(value || "p");
  }

  private setFontFamily(value: string): void {
    if (!value) return;
    this.restoreSavedSelection();
    this.command("fontName", value);
  }

  private setFontSize(value: string): void {
    if (!value) return;
    this.restoreSavedSelection();
    this.command("fontSize", value);
  }

  private setColor(command: "foreColor" | "hiliteColor", value: string): void {
    if (!value) return;
    this.restoreSavedSelection();
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

  private async openEmbedDialog(tool: LoomiTextEditorEmbedTool): Promise<void> {
    if (this.disabled || this.readonly) return;
    const range = this.currentRange();
    this.savedRange = range ? range.cloneRange() : this.savedRange;
    this.embedFiles = [];
    this.embedTool = tool;
    this.embedUrl = "";
    this.embedAlt = "";
    this.embedText = tool === "link" ? this.currentSelectionText() : "";
    await this.updateComplete;
    this.embedModalEl?.show();
  }

  private closeEmbedDialog(): void {
    this.resetEmbedDialog();
    this.embedModalEl?.hide();
  }

  private resetEmbedDialog(): void {
    this.embedTool = "";
    this.embedUrl = "";
    this.embedText = "";
    this.embedAlt = "";
    this.embedFiles = [];
    this.savedRange = null;
  }

  private restoreSavedSelection(): void {
    this.focus();
    if (!this.savedRange) return;
    const root = this.getRootNode() as Document | ShadowRoot;
    const rootSelection = (root as Document & { getSelection?: () => Selection | null }).getSelection;
    const selection = rootSelection ? rootSelection.call(root) : document.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(this.savedRange);
  }

  private onEmbedFileChange(event: CustomEvent<{ files: File[] }>): void {
    this.embedFiles = event.detail.files;
  }

  private async confirmEmbedDialog(): Promise<void> {
    const tool = this.embedTool;
    if (!tool) return;

    const inserted =
      tool === "link"
        ? this.confirmLink()
        : tool === "image"
          ? await this.confirmImage()
          : await this.confirmVideo();
    if (inserted) this.closeEmbedDialog();
  }

  private confirmLink(): boolean {
    const href = safeUrl(this.embedUrl, ["http:", "https:", "mailto:", "tel:"]);
    if (!href) return false;

    this.restoreSavedSelection();
    const selection = this.currentSelectionText();
    const label = this.embedText.trim() || selection || href;
    if (!selection || this.embedText.trim()) {
      this.insertHtml(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`);
    } else {
      this.command("createLink", href);
    }
    this.hardenLinks();
    return true;
  }

  private async confirmImage(): Promise<boolean> {
    const file = this.embedFiles.find((item) => item.type.startsWith("image/"));
    const src = file ? await readFileAsDataUrl(file) : safeUrl(this.embedUrl);
    if (!src) return false;
    this.restoreSavedSelection();
    this.insertHtml(`<img src="${escapeHtml(src)}" alt="${escapeHtml(this.embedAlt)}">`);
    return true;
  }

  private async confirmVideo(): Promise<boolean> {
    const file = this.embedFiles.find((item) => item.type.startsWith("video/"));
    if (file) {
      const src = await readFileAsDataUrl(file);
      if (!src) return false;
      this.restoreSavedSelection();
      this.insertHtml(`<video controls src="${escapeHtml(src)}"></video>`);
      return true;
    }

    const src = videoEmbedUrl(this.embedUrl);
    if (!src) return false;
    this.restoreSavedSelection();
    this.insertHtml(
      `<iframe src="${escapeHtml(src)}" title="Embedded video" loading="lazy" allowfullscreen></iframe>`,
    );
    return true;
  }

  private requestAiGeneration(): void {
    if (this.disabled || this.readonly) return;
    const range = this.currentRange();
    this.savedRange = range ? range.cloneRange() : this.savedRange;
    const selection = this.currentSelectionText();
    this.dispatchEvent(
      new CustomEvent("loomi-ai-generate", {
        bubbles: true,
        composed: true,
        detail: {
          html: this.value,
          selection,
          insert: (htmlValue: string) => {
            this.restoreSavedSelection();
            this.insertHtml(htmlValue);
          },
        },
      }),
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
    return html`<loomi-tooltip content=${label} placement="bottom">${content}</loomi-tooltip>`;
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
      return this.renderToolbarSelect(
        tool,
        HEADING_OPTIONS,
        "Body",
        this.currentBlock,
        (value) => this.setHeading(value),
        "loomi-tool-select-heading",
      );
    }

    if (tool === "font-family") {
      return this.renderToolbarSelect(
        tool,
        FONT_FAMILIES,
        "Font",
        "",
        (value) => this.setFontFamily(value),
      );
    }

    return this.renderToolbarSelect(
      tool,
      FONT_SIZES,
      "Size",
      "",
      (value) => this.setFontSize(value),
      "loomi-tool-select-narrow",
    );
  }

  private renderToolbarSelect(
    tool: LoomiTextEditorTool,
    options: ReadonlyArray<{ label: string; value: string }>,
    placeholder: string,
    selectedValue: string,
    onSelect: (value: string) => void,
    className = "",
  ): TemplateResult {
    return this.renderTooltip(
      TOOL_LABELS[tool],
      html`<loomi-select
        class=${`loomi-tool-select-custom ${className}`.trim()}
        size="tiny"
        no-clearing
        placeholder=${placeholder}
        selected-value=${selectedValue}
        .data=${options}
        ?disabled=${this.disabled || this.readonly}
        @pointerdown=${this.captureSelection}
        @select=${(event: CustomEvent<{ value: string }>) => onSelect(event.detail.value)}
      ></loomi-select>`,
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
        @pointerdown=${this.captureSelection}
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

  private renderEmbedInput(
    label: string,
    value: string,
    prefixIcon: string,
    onInput: (value: string) => void,
  ): TemplateResult {
    return html`<loomi-input
      class="loomi-embed-input"
      no-clearing
      label=${label}
      prefix-icon=${prefixIcon}
      .value=${value}
      @input=${(event: Event) => onInput((event.target as HTMLInputElement & { value: string }).value)}
    ></loomi-input>`;
  }

  private renderEmbedFilepicker(kind: "image" | "video"): TemplateResult {
    const accepted = kind === "image" ? "image/*" : "video/*";
    return html`<loomi-filepicker
      class="loomi-embed-filepicker"
      accepted-file-types=${accepted}
      max-files="1"
      max-file-size=${kind === "image" ? "10mb" : "50mb"}
      .showImagePreview=${kind === "image"}
      @change=${(event: Event) => this.onEmbedFileChange(event as CustomEvent<{ files: File[] }>)}
    ></loomi-filepicker>`;
  }

  private renderEmbedDialogBody(): TemplateResult {
    if (!this.embedTool) return html``;

    if (this.embedTool === "link") {
      return html`<div class="loomi-embed-form">
        ${this.renderEmbedInput("URL", this.embedUrl, "link", (value) => (this.embedUrl = value))}
        ${this.renderEmbedInput("Display text", this.embedText, "document-text", (value) => (this.embedText = value))}
      </div>`;
    }

    if (this.embedTool === "image") {
      return html`<div class="loomi-embed-form">
        ${this.renderEmbedInput("Image URL", this.embedUrl, "photo", (value) => (this.embedUrl = value))}
        ${this.renderEmbedInput("Image description", this.embedAlt, "tag", (value) => (this.embedAlt = value))}
        <div class="loomi-embed-separator">Or choose an image file</div>
        ${this.renderEmbedFilepicker("image")}
      </div>`;
    }

    return html`<div class="loomi-embed-form">
      ${this.renderEmbedInput("Video URL", this.embedUrl, "video-camera", (value) => (this.embedUrl = value))}
      <div class="loomi-embed-separator">Or choose a video file</div>
      ${this.renderEmbedFilepicker("video")}
    </div>`;
  }

  private renderEmbedDialog(): TemplateResult {
    const title =
      this.embedTool === "image"
        ? "Insert image"
        : this.embedTool === "video"
          ? "Insert video"
          : "Insert link";
    return html`<loomi-modal
      class="loomi-embed-modal"
      title=${title}
      size="medium"
      ok-button-label="Insert"
      cancel-button-label="Cancel"
      close-after-action="false"
      show-close-icon
      @ok=${this.confirmEmbedDialog}
      @cancel=${this.closeEmbedDialog}
      @close=${this.resetEmbedDialog}
    >
      ${this.renderEmbedDialogBody()}
    </loomi-modal>`;
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
      <div class="loomi-field variant-${this.variant}" part="field">
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
      ${this.renderEmbedDialog()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-text-editor": LoomiTextEditor;
  }
}
