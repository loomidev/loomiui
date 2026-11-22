import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-table.js";
import type { LoomiTable } from "../dist/index.js";

describe("loomi-table: styling hand-written rows", () => {
  it("keeps authored part attributes, so ::part() styles reach them", async () => {
    const style = document.createElement("style");
    style.textContent = "loomi-table::part(status) { color: rgb(10, 20, 30); }";
    document.head.append(style);
    try {
      const el = await fixture<LoomiTable>(html`<loomi-table>
        <template slot="header"><th>Order</th><th>Status</th></template>
        <template slot="body"><tr><td>#1</td><td><span part="status">Paid</span></td></tr></template>
      </loomi-table>`);
      const span = el.shadowRoot!.querySelector<HTMLElement>('[part="status"]')!;
      expect(getComputedStyle(span).color).to.equal("rgb(10, 20, 30)");
    } finally {
      style.remove();
    }
  });

  it('applies a <template slot="styles"> inside the table', async () => {
    const el = await fixture<LoomiTable>(html`<loomi-table>
      <template slot="styles"><style>.flag { color: rgb(40, 50, 60); }</style></template>
      <template slot="body"><tr><td><span class="flag">!</span></td></tr></template>
    </loomi-table>`);
    const span = el.shadowRoot!.querySelector<HTMLElement>(".flag")!;
    expect(getComputedStyle(span).color).to.equal("rgb(40, 50, 60)");
  });

  it("ships badge, muted, thumb and actions cell helpers", async () => {
    const el = await fixture<LoomiTable>(html`<loomi-table>
      <template slot="body"><tr>
        <td><img class="thumb" alt="" /></td>
        <td>Rice<span class="muted">SKU 1</span></td>
        <td><span class="badge badge-success">Paid</span></td>
        <td><div class="actions"><a href="#">Edit</a></div></td>
      </tr></template>
    </loomi-table>`);
    const q = (s: string) => getComputedStyle(el.shadowRoot!.querySelector(s)!);
    expect(q(".thumb").width).to.equal("40px");
    expect(q(".muted").display).to.equal("block");
    expect(q(".badge").display).to.equal("inline-flex");
    expect(q(".badge-success").backgroundColor).to.not.equal(q(".badge").color);
    expect(q(".actions").justifyContent).to.equal("flex-end");
  });
});
