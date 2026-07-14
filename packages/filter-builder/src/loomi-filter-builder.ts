import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { LoomiElement, loomiStyles } from "@loomidev/core";
import type {
  FilterBuilderApplyDetail,
  FilterBuilderChangeDetail,
  FilterBuilderField,
  FilterBuilderFieldType,
  FilterBuilderLogic,
  FilterBuilderOperator,
  FilterBuilderRule,
  FilterBuilderValue,
} from "./types.js";

const OPERATORS_BY_TYPE: Record<FilterBuilderFieldType, FilterBuilderOperator[]> = {
  text: ["contains", "equals", "notEquals", "startsWith", "endsWith"],
  number: ["equals", "notEquals", "gt", "gte", "lt", "lte"],
  date: ["equals", "before", "after"],
  boolean: ["isTrue", "isFalse"],
  select: ["equals", "notEquals"],
};

const OPERATOR_LABELS: Record<FilterBuilderOperator, string> = {
  contains: "contains",
  equals: "equals",
  notEquals: "does not equal",
  startsWith: "starts with",
  endsWith: "ends with",
  gt: "is greater than",
  gte: "is greater than or equal to",
  lt: "is less than",
  lte: "is less than or equal to",
  before: "is before",
  after: "is after",
  isTrue: "is true",
  isFalse: "is false",
};

function createRuleId() {
  return `rule-${Math.random().toString(36).slice(2, 8)}`;
}

@customElement("loomi-filter-builder")
export class LoomiFilterBuilder extends LoomiElement {
  static properties = {
    ...LoomiElement.properties,
    fields: { attribute: false },
    rules: { attribute: false },
    logic: { reflect: true },
    title: {},
    addLabel: { attribute: "add-label" },
    applyLabel: { attribute: "apply-label" },
    emptyLabel: { attribute: "empty-label" },
    showApply: { attribute: "show-apply", type: Boolean, reflect: true },
  };

  static override styles = loomiStyles(css`
    :host {
      --loomi-filter-border: var(--loomi-surface-border, #d9dee3);
      --loomi-filter-muted: var(--loomi-text-muted, #62717d);
      --loomi-filter-surface: var(--loomi-surface);
      --loomi-filter-surface-muted: var(--loomi-surface-muted, #f6f8fa);
      --loomi-filter-surface-hover: var(--loomi-surface-hover, #f9fbfc);
      --loomi-filter-text: var(--loomi-text, #172026);
      --loomi-filter-text-secondary: var(--loomi-text-secondary, #33424f);
      --loomi-filter-accent: var(--loomi-primary-600, var(--_loomi-primary-600-default, #2563eb));
      --loomi-filter-accent-soft: var(--loomi-primary-50, var(--_loomi-primary-50-default, #eff6ff));
      display: block;
      color: var(--loomi-filter-text);
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    }

    .shell {
      display: grid;
      gap: 12px;
      border: 1px solid var(--loomi-filter-border);
      border-radius: 8px;
      background: var(--loomi-filter-surface);
      padding: 12px;
    }

    .header,
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .title {
      margin: 0;
      color: var(--loomi-filter-text-secondary);
      font-size: 14px;
      font-weight: 700;
    }

    .logic {
      display: inline-flex;
      border: 1px solid var(--loomi-filter-border);
      border-radius: 6px;
      overflow: hidden;
    }

    .logic button,
    .command {
      min-height: 34px;
      border: 0;
      background: var(--loomi-filter-surface);
      color: inherit;
      padding: 0 10px;
      font: inherit;
      cursor: pointer;
    }

    .logic button[aria-pressed="true"] {
      background: var(--loomi-filter-accent-soft);
      color: var(--loomi-filter-accent);
      font-weight: 700;
    }

    .rules {
      display: grid;
      gap: 8px;
    }

    .rule {
      display: grid;
      grid-template-columns: minmax(140px, 1fr) minmax(160px, 1fr) minmax(140px, 1fr) auto;
      gap: 8px;
      align-items: center;
      border: 1px solid var(--loomi-filter-border);
      border-radius: 8px;
      background: var(--loomi-filter-surface-muted);
      padding: 8px;
    }

    select,
    input {
      min-height: 36px;
      min-width: 0;
      border: 1px solid var(--loomi-filter-border);
      border-radius: 6px;
      background: var(--loomi-filter-surface);
      color: inherit;
      padding: 0 10px;
      font: inherit;
    }

    select:focus,
    input:focus {
      border-color: var(--loomi-filter-accent);
      outline: none;
      box-shadow: 0 0 0 3px var(--loomi-filter-accent-soft);
    }

    .remove {
      width: 36px;
      min-height: 36px;
      border: 1px solid var(--loomi-filter-border);
      border-radius: 6px;
      background: var(--loomi-filter-surface);
      color: var(--loomi-filter-muted);
      font: inherit;
      cursor: pointer;
    }

    .remove:hover,
    .command:hover {
      background: var(--loomi-filter-surface-hover);
    }

    .empty {
      border: 1px dashed var(--loomi-filter-border);
      border-radius: 8px;
      color: var(--loomi-filter-muted);
      padding: 18px;
      text-align: center;
    }

    .apply {
      border-radius: 6px;
      background: var(--loomi-filter-accent);
      color: var(--loomi-text-on-primary, var(--loomi-white));
      font-weight: 700;
    }

    @media (max-width: 720px) {
      .rule {
        grid-template-columns: 1fr;
      }

      .remove {
        width: 100%;
      }
    }
  `);

