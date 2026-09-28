import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-slider.js";
import type { LoomiSlider } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-slider native parity", () => {
  const ranges = (el: LoomiSlider) =>
    Array.from(el.shadowRoot!.querySelectorAll("input")) as HTMLInputElement[];

  it("setting value moves the handle and form value without firing events", async () => {
    const el = await fixture<LoomiSlider>(html`<loomi-slider></loomi-slider>`);
    const { formValue } = inForm(el, "volume");
    const log = recordFormEvents(el);

    el.value = "40";
    expect(el.value).to.equal("40");
    await el.updateComplete;
    expect(ranges(el)[0].value).to.equal("40");
    expect(formValue()).to.equal("40");
    expect(log).to.deep.equal([]);
  });

  it("range: accepts 'start - end'", async () => {
    const el = await fixture<LoomiSlider>(html`<loomi-slider range></loomi-slider>`);
    el.value = "20 - 80";
    await el.updateComplete;
    expect(el.value).to.equal("20 - 80");
    expect(ranges(el).map((r) => r.value)).to.deep.equal(["20", "80"]);
  });

  it("a keyboard step fires input then change once each", async () => {
    const el = await fixture<LoomiSlider>(html`<loomi-slider selected="10"></loomi-slider>`);
    const log = recordFormEvents(el);
    ranges(el)[0].focus();
    await sendKeys({ press: "ArrowRight" });
    expect(log).to.deep.equal(["input:11", "change:11"]);
  });
});
