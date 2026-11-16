import { html, fixture, expect } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiTable } from "../dist/index.js";

const tpl = html`<loomi-table>
  <template slot="header"><th>Item</th><th align="end" nowrap width="8rem">Price</th></template>
  <template slot="body">
    <tr><td>Rice</td><td>GHS 1,200.00</td></tr>
    <tr><td>Beans</td><td>GHS 80.00</td></tr>
  </template>
  <template slot="footer"><tr><td>Total</td><td>GHS 1,280.00</td></tr></template>
</loomi-table>`;

describe("loomi-table manual templates", () => {
  it("renders footer rows in a tfoot", async () => {
    const el = await fixture<LoomiTable>(tpl);
    const tfoot = el.shadowRoot!.querySelector("tfoot")!;
    expect(tfoot.textContent).to.contain("GHS 1,280.00");
  });

  it("applies header column options to the whole column", async () => {
    const el = await fixture<LoomiTable>(tpl);
    const bodyCell = el.shadowRoot!.querySelector<HTMLElement>("tbody tr td:nth-child(2)")!;
    const footCell = el.shadowRoot!.querySelector<HTMLElement>("tfoot tr td:nth-child(2)")!;
    expect(getComputedStyle(bodyCell).textAlign).to.equal("end");
    expect(getComputedStyle(bodyCell).whiteSpace).to.equal("nowrap");
    expect(getComputedStyle(footCell).textAlign).to.equal("end");
    const firstCell = el.shadowRoot!.querySelector<HTMLElement>("tbody tr td:nth-child(1)")!;
    expect(getComputedStyle(firstCell).textAlign).to.equal("start");
  });

  it("exposes row/cell parts", async () => {
    const el = await fixture<LoomiTable>(tpl);
    const r = el.shadowRoot!;
    expect(r.querySelector("thead th")!.part.contains("header-cell")).to.equal(true);
    expect(r.querySelector("tbody td")!.part.contains("cell")).to.equal(true);
    expect(r.querySelector("tfoot td")!.part.contains("footer-cell")).to.equal(true);
    expect(r.querySelector("tbody tr")!.part.contains("row")).to.equal(true);
  });
});