  fields: FilterBuilderField[] = [];
  rules: FilterBuilderRule[] = [];
  logic: FilterBuilderLogic = "and";
  title = "Filters";
  addLabel = "Add filter";
  applyLabel = "Apply filters";
  emptyLabel = "No filters added";
  showApply = true;

  render() {
    return html`
      <section class="shell">
        <header class="header">
          <h2 class="title">${this.title}</h2>
          <div class="logic" aria-label="Filter logic">
            ${this.renderLogicButton("and", "And")}
            ${this.renderLogicButton("or", "Or")}
          </div>
        </header>
        <div class="rules">
          ${
            this.rules.length === 0
              ? html`<div class="empty">${this.emptyLabel}</div>`
              : this.rules.map((rule) => this.renderRule(rule))
          }
        </div>
        <footer class="footer">
          <button class="command" type="button" @click=${this.addRule}>${this.addLabel}</button>
          ${
            this.showApply
              ? html`<button class="command apply" type="button" @click=${this.applyFilters}>${this.applyLabel}</button>`
              : nothing
          }
        </footer>
      </section>
    `;
  }

  private renderLogicButton(logic: FilterBuilderLogic, label: string) {
    return html`
      <button
        type="button"
        aria-pressed=${this.logic === logic ? "true" : "false"}
        @click=${() => this.updateLogic(logic)}
      >
        ${label}
      </button>
    `;
  }

  private renderRule(rule: FilterBuilderRule) {
    const field = this.getField(rule.field);
    const operators = this.getOperators(field);
    const valueHidden = rule.operator === "isTrue" || rule.operator === "isFalse";

    return html`
      <div class="rule">
        <select aria-label="Filter field" .value=${rule.field} @change=${(event: Event) => this.updateRuleField(rule.id, event)}>
          ${this.fields.map((fieldOption) => html`<option value=${fieldOption.key}>${fieldOption.label}</option>`)}
        </select>
        <select aria-label="Filter operator" .value=${rule.operator} @change=${(event: Event) => this.updateRuleOperator(rule.id, event)}>
          ${operators.map((operator) => html`<option value=${operator}>${OPERATOR_LABELS[operator]}</option>`)}
        </select>
        ${valueHidden ? html`<span></span>` : this.renderValueInput(rule, field)}
        <button class="remove" type="button" aria-label="Remove filter" @click=${() => this.removeRule(rule.id)}>
          X
        </button>
      </div>
    `;
  }

