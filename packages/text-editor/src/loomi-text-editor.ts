import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import {
  LoomiElement,
  fieldStyles,
  loomiStyles,
  loomiT,
  randomSuffix,
  type LoomiFieldLabelPosition,
  toControlValue,
} from "@loomidev/core";
import "@loomidev/filepicker/loomi-filepicker.js";
import "@loomidev/icon/loomi-icon.js";
import { provideLoomiIcons, registerLoomiDiskIcon } from "@loomidev/icons";
import untitleduiHeading01 from "@loomidev/icons/icons/untitledui/outline/heading-01.js";
import untitleduiBold01 from "@loomidev/icons/icons/untitledui/outline/bold-01.js";
import untitleduiItalic01 from "@loomidev/icons/icons/untitledui/outline/italic-01.js";
import untitleduiUnderline01 from "@loomidev/icons/icons/untitledui/outline/underline-01.js";
import untitleduiStrikethrough01 from "@loomidev/icons/icons/untitledui/outline/strikethrough-01.js";
import untitleduiType01 from "@loomidev/icons/icons/untitledui/outline/type-01.js";
import untitleduiAlignLeft from "@loomidev/icons/icons/untitledui/outline/align-left.js";
import untitleduiAlignCenter from "@loomidev/icons/icons/untitledui/outline/align-center.js";
import untitleduiAlignRight from "@loomidev/icons/icons/untitledui/outline/align-right.js";
import untitleduiAlignJustify from "@loomidev/icons/icons/untitledui/outline/align-justify.js";
import iconsaxQuoteDown from "@loomidev/icons/icons/iconsax/outline/quote-down.js";
import heroPaintBrush from "@loomidev/icons/heroicons/outline/paint-brush.js";
import heroListBullet from "@loomidev/icons/heroicons/outline/list-bullet.js";
import heroNumberedList from "@loomidev/icons/heroicons/outline/numbered-list.js";
import heroCodeBracket from "@loomidev/icons/heroicons/outline/code-bracket.js";
import heroCodeBracketSquare from "@loomidev/icons/heroicons/outline/code-bracket-square.js";
import heroLink from "@loomidev/icons/heroicons/outline/link.js";
import heroPhoto from "@loomidev/icons/heroicons/outline/photo.js";
import heroVideoCamera from "@loomidev/icons/heroicons/outline/video-camera.js";
import heroSparkles from "@loomidev/icons/heroicons/outline/sparkles.js";
import "@loomidev/input/loomi-input.js";
import "@loomidev/modal/loomi-modal.js";
import type { LoomiModal } from "@loomidev/modal";
import "@loomidev/select/loomi-select.js";
import "@loomidev/tooltip/loomi-tooltip.js";
import { componentStyles } from "./generated/styles.css.js";

// The toolbar's icons ship inline, so they render on first paint and the Iconsax and
// Untitled UI sets don't have to be enabled app-wide just for the editor.
registerLoomiDiskIcon("untitledui", "heading-01", untitleduiHeading01);
registerLoomiDiskIcon("untitledui", "bold-01", untitleduiBold01);
registerLoomiDiskIcon("untitledui", "italic-01", untitleduiItalic01);
registerLoomiDiskIcon("untitledui", "underline-01", untitleduiUnderline01);
registerLoomiDiskIcon("untitledui", "strikethrough-01", untitleduiStrikethrough01);
registerLoomiDiskIcon("untitledui", "type-01", untitleduiType01);
registerLoomiDiskIcon("untitledui", "align-left", untitleduiAlignLeft);
registerLoomiDiskIcon("untitledui", "align-center", untitleduiAlignCenter);
registerLoomiDiskIcon("untitledui", "align-right", untitleduiAlignRight);
registerLoomiDiskIcon("untitledui", "align-justify", untitleduiAlignJustify);
registerLoomiDiskIcon("iconsax", "quote-down", iconsaxQuoteDown);
provideLoomiIcons({
  "paint-brush": heroPaintBrush,
  "list-bullet": heroListBullet,
  "numbered-list": heroNumberedList,
  "code-bracket": heroCodeBracket,
  "code-bracket-square": heroCodeBracketSquare,
  link: heroLink,
  photo: heroPhoto,
  "video-camera": heroVideoCamera,
  sparkles: heroSparkles,
});

