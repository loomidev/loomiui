import { html, fixture, expect } from "@open-wc/testing";
import "../dist/loomi-input.js";
import type { LoomiInput } from "../dist/index.js";

const formOf = async (tpl: ReturnType<typeof html>) => {
  const form = await fixture<HTMLFormElement>(html`<form>${tpl}</form>`);
  const el = form.querySelector("loomi-input") as LoomiInput;
  await el.updateComplete;
  return { form, el };
};

describe("loomi-input affix form values", () => {
  it("submits the selected suffix under suffix-name", async () => {
    const { form } = await formOf(
      html`<loomi-input name="size" value="5" suffix-options="kg|g|lb" suffix-name="measure"></loomi-input>`,
    );
    const data = new FormData(form);
    expect(data.get("size")).to.equal("5");
    expect(data.get("measure")).to.equal("kg");
  });

  it("supports value/label pairs and updates the form before loomi-suffix-change", async () => {
    const { form, el } = await formOf(
      html`<loomi-input
        name="size"
        value="5"
        suffix-options='[{"value":"1","label":"Kilograms"},{"value":"2","label":"Grams"}]'
        suffix-name="measure_id"
        prefix-options='{"usd":"US$","ghs":"GH₵"}'
        prefix-name="currency"
        prefix-value="ghs"
      ></loomi-input>`,
    );
    const select = el.shadowRoot!.querySelectorAll<HTMLSelectElement>(".loomi-affix-select");
    expect(Array.from(select[1].options).map((o) => o.textContent)).to.deep.equal([
      "Kilograms",
      "Grams",
    ]);
    expect(new FormData(form).get("currency")).to.equal("ghs");

    let seen: FormDataEntryValue | null = null;
    el.addEventListener("loomi-suffix-change", () => (seen = new FormData(form).get("measure_id")));
    select[1].value = "2";
    select[1].dispatchEvent(new Event("change"));
    expect(seen).to.equal("2");
    expect(el.suffixValue).to.equal("2");
  });

  it("without names, submits only the field value", async () => {
    const { form } = await formOf(
      html`<loomi-input name="size" value="5" suffix-options="kg|g"></loomi-input>`,
    );
    expect(Array.from(new FormData(form).keys())).to.deep.equal(["size"]);
  });
});
