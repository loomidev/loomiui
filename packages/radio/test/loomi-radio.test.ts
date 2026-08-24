import { html, fixture, expect } from "@open-wc/testing";
import { oneEvent } from "@open-wc/testing";
import "../dist/index.js";
import type { LoomiRadio } from "../dist/index.js";

describe("loomi-radio", () => {
  it("checks and fires change on click", async () => {
    const el = await fixture<LoomiRadio>(
      html`<loomi-radio name="plan" value="pro" label="Pro"></loomi-radio>`,
    );
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    expect(el.checked).to.equal(false);

    setTimeout(() => native.click());
    await oneEvent(el, "change");
    expect(el.checked).to.equal(true);
  });

  it("submits only the checked radio in a named group", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <loomi-radio name="plan" value="basic" label="Basic"></loomi-radio>
        <loomi-radio name="plan" value="pro" label="Pro" checked></loomi-radio>
      </form>
    `);
    const radios = Array.from(form.querySelectorAll("loomi-radio")) as LoomiRadio[];
    for (const radio of radios) await radio.updateComplete;
    expect(new FormData(form).get("plan")).to.equal("pro");
  });

  it("does not check when disabled", async () => {
    const el = await fixture<LoomiRadio>(
      html`<loomi-radio name="plan" value="pro" disabled></loomi-radio>`,
    );
    const native = el.shadowRoot!.querySelector(".loomi-native") as HTMLInputElement;
    expect(native.disabled).to.be.true;
  });

  it("renders its label", async () => {
    const el = await fixture<LoomiRadio>(
      html`<loomi-radio label="Standard shipping"></loomi-radio>`,
    );
    expect(el.shadowRoot!.textContent).to.contain("Standard shipping");
  });
});