  private renderValueInput(rule: FilterBuilderRule, field: FilterBuilderField | undefined) {
    if (field?.type === "select") {
      return html`
        <select aria-label="Filter value" .value=${String(rule.value)} @change=${(event: Event) => this.updateRuleValue(rule.id, event)}>
          ${(field.options ?? []).map((option) => html`<option value=${option.value}>${option.label}</option>`)}
        </select>
      `;
    }

    const inputType =
      field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text";

    return html`
      <input
        aria-label="Filter value"
        type=${inputType}
        placeholder=${field?.placeholder ?? "Value"}
        .value=${String(rule.value ?? "")}
        @input=${(event: Event) => this.updateRuleValue(rule.id, event)}
      />
    `;
  }

  private addRule = () => {
    const firstField = this.fields[0];
    if (!firstField) {
      return;
    }

    const operator = this.getOperators(firstField)[0] ?? "equals";
    this.rules = [
      ...this.rules,
      {
        id: createRuleId(),
        field: firstField.key,
        operator,
        value: this.defaultValueForField(firstField, operator),
      },
    ];
    this.dispatchChange();
  };

  private removeRule(id: string) {
    this.rules = this.rules.filter((rule) => rule.id !== id);
    this.dispatchChange();
  }

  private updateLogic(logic: FilterBuilderLogic) {
    this.logic = logic;
    this.dispatchChange();
  }

  private updateRuleField(id: string, event: Event) {
    const fieldKey = (event.target as HTMLSelectElement).value;
    const field = this.getField(fieldKey);
    if (!field) {
      return;
    }

    const operator = this.getOperators(field)[0] ?? "equals";
    this.rules = this.rules.map((rule) =>
      rule.id === id
        ? { ...rule, field: field.key, operator, value: this.defaultValueForField(field, operator) }
        : rule,
    );
    this.dispatchChange();
  }

  private updateRuleOperator(id: string, event: Event) {
    const operator = (event.target as HTMLSelectElement).value as FilterBuilderOperator;

    this.rules = this.rules.map((rule) => {
      if (rule.id !== id) {
        return rule;
      }

      const field = this.getField(rule.field);
      return { ...rule, operator, value: this.defaultValueForField(field, operator, rule.value) };
    });
    this.dispatchChange();
  }

  private updateRuleValue(id: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;

    this.rules = this.rules.map((rule) => {
      if (rule.id !== id) {
        return rule;
      }

      const field = this.getField(rule.field);
      const value = field?.type === "number" ? Number(target.value) : target.value;
      return { ...rule, value };
    });
    this.dispatchChange();
  }

  private applyFilters = () => {
    this.dispatchEvent(
      new CustomEvent<FilterBuilderApplyDetail>("loomi-filter-apply", {
        bubbles: true,
        composed: true,
        detail: { value: this.getValue() },
      }),
    );
  };

  private dispatchChange() {
    this.dispatchEvent(
      new CustomEvent<FilterBuilderChangeDetail>("loomi-filter-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.getValue() },
      }),
    );
  }

  private getValue(): FilterBuilderValue {
    return {
      logic: this.logic,
      rules: this.rules,
    };
  }

  private getField(key: string) {
    return this.fields.find((field) => field.key === key);
  }

  private getOperators(field: FilterBuilderField | undefined) {
    if (!field) {
      return OPERATORS_BY_TYPE.text;
    }

    return field.operators ?? OPERATORS_BY_TYPE[field.type];
  }

  private defaultValueForField(
    field: FilterBuilderField | undefined,
    operator: FilterBuilderOperator,
    currentValue: unknown = "",
  ) {
    if (operator === "isTrue") {
      return true;
    }

    if (operator === "isFalse") {
      return false;
    }

    if (field?.type === "number") {
      return typeof currentValue === "number" ? currentValue : 0;
    }

    if (field?.type === "select") {
      return field.options?.[0]?.value ?? "";
    }

    return typeof currentValue === "string" ? currentValue : "";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "loomi-filter-builder": LoomiFilterBuilder;
  }

  interface HTMLElementEventMap {
    "loomi-filter-apply": CustomEvent<FilterBuilderApplyDetail>;
    "loomi-filter-change": CustomEvent<FilterBuilderChangeDetail>;
  }
}
