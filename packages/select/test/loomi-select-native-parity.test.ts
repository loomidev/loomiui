import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-select.js";
import type { LoomiSelect } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
const DATA = [
  { label: "Apple", value: "a" },
  { label: "Banana", value: "b" },
  { label: "Cherry", value: "c" },
];

const shown = (el: LoomiSelect) =>
  el.shadowRoot!.querySelector(".loomi-value")!.textContent!.trim();

async function pick(el: LoomiSelect, label: string) {
  if (!el.shadowRoot!.querySelector(".loomi-panel")) {
    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
  }
  const option = Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>(".loomi-option")).find(
    (o) => o.textContent!.trim() === label,
  )!;
  option.click();
  await el.updateComplete;
}

describe("loomi-select native parity", () => {
  it("setting value selects the option, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
    const { formValue } = inForm(el, "fruit");
    const log = recordFormEvents(el);

    el.value = "b";
    expect(el.value).to.equal("b");
    expect(el.values).to.deep.equal(["b"]);
    await el.updateComplete;
    expect(shown(el)).to.equal("Banana");
    expect(formValue()).to.equal("b");
    expect(log).to.deep.equal([]);
  });

  it("value reflects selected-value before the first render", async () => {
    const el = document.createElement("loomi-select") as LoomiSelect;
    el.setAttribute("selected-value", "c");
    expect(el.value).to.equal("c");
  });

  it("multiple: value is comma-joined and values is settable, without events", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select multiple .data=${DATA}></loomi-select>`,
    );
    const { formValue } = inForm(el, "fruit");
    const log = recordFormEvents(el);

    el.values = ["a", "c"];
    expect(el.value).to.equal("a,c");
    await el.updateComplete;
    expect(shown(el)).to.equal("Apple, Cherry");
    expect(formValue()).to.equal("a,c");

    el.value = "b";
    expect(el.values).to.deep.equal(["b"]);
    expect(log).to.deep.equal([]);
  });

  it("a user pick fires input then change, with value already updated", async () => {
    const el = await fixture<LoomiSelect>(html`<loomi-select .data=${DATA}></loomi-select>`);
    const { formValue } = inForm(el, "fruit");
    const log = recordFormEvents(el);

    await pick(el, "Cherry");
    expect(log).to.deep.equal(["input:c", "change:c"]);
    expect(formValue()).to.equal("c");
  });

  it("multiple: each user toggle fires input then change with the joined value", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select multiple .data=${DATA}></loomi-select>`,
    );
    const log = recordFormEvents(el);
    await pick(el, "Apple");
    await pick(el, "Cherry");
    expect(log).to.deep.equal(["input:a", "change:a", "input:a,c", "change:a,c"]);
  });

  it("typing in the search box does not fire input on the host", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select searchable .data=${DATA}></loomi-select>`,
    );
    const log = recordFormEvents(el);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".loomi-trigger")!.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLInputElement>(".loomi-search")!.focus();
    await sendKeys({ type: "ch" });
    expect(log).to.deep.equal([]);
  });

  it("keeps a user pick when the options are swapped afterwards", async () => {
    const el = await fixture<LoomiSelect>(
      html`<loomi-select selected-value="a" .data=${DATA}></loomi-select>`,
    );
    await pick(el, "Banana");
    el.data = [...DATA];
    await el.updateComplete;
    expect(el.value).to.equal("b");
  });
});
