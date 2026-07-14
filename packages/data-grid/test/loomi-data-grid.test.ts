import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-data-grid.js";
import type { LoomiDataGrid } from "../dist/index.js";
import { filteringModule } from "../dist/modules/filtering.js";
import { exportModule } from "../dist/modules/export.js";
import { rowGroupingModule } from "../dist/modules/row-grouping.js";
import { inlineEditingModule } from "../dist/modules/inline-editing.js";
import { savedViewsModule } from "../dist/modules/saved-views.js";

interface Person extends Record<string, unknown> {
  id: string;
  name: string;
  age: number;
  department: string;
}

const people: Person[] = [
  { id: "1", name: "Ama", age: 32, department: "Engineering" },
  { id: "2", name: "Kojo", age: 28, department: "Engineering" },
  { id: "3", name: "Zainab", age: 41, department: "Sales" },
  { id: "4", name: "Yaw", age: 24, department: "Sales" },
];

const columns = [
  { key: "name", label: "Name", sortable: true, editable: true, filterable: true },
  { key: "age", label: "Age", sortable: true, align: "end" as const },
  { key: "department", label: "Department" },
];

async function renderGrid(overrides: Partial<LoomiDataGrid<Person>> = {}) {
  const el = await fixture<LoomiDataGrid<Person>>(html`<loomi-data-grid></loomi-data-grid>`);
  el.columns = columns;
  el.data = people;
  Object.assign(el, overrides);
  await el.updateComplete;
  return el;
}

describe("loomi-data-grid (core)", () => {
  it("renders a header cell per column and a data row per record", async () => {
    const el = await renderGrid();
    const headers = el.shadowRoot!.querySelectorAll("thead th");
    const rows = el.shadowRoot!.querySelectorAll("tbody tr");
    expect(headers).to.have.length(3);
    expect(rows).to.have.length(4);
  });

  it("sorts ascending then descending then back to unsorted on repeated header clicks", async () => {
    const el = await renderGrid();
    const nameHeaderButton = el.shadowRoot!.querySelector(".sort-button") as HTMLButtonElement;

    nameHeaderButton.click();
    await el.updateComplete;
    expect(el.sort).to.deep.equal({ key: "name", direction: "asc" });
    let firstRowName = el.shadowRoot!.querySelector("tbody tr td")!.textContent!.trim();
    expect(firstRowName).to.equal("Ama");

    nameHeaderButton.click();
    await el.updateComplete;
    expect(el.sort).to.deep.equal({ key: "name", direction: "desc" });
    firstRowName = el.shadowRoot!.querySelector("tbody tr td")!.textContent!.trim();
    expect(firstRowName).to.equal("Zainab");

    nameHeaderButton.click();
    await el.updateComplete;
    expect(el.sort).to.equal(null);
  });

  it("paginates rows and emits loomi-page-change", async () => {
    const el = await renderGrid({ pageSize: 2 });
    expect(el.shadowRoot!.querySelectorAll("tbody tr")).to.have.length(2);

    const nextButton = [...el.shadowRoot!.querySelectorAll(".pagination button")].find(
      (button) => button.textContent?.trim() === "Next",
    ) as HTMLButtonElement;

    const eventPromise = oneEvent(el, "loomi-page-change");
    nextButton.click();
    const event = await eventPromise;
    expect(event.detail.page).to.equal(2);
    await el.updateComplete;
    expect(el.page).to.equal(2);
  });

  it("selects rows via checkboxes and emits loomi-selection-change", async () => {
    const el = await renderGrid({ selectable: true });
    const firstRowCheckbox = el.shadowRoot!.querySelector(
      "tbody tr input[type=checkbox]",
    ) as HTMLInputElement;

    const eventPromise = oneEvent(el, "loomi-selection-change");
    firstRowCheckbox.click();
    const event = await eventPromise;
    expect(event.detail.selectedKeys).to.deep.equal(["1"]);
    expect(el.selectedKeys).to.deep.equal(["1"]);
  });

  it("supports keyboard navigation between cells and Enter for row actions", async () => {
    const el = await renderGrid();
    const table = el.shadowRoot!.querySelector("table")!;
    const firstCell = el.shadowRoot!.querySelector(
      'td[data-row-index="0"][data-col-index="0"]',
    ) as HTMLElement;
    firstCell.focus();

    table.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(
      el
        .shadowRoot!.querySelector('td[data-row-index="0"][data-col-index="1"]')!
        .getAttribute("data-active-cell"),
    ).to.equal("true");

    const rowActionPromise = oneEvent(el, "loomi-row-action");
    table.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
    );
    const rowActionEvent = await rowActionPromise;
    expect((rowActionEvent.detail.row as Person).id).to.equal("1");
  });

  it("renders custom cell content via column.cellRenderer", async () => {
    const el = await renderGrid({
      columns: [
        ...columns,
        {
          key: "id",
          label: "Badge",
          cellRenderer: ({ value }) => html`<span class="badge">#${value}</span>`,
        },
      ],
    });
    expect(el.shadowRoot!.querySelector(".badge")!.textContent).to.equal("#1");
  });

  it("renders a resize handle for resizable columns and emits loomi-column-resize", async () => {
    const el = await renderGrid();
    const handle = el.shadowRoot!.querySelector(".resize-handle") as HTMLElement;
    expect(handle).to.exist;

    handle.setPointerCapture = () => {};
    const eventPromise = oneEvent(el, "loomi-column-resize");
    handle.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 100, pointerId: 1, bubbles: true }),
    );
    handle.dispatchEvent(new PointerEvent("pointermove", { clientX: 140, pointerId: 1 }));
    handle.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1 }));
    const event = await eventPromise;
    expect(event.detail.key).to.equal("name");
  });

  it("applies sticky pinning classes for start- and end-pinned columns", async () => {
    const el = await renderGrid({
      columns: [
        { key: "name", label: "Name", pinned: "start", width: "120px" },
        { key: "age", label: "Age", align: "end" as const },
        { key: "department", label: "Department", pinned: "end", width: "140px" },
      ],
    });

    expect(el.shadowRoot!.querySelector("th.pinned-start")).to.exist;
    expect(el.shadowRoot!.querySelector("th.pinned-end")).to.exist;
    expect(el.shadowRoot!.querySelector("td.pinned-start")!.getAttribute("style")).to.include(
      "left:",
    );
    expect(el.shadowRoot!.querySelector("td.pinned-end")!.getAttribute("style")).to.include(
      "right:",
    );
  });

  it("pins the selection column when selectable is enabled", async () => {
    const el = await renderGrid({ selectable: true });
    expect(el.shadowRoot!.querySelector("th.pin-select-column")).to.exist;
    expect(el.shadowRoot!.querySelector("td.pin-select-column")).to.exist;
  });
});

