import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import type {
  CommandPaletteItem,
  CommandPaletteOpenChangeDetail,
  CommandPaletteQueryChangeDetail,
  CommandPaletteSelectDetail
} from "./types.js";

@customElement("loomi-command-palette")
export class LoomiCommandPalette extends LoomiElement {
  static properties = {
    ...LoomiElement.properties,
    items: { attribute: false },
    open: { type: Boolean, reflect: true },
    query: { reflect: true },
    placeholder: {},
    emptyTitle: { attribute: "empty-title" },
    emptyDescription: { attribute: "empty-description" },
    shortcut: {},
    _activeIndex: { state: true }
  };

  static override styles = loomiStyles(css`
    :host {
      --loomi-command-backdrop: rgb(15 23 42 / 0.42);
      --loomi-command-border: var(--loomi-surface-border, #d9dee3);
      --loomi-command-muted: var(--loomi-text-muted, #62717d);
      --loomi-command-surface: var(--loomi-surface);
      --loomi-command-surface-active: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
      --loomi-command-text: var(--loomi-text, #172026);
      --loomi-command-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
      --loomi-command-accent-strong: var(--loomi-primary-700, var(--_loomi-primary-700-default, #174ea6));
      color: var(--loomi-command-text);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .trigger {
      min-height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: 1px solid var(--loomi-command-border);
      border-radius: 6px;
      background: var(--loomi-command-surface);
      color: inherit;
      padding: 0 10px;
      font: inherit;
      cursor: pointer;
    }

    .shortcut {
      border: 1px solid var(--loomi-command-border);
      border-radius: 5px;
      color: var(--loomi-command-muted);
      padding: 2px 6px;
      font-size: 12px;
      line-height: 1.2;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: start center;
      background: var(--loomi-command-backdrop);
      padding: 12vh 16px 16px;
    }

    .dialog {
      width: min(680px, 100%);
      overflow: hidden;
      border: 1px solid var(--loomi-command-border);
      border-radius: 8px;
      background: var(--loomi-command-surface);
      box-shadow: 0 24px 80px rgb(15 23 42 / 0.24);
    }

    .search {
      width: 100%;
      min-height: 52px;
      box-sizing: border-box;
      border: 0;
      border-bottom: 1px solid var(--loomi-command-border);
      color: inherit;
      font: inherit;
      font-size: 16px;
      outline: none;
      padding: 0 16px;
    }

    .list {
      max-height: 420px;
      overflow: auto;
      padding: 8px;
    }

    .group {
      display: grid;
      gap: 4px;
      padding: 6px 0;
    }

    .group-label {
      color: var(--loomi-command-muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0;
      padding: 6px 8px 2px;
      text-transform: uppercase;
    }

    .item {
      width: 100%;
      min-height: 48px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 12px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      padding: 8px 10px;
      text-align: left;
      font: inherit;
      cursor: pointer;
    }

    .item[aria-selected="true"] {
      background: var(--loomi-command-surface-active);
      color: var(--loomi-command-accent-strong);
    }

    .item[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .item-main {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .label,
    .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .label {
      font-weight: 600;
    }

    .description {
      color: var(--loomi-command-muted);
      font-size: 13px;
    }

    .empty {
      padding: 40px 20px;
      text-align: center;
      color: var(--loomi-command-muted);
    }

    .empty strong {
      display: block;
      margin-bottom: 4px;
      color: var(--loomi-command-text);
      font-size: 16px;
    }

    @media (max-width: 640px) {
      .backdrop {
        padding: 0;
        place-items: stretch;
      }

      .dialog {
        width: 100%;
        min-height: 100dvh;
        border-radius: 0;
      }

      .list {
        max-height: none;
        flex: 1 1 auto;
      }
    }
  `);

