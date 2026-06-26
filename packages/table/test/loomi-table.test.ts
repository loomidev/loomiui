import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../dist/loomi-table.js";
import type { LoomiTable } from "../dist/index.js";

describe("loomi-table", () => {
  it("honors Bladewind-style underscore aliases and false string booleans", async () => {
    const el = await fixture<LoomiTable>(
      html`<loomi-table has_shadow="false" has_border="true" include_columns="name,team"></loomi-table>`,
    );
    el.data = [
      { id: 1, name: "Ama", team: "Design", email: "ama@example.com" },
      { id: 2, name: "Kojo", team: "Engineering", email: "kojo@example.com" },
    ];
    await el.updateComplete;

    const scroll = el.shadowRoot!.querySelector(".loomi-scroll")!;
    const headings = [...el.shadowRoot!.querySelectorAll("thead th")].map((th) => th.textContent!.trim());
    expect(scroll.classList.contains("bordered")).to.equal(true);
    expect(scroll.classList.contains("shadow")).to.equal(false);
    expect(headings).to.deep.equal(["name", "team"]);
  });

  it("groups dynamic rows and toggles selectable row state", async () => {
    const el = await fixture<LoomiTable>(html`<loomi-table selectable groupby="department"></loomi-table>`);
    el.data = [
      { id: 1, name: "Ama", department: "Design" },
      { id: 2, name: "Kojo", department: "Design" },
      { id: 3, name: "Esi", department: "Support" },
    ];
    await el.updateComplete;

    const groupRows = el.shadowRoot!.querySelectorAll(".loomi-group-row");
    const firstDataRow = el.shadowRoot!.querySelector<HTMLTableRowElement>("tbody tr:not(.loomi-group-row)")!;
    const selection = oneEvent(el, "selection-change") as Promise<CustomEvent>;
    firstDataRow.click();
    const event = await selection;
    await el.updateComplete;
    const selectedRow = el.shadowRoot!.querySelector<HTMLTableRowElement>("tbody tr:not(.loomi-group-row)")!;

    expect(groupRows.length).to.equal(2);
    expect(event.detail.ids).to.deep.equal(["1"]);
    expect(el.selectedValue).to.equal("1");
    expect(selectedRow.classList.contains("selected")).to.equal(true);
  });

  it("renders an empty state with CTA support", async () => {
    const el = await fixture<LoomiTable>(
      html`<loomi-table
        message_as_empty_state="true"
        show_image="false"
        heading="No staff"
        button_label="Add staff"
        no_data_message="The staff directory is empty"
      ></loomi-table>`,
    );
    el.columnAliases = { id: "ref #", name: "name" };
    await el.updateComplete;

    const button = el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-empty-button")!;
    const action = oneEvent(el, "empty-action");
    button.click();
    await action;

    expect(el.shadowRoot!.querySelector(".loomi-empty-heading")!.textContent).to.equal("No staff");
    expect(button.textContent).to.equal("Add staff");
  });

  it("renders custom row templates through paginated dynamic data", async () => {
    const el = await fixture<LoomiTable>(html`
      <loomi-table layout="custom" paginated page_size="1" show_total_pages="true">
        <template slot="header"><th>User</th></template>
        <template slot="row"><tr><td>{name} &lt;{email}&gt;</td></tr></template>
      </loomi-table>
    `);
    el.data = [
      { id: 1, name: "Ama", email: "ama@example.com" },
      { id: 2, name: "Kojo", email: "kojo@example.com" },
    ];
    await el.updateComplete;

    const bodyText = el.shadowRoot!.querySelector("tbody")!.textContent!;
    const pagination = el.shadowRoot!.querySelector<HTMLElement & { showTotalPages: boolean }>("loomi-pagination")!;
    expect(bodyText).to.contain("Ama <ama@example.com>");
    expect(pagination.showTotalPages).to.equal(true);
  });
});