describe("loomi-data-grid modules", () => {
  it("filteringModule narrows rows with the global search box", async () => {
    const el = await renderGrid({ modules: [filteringModule()] });
    const searchInput = el.shadowRoot!.querySelector('input[type="search"]') as HTMLInputElement;

    searchInput.value = "zainab";
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;

    const rows = el.shadowRoot!.querySelectorAll("tbody tr");
    expect(rows).to.have.length(1);
    expect(rows[0].textContent).to.include("Zainab");
  });

  it("exportModule renders an export button and dispatches loomi-export-request", async () => {
    const el = await renderGrid({ modules: [exportModule({ formats: ["json"] })] });
    const button = el.shadowRoot!.querySelector(".toolbar button") as HTMLButtonElement;
    expect(button.textContent).to.include("JSON");

    const eventPromise = oneEvent(el, "loomi-export-request");
    button.click();
    const event = await eventPromise;
    expect(event.detail.rows).to.have.length(4);
  });

  it("rowGroupingModule groups rows and toggles collapse/expand", async () => {
    const el = await renderGrid({ modules: [rowGroupingModule({ groupBy: "department" })] });
    let groupRows = el.shadowRoot!.querySelectorAll("tr.loomi-grid-row-group");
    expect(groupRows).to.have.length(2);

    const firstToggle = el.shadowRoot!.querySelector(".group-toggle") as HTMLButtonElement;
    firstToggle.click();
    await el.updateComplete;

    groupRows = el.shadowRoot!.querySelectorAll("tr.loomi-grid-row-group");
    expect(groupRows[0].getAttribute("aria-expanded")).to.equal(null);
    expect(groupRows.length).to.equal(2);
  });

  it("inlineEditingModule edits a cell and emits loomi-cell-edit", async () => {
    const el = await renderGrid({ modules: [inlineEditingModule()] });
    const firstCell = el.shadowRoot!.querySelector(
      'td[data-row-index="0"][data-col-index="0"]',
    ) as HTMLElement;

    firstCell.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, composed: true }));
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector(
      'td[data-row-index="0"][data-col-index="0"] input',
    ) as HTMLInputElement;
    expect(input).to.exist;
    input.value = "Amara";

    const eventPromise = oneEvent(el, "loomi-cell-edit");
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const event = await eventPromise;
    expect(event.detail.value).to.equal("Amara");
    expect(el.data[0].name).to.equal("Amara");
  });

  it("savedViewsModule applies a preset and emits loomi-saved-view-change", async () => {
    const el = await renderGrid({
      modules: [
        filteringModule(),
        savedViewsModule({
          views: [
            { id: "sales", label: "Sales team", filters: [{ key: "department", value: "Sales" }] },
          ],
        }),
      ],
    });

    const select = el.shadowRoot!.querySelector(
      'select[aria-label="Saved view"]',
    ) as HTMLSelectElement;
    expect(select).to.exist;

    const eventPromise = oneEvent(el, "loomi-saved-view-change");
    select.value = "sales";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    const event = await eventPromise;
    await el.updateComplete;

    expect(event.detail.viewId).to.equal("sales");
    const rows = el.shadowRoot!.querySelectorAll("tbody tr");
    expect(rows).to.have.length(2);
    expect(rows[0].textContent).to.include("Zainab");
  });

  it("savedViewsModule applies activeViewId on attach when listed after filteringModule", async () => {
    const el = await renderGrid({
      modules: [
        filteringModule(),
        savedViewsModule({
          views: [
            { id: "sales", label: "Sales team", filters: [{ key: "department", value: "Sales" }] },
          ],
          activeViewId: "sales",
        }),
      ],
    });

    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;

    const rows = el.shadowRoot!.querySelectorAll("tbody tr");
    expect(rows).to.have.length(2);
  });
});
