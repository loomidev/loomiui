import { html, fixture, expect } from "@open-wc/testing";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-checkcards.js";
import type { LoomiCheckcards } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-checkcards native parity", () => {
  async function cards(max = 1) {
    const el = await fixture<LoomiCheckcards>(html`
      <loomi-checkcards max=${max}>
        <loomi-checkcard value="a" title="A"></loomi-checkcard>
        <loomi-checkcard value="b" title="B"></loomi-checkcard>
        <loomi-checkcard value="c" title="C"></loomi-checkcard>
      </loomi-checkcards>
    `);
    const selected = () =>
      Array.from(el.querySelectorAll("loomi-checkcard"))
        .filter((c) => c.selected)
        .map((c) => c.value);
    return { el, selected };
  }

  it("setting value selects the cards, updates the form and fires nothing", async () => {
    const { el, selected } = await cards(2);
    const { formValue } = inForm(el, "plan");
    const log = recordFormEvents(el);

    el.value = "b";
    expect(selected()).to.deep.equal(["b"]);
    el.values = ["a", "c"];
    expect(el.value).to.equal("a,c");
    expect(selected()).to.deep.equal(["a", "c"]);
    expect(formValue()).to.equal("a,c");
    expect(log).to.deep.equal([]);
  });

  it("re-reads selected-value when it changes after the first render", async () => {
    const { el, selected } = await cards();
    el.setAttribute("selected-value", "c");
    await el.updateComplete;
    expect(selected()).to.deep.equal(["c"]);
  });

  it("a user click fires input then change, with value already updated", async () => {
    const { el } = await cards();
    const log = recordFormEvents(el);
    const card = el.querySelector('loomi-checkcard[value="b"]')!;
    card.shadowRoot!.querySelector<HTMLElement>(".loomi-card")!.click();
    expect(log).to.deep.equal(["input:b", "change:b"]);
  });
});