  items: CommandPaletteItem[] = [];
  open = false;
  query = "";
  placeholder = "Search commands";
  emptyTitle = "No commands found";
  emptyDescription = "Try a different search term.";
  shortcut = "Cmd K";
  private _activeIndex = 0;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this.handleDocumentKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this.handleDocumentKeydown);
    super.disconnectedCallback();
  }

  render() {
    const filteredItems = this.getFilteredItems();

    return html`
      <button class="trigger" type="button" @click=${this.openPalette}>
        <span>${this.placeholder}</span>
        <span class="shortcut">${this.shortcut}</span>
      </button>
      ${this.open ? this.renderDialog(filteredItems) : nothing}
    `;
  }

  openPalette = () => {
    this.open = true;
    this._activeIndex = this.getFirstEnabledIndex(this.getFilteredItems());
    this.dispatchOpenChange();
    this.updateComplete.then(() => this.renderRoot.querySelector<HTMLInputElement>(".search")?.focus());
  };

  closePalette = () => {
    this.open = false;
    this.query = "";
    this._activeIndex = 0;
    this.dispatchOpenChange();
  };

  togglePalette = () => {
    if (this.open) {
      this.closePalette();
    } else {
      this.openPalette();
    }
  };

  private renderDialog(items: CommandPaletteItem[]) {
    return html`
      <div class="backdrop" @click=${this.handleBackdropClick}>
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          @click=${(event: Event) => event.stopPropagation()}
          @keydown=${this.handleDialogKeydown}
        >
          <input
            class="search"
            type="search"
            aria-label="Search commands"
            placeholder=${this.placeholder}
            .value=${this.query}
            @input=${this.handleQueryInput}
          />
          <div class="list" role="listbox" aria-label="Commands">
            ${items.length === 0 ? this.renderEmpty() : this.renderGroups(items)}
          </div>
        </section>
      </div>
    `;
  }

  private renderGroups(items: CommandPaletteItem[]) {
    const grouped = this.groupItems(items);
    let itemIndex = 0;

    return [...grouped.entries()].map(([groupName, groupItems]) => {
      return html`
        <div class="group">
          <div class="group-label">${groupName}</div>
          ${groupItems.map((item) => {
            const currentIndex = itemIndex;
            itemIndex += 1;
            return this.renderItem(item, currentIndex);
          })}
        </div>
      `;
    });
  }

  private renderItem(item: CommandPaletteItem, index: number) {
    return html`
      <button
        class="item"
        type="button"
        role="option"
        aria-selected=${this._activeIndex === index ? "true" : "false"}
        ?disabled=${item.disabled}
        @mouseenter=${() => {
          this._activeIndex = index;
        }}
        @click=${() => this.selectItem(item)}
      >
        <span class="item-main">
          <span class="label">${item.label}</span>
          ${item.description ? html`<span class="description">${item.description}</span>` : nothing}
        </span>
        ${item.shortcut ? html`<span class="shortcut">${item.shortcut}</span>` : nothing}
      </button>
    `;
  }

  private renderEmpty() {
    return html`
      <div class="empty">
        <strong>${this.emptyTitle}</strong>
        <span>${this.emptyDescription}</span>
      </div>
    `;
  }

  private handleDocumentKeydown = (event: KeyboardEvent) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

    if (!isShortcut) {
      return;
    }

    event.preventDefault();
    this.togglePalette();
  };

  private handleDialogKeydown = (event: KeyboardEvent) => {
    const items = this.getFilteredItems();

    if (event.key === "Escape") {
      event.preventDefault();
      this.closePalette();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.moveSelection(1, items);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.moveSelection(-1, items);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const item = items[this._activeIndex];
      if (item) {
        this.selectItem(item);
      }
    }
  };

  private handleBackdropClick = () => {
    this.closePalette();
  };

  private handleQueryInput = (event: Event) => {
    this.query = (event.target as HTMLInputElement).value;
    this._activeIndex = this.getFirstEnabledIndex(this.getFilteredItems());
    this.dispatchEvent(
      new CustomEvent<CommandPaletteQueryChangeDetail>("loomi-command-query-change", {
        bubbles: true,
        composed: true,
        detail: { query: this.query }
      })
    );
  };

  private selectItem(item: CommandPaletteItem) {
    if (item.disabled) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent<CommandPaletteSelectDetail>("loomi-command-select", {
        bubbles: true,
        composed: true,
        detail: { item }
      })
    );

    if (item.href) {
      window.location.assign(item.href);
    }

    this.closePalette();
  }

  private moveSelection(direction: 1 | -1, items: CommandPaletteItem[]) {
    if (items.length === 0) {
      this._activeIndex = 0;
      return;
    }

    let nextIndex = this._activeIndex;

    for (let attempts = 0; attempts < items.length; attempts += 1) {
      nextIndex = (nextIndex + direction + items.length) % items.length;
      if (!items[nextIndex].disabled) {
        this._activeIndex = nextIndex;
        return;
      }
    }
  }

  private getFilteredItems() {
    const query = this.query.trim().toLowerCase();

    if (!query) {
      return this.items;
    }

    return this.items.filter((item) => {
      const haystack = [item.label, item.description, item.group, item.href, ...(item.keywords ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }

  private groupItems(items: CommandPaletteItem[]) {
    const grouped = new Map<string, CommandPaletteItem[]>();

    for (const item of items) {
      const groupName = item.group ?? "Commands";
      grouped.set(groupName, [...(grouped.get(groupName) ?? []), item]);
    }

    return grouped;
  }

  private getFirstEnabledIndex(items: CommandPaletteItem[]) {
    const index = items.findIndex((item) => !item.disabled);
    return index === -1 ? 0 : index;
  }

  private dispatchOpenChange() {
    this.dispatchEvent(
      new CustomEvent<CommandPaletteOpenChangeDetail>("loomi-command-open-change", {
        bubbles: true,
        composed: true,
        detail: { open: this.open }
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-command-palette": LoomiCommandPalette;
  }
}