/**
 * Keeps an internal control's composed `input`/`change` from surfacing on the editor host,
 * where it would read as an edit of the editor's own value.
 */
const stopEvent = (event: Event): void => event.stopPropagation();

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
export type LoomiTextEditorUploadKind = "image" | "video";

/**
 * Uploads a file picked in the image/video embed dialog and resolves to the URL to
 * insert. Resolve `undefined` (or reject) to insert nothing; the editor surfaces the
 * failure as a `loomi-notification` toast rather than failing silently.
 */
export type LoomiTextEditorUploadHandler = (
  file: File,
  kind: LoomiTextEditorUploadKind,
) => Promise<string | undefined>;

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
  bullet: "bullet-list",
  bullets: "lists",
  "dot-list": "bullet-list",
  dots: "bullet-list",
  "number-list": "ordered-list",
  "numbered-list": "ordered-list",
  numbers: "ordered-list",
  ordered: "ordered-list",
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
  inlinecode: "inline-code",
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
  marks: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "inline-code",
    "superscript",
    "subscript",
  ],
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
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}

function normalizeEditorHtml(value: string): string {
  return value.trim() === "<br>" ? "" : value;
}

function stripTags(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "");
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
 * A URL produced by the consumer's own `uploadHandler` is first-party code, so it is not
 * held to the http/https allowlist `safeUrl()` applies to user-typed input — a handler
 * returning a relative storage path, or a `blob:`/`data:` URL for an optimistic preview,
 * is legitimate. Only the schemes that actually execute are rejected. Control characters
 * are stripped first because browsers ignore them when resolving a URL, so a scheme
 * split across an embedded newline would otherwise slip past the check.
 */
function trustedMediaUrl(value: string): string {
  const cleaned = Array.from(value.trim())
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 0x1f && code !== 0x7f;
    })
    .join("");
  return /^(javascript|vbscript):/i.test(cleaned) ? "" : cleaned;
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
 * @csspart custom-tool - Each button rendered from `customTools`.
 * @slot toolbar-start - Your own controls at the start of the toolbar.
 * @slot toolbar-end - Your own controls at the end of the toolbar.
 * @fires loomi-tool - `detail: { id, insertText, insertHTML }` when a `customTools` button is clicked.
 * @fires input - Native input event (composed).
 * @fires change - Native change event (composed).
 */
@customElement("loomi-text-editor")
export class LoomiTextEditor extends LoomiElement {
  static override styles = loomiStyles(fieldStyles, componentStyles);
  static formAssociated = true;

  private internals = this.attachInternals();
  private readonly instanceId = randomSuffix();
  private validationVisible = false;
  private initialValue = "";
  private valueSetFromEditor = false;
  /** The value as of the last `change` (or programmatic set); blur only fires `change` past it. */
  private committedValue = "";
  private savedRange: Range | null = null;
  private embedFiles: File[] = [];
  /**
   * The last selection made inside the editor. Clicking a button outside the editor (an
   * app's own toolbar) moves focus and the live selection away, so the public insert
   * methods put the caret back here first.
   */
  private lastRange: Range | null = null;
  /** Set when the surface fires `input` while {@link command} runs; see there. */
  private inputDuringCommand = false;
  private readonly onSelectionChange = (): void => {
    const range = this.currentRange();
    if (range) this.lastRange = range.cloneRange();
    this.updateToolbarState();
  };

