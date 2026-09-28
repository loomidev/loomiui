import { html, fixture, expect } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import { recordFormEvents, inForm } from "../../../test/form-events.js";
import "../dist/loomi-tag-input.js";
import type { LoomiTagInput } from "../dist/index.js";

// Native parity: see "Value and events contract" in packages/core/README.md.
describe("loomi-tag-input native parity", () => {
  const field = (el: LoomiTagInput) => el.shadowRoot!.querySelector("input") as HTMLInputElement;

  it("setting value renders the tags, updates the form and fires nothing", async () => {
    const el = await fixture<LoomiTagInput>(html`<loomi-tag-input></loomi-tag-input>`);
    const { formValue } = inForm(el, "tags");
    const log = recordFormEvents(el);

    el.value = "red,green";
    await el.updateComplete;
    expect(el.tags).to.deep.equal(["red", "green"]);
    expect(formValue()).to.equal("red,green");
    expect(log).to.deep.equal([]);
  });

  it("typing a draft fires one input per keystroke; Enter commits with input then change", async () => {
    const el = await fixture<LoomiTagInput>(html`<loomi-tag-input value="red"></loomi-tag-input>`);
    const { formValue } = inForm(el, "tags");
    const log = recordFormEvents(el);

    field(el).focus();
    await sendKeys({ type: "ab" });
    await sendKeys({ press: "Enter" });
    await el.updateComplete;
    // The draft isn't part of `value` until it's committed as a tag.
    expect(log).to.deep.equal(["input:red", "input:red", "input:red,ab", "change:red,ab"]);
    expect(formValue()).to.equal("red,ab");
  });
});
