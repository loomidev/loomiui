import { html, fixture, expect, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
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

    const scroll = el.shadowRoot!.querySelector(".loomi-shell")!;
    const headings = [...el.shadowRoot!.querySelectorAll("thead th")].map((th) =>
      th.textContent!.trim(),
    );
    expect(scroll.classList.contains("bordered")).to.equal(true);
    expect(scroll.classList.contains("shadow")).to.equal(false);
    expect(headings).to.deep.equal(["name", "team"]);
  });

  it("groups dynamic rows and toggles selectable row state", async () => {
    const el = await fixture<LoomiTable>(
      html`<loomi-table selectable groupby="department"></loomi-table>`,
    );
    el.data = [
      { id: 1, name: "Ama", department: "Design" },
      { id: 2, name: "Kojo", department: "Design" },
      { id: 3, name: "Esi", department: "Support" },
    ];
    await el.updateComplete;

    const groupRows = el.shadowRoot!.querySelectorAll(".loomi-group-row");
    const firstDataRow = el.shadowRoot!.querySelector<HTMLTableRowElement>(
      "tbody tr:not(.loomi-group-row)",
    )!;
    const selection = oneEvent(el, "loomi-selection-change") as Promise<CustomEvent>;
    firstDataRow.click();
    const event = await selection;
    await el.updateComplete;
    const selectedRow = el.shadowRoot!.querySelector<HTMLTableRowElement>(
      "tbody tr:not(.loomi-group-row)",
    )!;

    expect(groupRows.length).to.equal(2);
    expect(event.detail.ids).to.deep.equal(["1"]);
    expect(el.selectedValue).to.equal("1");
    expect(selectedRow.classList.contains("selected")).to.equal(true);
  });

  it("filters rows through a loomi-input search field", async () => {
    const el = await fixture<LoomiTable>(
      html`<loomi-table searchable search-placeholder="Find staff"></loomi-table>`,
    );
    el.data = [
      { id: 1, name: "Ada", department: "Engineering" },
      { id: 2, name: "Sara", department: "Design" },
      { id: 3, name: "Zane", department: "Engineering" },
    ];
    await el.updateComplete;

    const search = el.shadowRoot!.querySelector("loomi-input.loomi-search-input")!;
    expect(search).to.exist;
    expect(search.getAttribute("prefix-icon")).to.equal("magnifying-glass");

    (search as HTMLElement & { value: string }).value = "design";
    search.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    await el.updateComplete;

    const rows = [...el.shadowRoot!.querySelectorAll("tbody tr")];
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.contain("Sara");
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
    const action = oneEvent(el, "loomi-empty-action");
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
    const pagination = el.shadowRoot!.querySelector<HTMLElement & { showTotalPages: boolean }>(
      "loomi-pagination",
    )!;
    expect(bodyText).to.contain("Ama <ama@example.com>");
    expect(pagination.showTotalPages).to.equal(true);
  });
  it("renders a table authored in plain HTML from header and body templates", async () => {
    // Parsed as real HTML (not a Lit template), where a bare <tr>/<th> outside a <table>
    // would be dropped by the parser.
    const host = await fixture<HTMLDivElement>(html`<div></div>`);
    host.innerHTML = `
      <loomi-table>
        <template slot="header"><th>Item</th><th>Quantity</th></template>
        <template slot="body">
          <tr><td>Office furniture</td><td>2</td></tr>
          <tr><td>Standing desks</td><td>6</td></tr>
        </template>
      </loomi-table>`;
    const el = host.querySelector<LoomiTable>("loomi-table")!;
    await el.updateComplete;

    const heads = [...el.shadowRoot!.querySelectorAll("thead th")].map((th) => th.textContent);
    const rows = el.shadowRoot!.querySelectorAll("tbody tr");
    expect(heads).to.deep.equal(["Item", "Quantity"]);
    expect(rows.length).to.equal(2);
    expect(rows[1].textContent).to.contain("Standing desks");
  });

  describe("horizontal scroll region", () => {
    const WIDE = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person.${i + 1}@a-rather-long-example-domain.com`,
      department: "Research and development",
      location: "Accra, Greater Accra Region",
      phone: "+233 20 000 0000",
    }));

    it("becomes a focusable, labelled region while the table overflows at phone width", async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="width:390px"><loomi-table .data=${WIDE}></loomi-table></div>
      `);
      const el = wrapper.querySelector<LoomiTable>("loomi-table")!;
      const scroll = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll")!;
      await waitUntil(
        () => scroll.hasAttribute("tabindex"),
        "scroll region never became focusable",
      );

      expect(scroll.scrollWidth).to.be.greaterThan(scroll.clientWidth);
      expect(scroll.getAttribute("tabindex")).to.equal("0");
      expect(scroll.getAttribute("role")).to.equal("region");
      expect(scroll.getAttribute("aria-label")).to.equal("Scrollable table");
      await expect(el).to.be.accessible();
    });

    it("scrolls with the arrow keys once focused and shows a focus ring", async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="width:390px"><loomi-table .data=${WIDE}></loomi-table></div>
      `);
      const el = wrapper.querySelector<LoomiTable>("loomi-table")!;
      const scroll = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll")!;
      await waitUntil(() => scroll.hasAttribute("tabindex"));

      // A real Tab press, so :focus-visible matches the way it does for keyboard users.
      const before = document.createElement("button");
      wrapper.prepend(before);
      before.focus();
      await sendKeys({ press: "Tab" });
      expect(el.shadowRoot!.activeElement).to.equal(scroll);
      expect(getComputedStyle(scroll).outlineStyle).to.equal("solid");

      // Playwright's headless WebKit never keyboard-scrolls a focused scroller, not even
      // a plain light-DOM one, so the scroll itself is only checked in the other engines.
      const isPlaywrightWebKit =
        /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      if (isPlaywrightWebKit) return;
      await sendKeys({ press: "ArrowRight" });
      await waitUntil(() => scroll.scrollLeft > 0, "ArrowRight did not scroll the region");
    });

    it("names the region from the host aria-label, then its title", async () => {
      const labelled = await fixture<HTMLDivElement>(html`
        <div style="width:390px">
          <loomi-table aria-label="Staff directory" title="Staff" .data=${WIDE}></loomi-table>
        </div>
      `);
      const titled = await fixture<HTMLDivElement>(html`
        <div style="width:390px"><loomi-table title="Staff" .data=${WIDE}></loomi-table></div>
      `);
      const regionOf = (wrapper: HTMLElement) =>
        wrapper
          .querySelector("loomi-table")!
          .shadowRoot!.querySelector<HTMLElement>(".loomi-scroll")!;
      await waitUntil(() => regionOf(labelled).hasAttribute("role"));
      await waitUntil(() => regionOf(titled).hasAttribute("role"));

      expect(regionOf(labelled).getAttribute("aria-label")).to.equal("Staff directory");
      expect(regionOf(titled).getAttribute("aria-label")).to.equal("Staff");
    });

    it("drops the region again once the table fits", async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div style="width:390px"><loomi-table .data=${WIDE}></loomi-table></div>
      `);
      const el = wrapper.querySelector<LoomiTable>("loomi-table")!;
      const scroll = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll")!;
      await waitUntil(() => scroll.hasAttribute("tabindex"));

      wrapper.style.width = "3000px";
      await waitUntil(() => !scroll.hasAttribute("tabindex"), "region kept its tab stop");
      expect(scroll.hasAttribute("role")).to.be.false;
      expect(scroll.hasAttribute("aria-label")).to.be.false;
    });

    it("adds no tab stop to a table that fits", async () => {
      const el = await fixture<LoomiTable>(
        html`<loomi-table .data=${[{ id: 1, name: "Ama" }]}></loomi-table>`,
      );
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const scroll = el.shadowRoot!.querySelector<HTMLElement>(".loomi-scroll")!;
      expect(scroll.hasAttribute("tabindex")).to.be.false;
      await expect(el).to.be.accessible();
    });
  });
});