  @property({ reflect: true }) name = "";
  @property() label = "";
  @property({ attribute: "label-position", reflect: true })
  labelPosition: LoomiFieldLabelPosition = "default";
  @property() locale = "";
  @property() placeholder = "";
  private _value = "";
  /** Current value. Like a native input's, anything assigned is coerced to a string (`null`/`undefined` become `""`). */
  @property()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = toControlValue(value);
  }
  @property() tools: LoomiTextEditorTools = "default";
  /**
   * App-defined toolbar buttons, rendered after the built-in tools with the same look,
   * tooltip and keyboard behaviour. Clicking one calls its `run(editor)` and fires
   * `loomi-tool`. Property only.
   */
  @property({ attribute: false }) customTools: readonly LoomiTextEditorCustomTool[] = [];
  @property({ type: Number }) rows = 3;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ attribute: "error-message" }) errorMessage = "";
  @property({ type: Boolean, attribute: "show-error-inline" }) showErrorInline = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property() variant: LoomiTextEditorVariant = "default";
  @property({ type: Boolean, attribute: "no-file-upload", reflect: true }) noFileUpload = false;

  /**
   * Property only — a function can't be expressed as an attribute, so set it in JS
   * (`editor.uploadHandler = fn`), the same way `<loomi-input>`'s `dynamicMask` works.
   * Unset, picked files keep falling back to an inline `data:` URL.
   */
  @property({ attribute: false }) uploadHandler?: LoomiTextEditorUploadHandler;

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
    if (!this.hasUpdated) this.initialValue = this.value;
    super.connectedCallback();
    document.addEventListener("selectionchange", this.onSelectionChange);
  }

  formResetCallback(): void {
    this.value = this.initialValue;
    this.validationVisible = false;
    this.invalid = false;
    this.savedRange = null;
    this.lastRange = null;
    this.resetEmbedDialog();
    this.embedModalEl?.hide();
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
    if (
      changed.has("value") ||
      changed.has("required") ||
      changed.has("disabled") ||
      changed.has("readonly")
    ) {
      this.internals.setFormValue(this.value);
      this.syncValidity();
    }
  }

  override updated(changed: PropertyValues<this>): void {
    if (changed.has("value")) {
      if (this.valueSetFromEditor) this.valueSetFromEditor = false;
      else {
        this.committedValue = this.value;
        this.syncEditorFromValue();
        this.syncValidity();
      }
    }
  }

  override focus(): void {
    this.editorEl?.focus();
  }

  /**
   * Inserts plain text at the caret, replacing any selected text, then updates `value`
   * and fires `input`. If focus has moved to a button outside the editor, the editor's
   * last selection is restored first; with no selection yet, the text goes at the end.
   */
  insertText(text: string): void {
    this.insertAtSelection("insertText", text);
  }

  /**
   * Inserts HTML at the caret, like {@link insertText}. The markup is inserted as given:
   * sanitize anything that didn't come from your own code before passing it in.
   */
  insertHTML(html: string): void {
    this.insertAtSelection("insertHTML", html);
  }

  /**
   * The editor's current selection as plain text and HTML (the last selection, if focus
   * has moved elsewhere), or `null` when nothing inside the editor was ever selected.
   * A collapsed caret returns empty strings.
   */
  getSelection(): { text: string; html: string } | null {
    const range = this.currentRange() ?? this.lastRange;
    if (!range) return null;
    const holder = document.createElement("div");
    holder.append(range.cloneContents());
    return { text: range.toString(), html: holder.innerHTML };
  }

  private insertAtSelection(command: "insertText" | "insertHTML", value: string): void {
    if (this.disabled || this.readonly || !this.editorEl) return;
    this.restoreLastSelection();
    this.command(command, value);
  }

  /**
   * A caret at the end of the content, inside its last block. Collapsing a range over
   * the whole surface puts it after the last `<p>`, where Firefox inserts outside the
   * paragraph; descend to the last node instead.
   */
  private endOfContentRange(): Range {
    const range = document.createRange();
    let node: Node = this.editorEl;
    while (node.lastChild) node = node.lastChild;
    if (node.nodeType === Node.TEXT_NODE) {
      range.setStart(node, node.textContent?.length ?? 0);
    } else if (node !== this.editorEl && node.nodeName === "BR") {
      range.setStartBefore(node);
    } else {
      range.selectNodeContents(node);
      range.collapse(false);
    }
    range.collapse(true);
    return range;
  }

  /** Puts the caret back where it last was in the editor, or at the end if it never was. */
  private restoreLastSelection(): void {
    if (this.currentRange()) return;
    this.focus();
    let range = this.lastRange;
    if (!range || !this.editorEl.contains(range.commonAncestorContainer)) {
      range = this.endOfContentRange();
    }
    this.applyRange(range);
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
    const message = empty
      ? this.errorMessage || loomiT("validation.requiredField", {}, this.locale)
      : "";
    if (this.editorEl) this.internals.setValidity(validity, message, this.editorEl);
    else this.internals.setValidity(validity, message);
    return !empty;
  }

  private showValidation(): void {
    this.validationVisible = true;
    this.syncValidity(true);
  }

  private handleInput(event: Event): void {
    // The native `input` event is composed and would reach the host as a second `input`;
    // re-fire our own once `value` is up to date.
    event.stopPropagation();
    this.inputDuringCommand = true;
    this.syncValueFromEditor();
    this.updateToolbarState();
    this.emit("input");
  }

  private handleBlur(): void {
    this.showValidation();
    // Like a native field, commit only when the content changed since the last commit.
    if (this.value === this.committedValue) return;
    this.committedValue = this.value;
    this.emit("change");
  }

  private emit(type: "input" | "change"): void {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  private captureSelection(): void {
    const range = this.currentRange();
    this.savedRange = range ? range.cloneRange() : null;
  }

  /** Slotted toolbar controls may take focus; remember where the caret was first. */
  private captureLastSelection(): void {
    const range = this.currentRange();
    if (range) this.lastRange = range.cloneRange();
  }

  private keepToolbarFocus(event: MouseEvent): void {
    this.captureSelection();
    event.preventDefault();
  }

  private command(name: string, value?: string): void {
    if (this.disabled || this.readonly) return;
    this.focus();
    // execCommand fires the surface's own `input` (handled, and re-fired from the host, by
    // handleInput) in current engines; emit here only when it didn't, so one edit is one
    // `input`.
    this.inputDuringCommand = false;
    document.execCommand(name, false, value);
    this.syncValueFromEditor();
    this.updateToolbarState();
    if (!this.inputDuringCommand) this.emit("input");
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
    this.applyRange(this.savedRange);
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

  /**
   * Turns a file picked in the embed dialog into the `src` to insert. With an
   * `uploadHandler` set, that's whatever URL the app's upload resolves to; without one,
   * the legacy inline `data:` URL. Returns `""` when nothing should be inserted — every
   * such path notifies the user first, since a silently dropped upload is the exact
   * failure mode this hook exists to remove.
   */
  private async resolveFileSrc(file: File, kind: LoomiTextEditorUploadKind): Promise<string> {
    if (!this.uploadHandler) {
      try {
        return await readFileAsDataUrl(file);
      } catch (error) {
        this.notifyEmbedFailure(kind, error);
        return "";
      }
    }

    try {
      const uploaded = await this.uploadHandler(file, kind);
      const src = uploaded ? trustedMediaUrl(uploaded) : "";
      if (!src) this.notifyEmbedFailure(kind);
      return src;
    } catch (error) {
      this.notifyEmbedFailure(kind, error);
      return "";
    }
  }

  private notifyEmbedFailure(kind: LoomiTextEditorUploadKind, error?: unknown): void {
    const reason = error instanceof Error && error.message ? error.message : "";
    // Lazy import, matching input/filepicker: apps whose uploads never fail don't pay for
    // the toast system.
    void import("@loomidev/notification").then(({ showLoomiNotification }) =>
      showLoomiNotification(
        kind === "image" ? "Image upload failed" : "Video upload failed",
        reason || `The ${kind} could not be uploaded, so nothing was inserted.`,
        "error",
        undefined,
        `loomi-text-editor-upload-${this.name || this.instanceId}`,
      ),
    );
  }

  private async confirmImage(): Promise<boolean> {
    const file = this.embedFiles.find((item) => item.type.startsWith("image/"));
    const src = file ? await this.resolveFileSrc(file, "image") : safeUrl(this.embedUrl);
    if (!src) return false;
    this.restoreSavedSelection();
    this.insertHtml(`<img src="${escapeHtml(src)}" alt="${escapeHtml(this.embedAlt)}">`);
    return true;
  }

  private async confirmVideo(): Promise<boolean> {
    const file = this.embedFiles.find((item) => item.type.startsWith("video/"));
    if (file) {
      const src = await this.resolveFileSrc(file, "video");
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
    return this.currentRange()?.toString() ?? "";
  }

  /**
   * The Selection that can see into this shadow root. Chromium exposes it on the shadow
   * root itself; elsewhere the document's selection holds it, but may report it retargeted
   * to the host, which is what `getComposedRanges` in {@link currentRange} is for.
   */
  private selectionObject(): Selection | null {
    const root = this.shadowRoot as (ShadowRoot & { getSelection?: () => Selection | null }) | null;
    return root?.getSelection?.() ?? document.getSelection();
  }

  /**
   * Selects `range`. `setBaseAndExtent` rather than `addRange`: WebKit silently rejects a
   * range added to the document selection when its nodes are inside a shadow root.
   */
  private applyRange(range: Range): void {
    this.selectionObject()?.setBaseAndExtent(
      range.startContainer,
      range.startOffset,
      range.endContainer,
      range.endOffset,
    );
  }

  /** The live selection's range, if it lies inside the editable surface. */
  private currentRange(): Range | null {
    const selection = this.selectionObject();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (this.rangeInsideEditor(range)) return range;
    const composed = this.composedRange(selection);
    return composed && this.rangeInsideEditor(composed) ? composed : null;
  }

  private composedRange(selection: Selection): Range | null {
    const getComposedRanges = (
      selection as Selection & { getComposedRanges?: (...args: unknown[]) => StaticRange[] }
    ).getComposedRanges;
    if (!getComposedRanges || !this.shadowRoot) return null;
    let ranges: StaticRange[];
    try {
      ranges = getComposedRanges.call(selection, { shadowRoots: [this.shadowRoot] });
    } catch {
      // Safari 17 takes the shadow roots as plain arguments.
      ranges = getComposedRanges.call(selection, this.shadowRoot);
    }
    const [staticRange] = ranges;
    if (!staticRange) return null;
    const range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    return range;
  }

  private rangeInsideEditor(range: Range): boolean {
    if (!this.editorEl) return false;
    const container = range.commonAncestorContainer;
    return this.editorEl === container || this.editorEl.contains(container);
  }

  private updateToolbarState(): void {
    if (!this.editorEl) return;
    if (!this.currentRange()) {
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
        if (/^h[1-6]$/.test(tag) || tag === "blockquote" || tag === "pre" || tag === "p")
          return tag;
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
      return this.renderToolbarSelect(tool, FONT_FAMILIES, "Font", "", (value) =>
        this.setFontFamily(value),
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
        @loomi-select=${(event: CustomEvent<{ value: string }>) => onSelect(event.detail.value)}
        @input=${stopEvent}
        @change=${stopEvent}
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
          @input=${(event: Event) => {
            event.stopPropagation();
            this.setColor(command, (event.target as HTMLInputElement).value);
          }}
          @change=${stopEvent}
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
      @input=${(event: Event) => {
        event.stopPropagation();
        onInput((event.target as HTMLInputElement & { value: string }).value);
      }}
      @change=${stopEvent}
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
      @input=${stopEvent}
      @change=${(event: Event) => {
        event.stopPropagation();
        this.onEmbedFileChange(event as CustomEvent<{ files: File[] }>);
      }}
    ></loomi-filepicker>`;
  }

  private renderEmbedUpload(
    kind: LoomiTextEditorUploadKind,
    separator: string,
  ): TemplateResult | typeof nothing {
    if (this.noFileUpload) return nothing;
    return html`<div class="loomi-embed-separator">${separator}</div>
      ${this.renderEmbedFilepicker(kind)}`;
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
        ${this.renderEmbedUpload("image", "Or choose an image file")}
      </div>`;
    }

    return html`<div class="loomi-embed-form">
      ${this.renderEmbedInput("Video URL", this.embedUrl, "video-camera", (value) => (this.embedUrl = value))}
      ${this.renderEmbedUpload("video", "Or choose a video file")}
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
      size="regular"
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

  private renderCustomTool(tool: LoomiTextEditorCustomTool): TemplateResult {
    const content = html`<button
      class="loomi-tool-button loomi-custom-tool"
      type="button"
      part="custom-tool"
      data-tool=${tool.id}
      aria-label=${tool.label}
      ?disabled=${this.disabled || this.readonly}
      @mousedown=${this.keepToolbarFocus}
      @click=${() => this.runCustomTool(tool)}
    >
      ${
        tool.icon
          ? html`<loomi-icon
              name=${tool.icon}
              source=${tool.iconSource ?? nothing}
              size="1rem"
              stroke-width="1.8"
            ></loomi-icon>`
          : tool.text || tool.label
      }
    </button>`;
    return this.renderTooltip(tool.label, content);
  }

  private runCustomTool(tool: LoomiTextEditorCustomTool): void {
    if (this.disabled || this.readonly) return;
    tool.run?.(this);
    this.dispatchEvent(
      new CustomEvent<LoomiTextEditorToolDetail>("loomi-tool", {
        bubbles: true,
        composed: true,
        detail: {
          id: tool.id,
          insertText: (text: string) => this.insertText(text),
          insertHTML: (markup: string) => this.insertHTML(markup),
        },
      }),
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
    const hasToolbar =
      tools.length > 0 ||
      this.customTools.length > 0 ||
      !!this.querySelector(':scope > [slot="toolbar-start"], :scope > [slot="toolbar-end"]');
    const text = this.editorEl?.textContent ?? stripTags(this.value);
    const isEmpty = text.trim() === "";
    const labelEl = hasLabel
      ? html`<label class="loomi-label loomi-label-static"
          >${this.label}${this.required ? html`<span class="loomi-req">*</span>` : nothing}</label
        >`
      : nothing;

    return html`
      ${this.labelPosition === "inside" ? nothing : labelEl}
      <div class="loomi-field variant-${this.variant}" part="field">
        ${this.labelPosition === "inside" ? labelEl : nothing}
        ${
          hasToolbar
            ? html`<div class="loomi-toolbar" part="toolbar" role="toolbar">
              <slot name="toolbar-start" @mousedown=${this.captureLastSelection}></slot>
              ${tools.map((tool) => this.renderTool(tool))}
              ${this.customTools.map((tool) => this.renderCustomTool(tool))}
              <slot name="toolbar-end" @mousedown=${this.captureLastSelection}></slot>
            </div>`
            : nothing
        }
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

/** An app-defined toolbar button for {@link LoomiTextEditor.customTools}. */
export interface LoomiTextEditorCustomTool {
  /** Identifies the tool in the `loomi-tool` event. */
  id: string;
  /** Accessible name and tooltip. */
  label: string;
  /** Icon name, looked up in `iconSource` (Heroicons by default). */
  icon?: string;
  iconSource?: "heroicons" | "iconsax" | "untitledui";
  /** Short text shown when there's no icon, e.g. `"√x"`. Falls back to `label`. */
  text?: string;
  /** Called on click, before `loomi-tool` fires. */
  run?: (editor: LoomiTextEditor) => void;
}

export interface LoomiTextEditorToolDetail {
  id: string;
  insertText: (text: string) => void;
  insertHTML: (html: string) => void;
}

export interface LoomiTextEditorAiGenerateDetail {
  html: string;
  selection: string;
  insert: (html: string) => void;
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-text-editor": LoomiTextEditor;
  }

  interface HTMLElementEventMap {
    "loomi-ai-generate": CustomEvent<LoomiTextEditorAiGenerateDetail>;
    "loomi-tool": CustomEvent<LoomiTextEditorToolDetail>;
  }
}
